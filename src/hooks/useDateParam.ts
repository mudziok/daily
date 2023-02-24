import { startOfDay } from "date-fns";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { z } from "zod";

export const useDateParam = () => {
  const router = useRouter();
  const { date } = router.query;
  const parsedDate = useMemo(() => z.coerce.date().safeParse(date), [date]);
  const currentDate = parsedDate.success ? parsedDate.data : new Date();
  const startOfDayDate = startOfDay(currentDate);

  return startOfDayDate;
};
