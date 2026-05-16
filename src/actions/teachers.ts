"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeachers() {
  return await prisma.teacher.findMany({
    include: { campuses: true },
    orderBy: { teacher_name: "asc" },
  });
}

export async function upsertTeacher(data: { teacher_code: string; teacher_name: string; subject?: string; campus_id: string }) {
  const existingTeacher = await prisma.teacher.findUnique({
    where: { teacher_code: data.teacher_code }
  });

  if (existingTeacher) {
    let mergedSubject = existingTeacher.subject || "";
    if (data.subject) {
      const existing = mergedSubject.split(',').map(s => s.trim()).filter(Boolean);
      const incoming = data.subject.split(',').map(s => s.trim()).filter(Boolean);
      mergedSubject = Array.from(new Set([...existing, ...incoming])).join(', ');
    }

    await prisma.teacher.update({
      where: { id: existingTeacher.id },
      data: {
        subject: mergedSubject || null,
        campuses: {
          connect: { id: data.campus_id }
        }
      }
    });
  } else {
    await prisma.teacher.create({
      data: {
        teacher_code: data.teacher_code,
        teacher_name: data.teacher_name,
        subject: data.subject || null,
        campuses: {
          connect: { id: data.campus_id }
        }
      }
    });
  }
  revalidatePath("/admin/teachers");
}

export async function deleteTeacher(id: string) {
  await prisma.classTeacher.deleteMany({ where: { teacher_id: id } });
  await prisma.teacher.delete({ where: { id } });
  revalidatePath("/admin/teachers");
}

export async function bulkCreateTeachers(teachers: { teacher_code: string; teacher_name: string; subject?: string; campus_code: string; class_codes?: string }[]) {
  const campuses = await prisma.campus.findMany();
  
  const campusMap = new Map();
  campuses.forEach(c => {
    campusMap.set(c.code.toUpperCase(), c.id);
    campusMap.set(c.name.toUpperCase(), c.id);
  });

  let count = 0;

  for (const t of teachers) {
    const cid = campusMap.get(t.campus_code?.toUpperCase());
    if (!cid) continue;

    let teacherId = "";

    const existingTeacher = await prisma.teacher.findUnique({
      where: { teacher_code: t.teacher_code }
    });

    if (existingTeacher) {
      teacherId = existingTeacher.id;
      let mergedSubject = existingTeacher.subject || "";
      if (t.subject) {
        const existing = mergedSubject.split(',').map(s => s.trim()).filter(Boolean);
        const incoming = t.subject.split(',').map(s => s.trim()).filter(Boolean);
        mergedSubject = Array.from(new Set([...existing, ...incoming])).join(', ');
      }

      await prisma.teacher.update({
        where: { id: existingTeacher.id },
        data: {
          subject: mergedSubject || null,
          campuses: {
            connect: { id: cid }
          }
        }
      });
    } else {
      const newTeacher = await prisma.teacher.create({
        data: {
          teacher_code: t.teacher_code,
          teacher_name: t.teacher_name,
          subject: t.subject || null,
          campuses: {
            connect: { id: cid }
          }
        }
      });
      teacherId = newTeacher.id;
    }

    if (t.class_codes && teacherId) {
      const cCodes = t.class_codes.split(',').map(c => c.trim()).filter(Boolean);
      for (const code of cCodes) {
        const cls = await prisma.class.findUnique({ where: { class_code: code } });
        if (cls) {
          const existingLink = await prisma.classTeacher.findFirst({
            where: { class_id: cls.id, teacher_id: teacherId }
          });
          if (!existingLink) {
            await prisma.classTeacher.create({
              data: { class_id: cls.id, teacher_id: teacherId }
            });
          }
        }
      }
    }

    count++;
  }
  
  revalidatePath("/admin/teachers");
  return count;
}
