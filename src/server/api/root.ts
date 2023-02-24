import { createTRPCRouter } from "./trpc";
import { entryRouter } from "./routers/entry";
import { calendarRouter } from "./routers/calendar";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  entry: entryRouter,
  calendar: calendarRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
