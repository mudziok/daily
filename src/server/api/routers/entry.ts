import { startOfDay } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const entryRouter = createTRPCRouter({
  getEntry: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      const { date } = input;
      const { session, prisma } = ctx;
      const { id: userId } = session.user;
      const createdAt = startOfDay(date);

      const entry = await prisma.entry.findUnique({
        where: { createdAt_userId: { createdAt, userId } },
      });

      return (entry && entry.text) || "";
    }),
  setEntry: protectedProcedure
    .input(z.object({ date: z.date(), value: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { value: text, date } = input;
      const { prisma, session } = ctx;
      const { id: userId } = session.user;
      const createdAt = startOfDay(date);

      if (text === "") {
        return await prisma.entry.deleteMany({
          where: { userId, createdAt },
        });
      }

      const entry = await prisma.entry.upsert({
        where: { createdAt_userId: { createdAt, userId } },
        create: { createdAt, text, userId },
        update: { text },
      });

      return entry;
    }),
});
