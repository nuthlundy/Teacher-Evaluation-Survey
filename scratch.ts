import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.evaluationAnswer.deleteMany();
  await prisma.evaluationComment.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.classTeacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.teacher.deleteMany();
  console.log("Deleted all evaluations, classes, and teachers successfully.");
}

main().finally(() => prisma.$disconnect());
