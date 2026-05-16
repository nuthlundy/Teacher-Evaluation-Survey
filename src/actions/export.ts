"use server";

import { prisma } from "@/lib/prisma";

export async function exportBatchCampusCSV(campusId: string) {
  // Fetch teachers explicitly linked to the selected campus in batches to prevent Server Closed Connection
  const batchSize = 10;
  let offset = 0;
  const teachers = [];

  while (true) {
    const batch = await prisma.teacher.findMany({
      where: { campuses: { some: { id: campusId } } },
      include: {
        campuses: true,
        class_teachers: {
          include: { class: true }
        },
        evaluations: {
          include: {
            answers: {
              include: { question: true }
            },
            comments: true
          }
        }
      },
      orderBy: { teacher_name: "asc" },
      take: batchSize,
      skip: offset
    });

    if (batch.length === 0) break;
    teachers.push(...batch);
    offset += batchSize;
  }

  if (teachers.length === 0) {
    return { error: "No teachers found for this campus." };
  }

  // Create CSV Header aligning with Aloe Mie sample
  let csv = "Teacher ID,Teacher Name,Subject,Classes,Overall Score,Instructional Skills,Classroom Management,Student Engagement,Professionalism,General,Positive Comments,Improvement Suggestions\n";

  for (const teacher of teachers) {
    const classes = teacher.class_teachers.map(ct => ct.class.class_code).join("; ");
    
    // Aggregate scores
    const categoryScores: Record<string, { total: number, count: number }> = {
      "Instructional Skills": { total: 0, count: 0 },
      "Classroom Management": { total: 0, count: 0 },
      "Student Engagement": { total: 0, count: 0 },
      "Professionalism": { total: 0, count: 0 },
      "General": { total: 0, count: 0 }
    };

    let overallTotal = 0;
    let overallCount = 0;

    teacher.evaluations.forEach(evalRecord => {
      evalRecord.answers.forEach(ans => {
        const cat = ans.question.category;
        if (categoryScores[cat]) {
          categoryScores[cat].total += ans.score;
          categoryScores[cat].count += 1;
        }
        overallTotal += ans.score;
        overallCount += 1;
      });
    });

    const getAvg = (cat: string) => categoryScores[cat].count > 0 
      ? (categoryScores[cat].total / categoryScores[cat].count).toFixed(2) 
      : "N/A";
    
    const overallAvg = overallCount > 0 ? (overallTotal / overallCount).toFixed(2) : "N/A";

    // Comments
    let allComments = "";
    teacher.evaluations.forEach(e => {
      e.comments.forEach(c => {
        if (c.comment.trim()) {
          allComments += c.comment.replace(/"/g, '""') + "; ";
        }
      });
    });

    const row = [
      `"${teacher.teacher_code}"`,
      `"${teacher.teacher_name}"`,
      `"${teacher.subject || ""}"`,
      `"${classes}"`,
      overallAvg,
      getAvg("Instructional Skills"),
      getAvg("Classroom Management"),
      getAvg("Student Engagement"),
      getAvg("Professionalism"),
      getAvg("General"),
      `"${allComments}"`, // Positive comments
      `""` // Improvement suggestions (can be split later if AI classification is added)
    ];

    csv += row.join(",") + "\n";
  }

  return { csv, filename: `Batch_Export_${teachers[0]?.campuses?.[0]?.code || "Campus"}.csv` };
}

import ExcelJS from "exceljs";

export async function exportTeacherBatchExcel(teacherId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      campuses: true,
      evaluations: {
        include: {
          class: {
            include: { campus: true }
          },
          answers: {
            include: { question: true }
          },
          comments: true
        }
      }
    }
  });

  if (!teacher) {
    return { error: "Teacher not found." };
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Teacher Evaluation System";

  // Group evaluations by Campus ID
  const evalsByCampus: Record<string, typeof teacher.evaluations> = {};
  
  teacher.evaluations.forEach(e => {
    const cid = e.class.campus.id;
    if (!evalsByCampus[cid]) evalsByCampus[cid] = [];
    evalsByCampus[cid].push(e);
  });

  // If no evaluations, just create a blank sheet for their campuses
  if (Object.keys(evalsByCampus).length === 0) {
    teacher.campuses.forEach(c => {
      const sheet = workbook.addWorksheet(c.code);
      sheet.addRow(["No evaluations found for this campus."]);
    });
  }

  // Define questions metadata so we can calculate per question
  const questions = await prisma.evaluationQuestion.findMany({ orderBy: { order_no: "asc" } });

  for (const [campusId, evals] of Object.entries(evalsByCampus)) {
    const campus = evals[0].class.campus;
    const sheetName = campus.code.substring(0, 31); // Excel limit
    const sheet = workbook.addWorksheet(sheetName);

    // Aloe Mie Header
    sheet.mergeCells('A1:D1');
    sheet.getCell('A1').value = "Teaching Performance Survey";
    sheet.getCell('A1').font = { bold: true, size: 14 };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    sheet.mergeCells('A2:D2');
    sheet.getCell('A2').value = `Name: ${teacher.teacher_name} (${teacher.teacher_code})`;
    sheet.getCell('A2').font = { bold: true, size: 12 };
    sheet.getCell('A2').alignment = { horizontal: 'center' };

    sheet.addRow([]);

    // Data grouped by class to build the columns
    const classesMap = new Map<string, typeof evals>();
    evals.forEach(e => {
      const ccode = e.class.class_code;
      if (!classesMap.has(ccode)) classesMap.set(ccode, []);
      classesMap.get(ccode)!.push(e);
    });

    const classCodes = Array.from(classesMap.keys());
    
    // Header Row: No, Contents, [Class Codes...]
    const headerRow = ["No.", "Contents", ...classCodes];
    sheet.addRow(headerRow).font = { bold: true };

    let rowIndex = 5;
    let totalScoreSum = 0;
    let totalScoreCount = 0;
    const classTotals: Record<string, { sum: number, count: number }> = {};
    classCodes.forEach(cc => classTotals[cc] = { sum: 0, count: 0 });

    questions.forEach((q, idx) => {
      const rowData: any[] = [idx + 1, `${q.question_en} (${q.question_kh})`];
      
      classCodes.forEach(cc => {
        const classEvals = classesMap.get(cc)!;
        let qTotal = 0;
        let qCount = 0;
        
        classEvals.forEach(e => {
          const ans = e.answers.find(a => a.question_id === q.id);
          if (ans) {
            qTotal += ans.score;
            qCount++;
            
            classTotals[cc].sum += ans.score;
            classTotals[cc].count++;
            
            totalScoreSum += ans.score;
            totalScoreCount++;
          }
        });

        // Percentage = (Sum of Scores / (Count * 5)) * 100
        const avg = qCount > 0 ? ((qTotal / (qCount * 5)) * 100).toFixed(2) + "%" : "N/A";
        rowData.push(avg);
      });

      sheet.addRow(rowData);
    });

    // Total Row
    const totalRow = ["", "Total"];
    classCodes.forEach(cc => {
      const avg = classTotals[cc].count > 0 ? ((classTotals[cc].sum / (classTotals[cc].count * 5)) * 100).toFixed(2) + "%" : "N/A";
      totalRow.push(avg);
    });
    sheet.addRow(totalRow).font = { bold: true };
    
    sheet.addRow([]);
    sheet.addRow(["Comments grouped by Class:"]).font = { bold: true };

    // Group comments by class
    classCodes.forEach(cc => {
      sheet.addRow([`Class: ${cc}`]).font = { bold: true, italic: true };
      const classEvals = classesMap.get(cc)!;
      let hasComments = false;
      classEvals.forEach(e => {
        e.comments.forEach(c => {
          if (c.comment.trim()) {
            sheet.addRow(["", c.comment]);
            hasComments = true;
          }
        });
      });
      if (!hasComments) sheet.addRow(["", "No comments."]);
      sheet.addRow([]);
    });

    // Formatting columns
    sheet.getColumn(1).width = 5;
    sheet.getColumn(2).width = 80;
    for (let i = 0; i < classCodes.length; i++) {
      sheet.getColumn(3 + i).width = 15;
      sheet.getColumn(3 + i).alignment = { horizontal: 'center' };
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return { 
    excelBase64: Buffer.from(buffer).toString("base64"), 
    filename: `Evaluation_${teacher.teacher_code}.xlsx` 
  };
}
