"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClasses() {
  return await prisma.class.findMany({
    include: { 
      campus: true,
      class_teachers: {
        include: { teacher: true }
      }
    },
    orderBy: { class_code: "asc" },
  });
}

export async function createClass(data: { class_code: string; campus_id: string; grade: string; section: string; teacher_id?: string }) {
  const newClass = await prisma.class.create({ 
    data: {
      class_code: data.class_code,
      campus_id: data.campus_id,
      grade: data.grade,
      section: data.section
    } 
  });
  
  if (data.teacher_id) {
    await prisma.classTeacher.create({
      data: {
        class_id: newClass.id,
        teacher_id: data.teacher_id
      }
    });
  }
  revalidatePath("/admin/classes");
}

export async function linkTeacherToClass(class_id: string, formData: FormData) {
  const teacher_id = formData.get("teacher_id") as string;
  if (!teacher_id) return;

  // Check if exists
  const existing = await prisma.classTeacher.findFirst({
    where: { class_id, teacher_id }
  });
  if (!existing) {
    await prisma.classTeacher.create({
      data: { class_id, teacher_id }
    });
    revalidatePath("/admin/classes");
    revalidatePath("/admin/reports");
  }
}

export async function deleteClass(id: string) {
  await prisma.classTeacher.deleteMany({ where: { class_id: id } }); // cascade
  await prisma.class.delete({ where: { id } });
  revalidatePath("/admin/classes");
}

export async function bulkCreateClasses(classes: { class_code: string; grade: string; section: string; campus_code: string; teacher_code?: string; teacher_name?: string }[]) {
  const campuses = await prisma.campus.findMany();
  const teachers = await prisma.teacher.findMany();
  
  const campusMap = new Map();
  campuses.forEach(c => {
    campusMap.set(c.code.toUpperCase(), c.id);
    campusMap.set(c.name.toUpperCase(), c.id);
  });

  const teacherMap = new Map();
  teachers.forEach(t => {
    teacherMap.set(t.teacher_code.toUpperCase(), t.id);
    teacherMap.set(t.teacher_name.toUpperCase(), t.id);
  });

  let count = 0;

  for (const c of classes) {
    const cid = campusMap.get(c.campus_code?.toUpperCase());
    if (!cid) continue;

    const upsertedClass = await prisma.class.upsert({
      where: { class_code: c.class_code },
      update: {
        grade: c.grade,
        section: c.section,
        campus_id: cid
      },
      create: {
        class_code: c.class_code,
        grade: c.grade,
        section: c.section,
        campus_id: cid
      }
    });
    count++;

    // Handle multiple comma-separated teacher codes
    if (c.teacher_code) {
      const tCodes = c.teacher_code.split(',').map(tc => tc.trim()).filter(Boolean);
      for (const tCode of tCodes) {
        let tid = teacherMap.get(tCode.toUpperCase());
        if (!tid && c.teacher_name && tCodes.length === 1) { 
          tid = teacherMap.get(c.teacher_name.toUpperCase());
        }

        if (tid) {
          // Connect to Class
          const existingLink = await prisma.classTeacher.findFirst({
            where: { class_id: upsertedClass.id, teacher_id: tid }
          });
          if (!existingLink) {
            await prisma.classTeacher.create({
              data: {
                class_id: upsertedClass.id,
                teacher_id: tid
              }
            });
          }
          // Ensure connected to Campus
          await prisma.teacher.update({
            where: { id: tid },
            data: { campuses: { connect: { id: cid } } }
          });
        } else if (c.teacher_name && tCodes.length === 1) {
          // Create new Teacher from Class CSV data
          const newTeacher = await prisma.teacher.create({
            data: {
              teacher_code: tCode,
              teacher_name: c.teacher_name,
              campuses: { connect: { id: cid } }
            }
          });
          teacherMap.set(newTeacher.teacher_code.toUpperCase(), newTeacher.id);
          
          await prisma.classTeacher.create({
            data: {
              class_id: upsertedClass.id,
              teacher_id: newTeacher.id
            }
          });
        }
      }
    }
  }
  
  revalidatePath("/admin/classes");
  return count;
}
