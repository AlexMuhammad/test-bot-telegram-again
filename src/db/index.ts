import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function logQuery(
  userId: number,
  chatId: number,
  input: string,
  response: string
) {
  await prisma.queryLog.create({
    data: {
      userId,
      chatId,
      input,
      response,
    },
  });
}

export async function getRecentLogs(chatId: any) {
  const logs = await prisma.queryLog.findMany({
    where: { chatId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return logs;
}

export async function getLogList(input?: string, chatId?: number) {
  const logs = await prisma.queryLog.findMany({
    where: { input, chatId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return logs;
}
