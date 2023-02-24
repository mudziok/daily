import { createTRPCRouter, protectedProcedure } from "../trpc";

export const calendarRouter = createTRPCRouter({
  getCalendar: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;
    const { id: userId } = session.user;

    const statuses = new Map<string, "completed" | "skipped">();

    const completedEntries = await prisma.entry.findMany({ where: { userId } });
    completedEntries.forEach(({ createdAt }) =>
      statuses.set(createdAt.toDateString(), "completed")
    );

    return statuses;
  }),
});
