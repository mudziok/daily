import { eachDayOfInterval, format, getDate } from "date-fns";
import Link from "next/link";
import type { FC } from "react";
import { useMemo } from "react";

interface DayProps {
  date: Date;
  status: "completed" | "skipped" | "unknown";
}

export const Day: FC<DayProps> = ({ date, status }) => {
  const statusStyles = {
    unknown: "text-slate-600",
    completed: "ring-1 bg-emerald-500",
    skipped: "bg-gray-900 h-6",
  };

  const streak = status === "completed" || status === "skipped";

  return (
    <Link
      className="relative flex aspect-square flex-1 items-center justify-center py-1"
      href={{ pathname: "calendar", query: { date: format(date, "yyyy-M-d") } }}
      prefetch={false}
    >
      {streak && (
        <hr className="absolute w-full border-[0.5px] border-emerald-500" />
      )}
      <span
        className={`absolute flex aspect-square h-8 items-center justify-center rounded-full ring-emerald-500 ${statusStyles[status]}`}
      >
        {getDate(date)}
      </span>
    </Link>
  );
};

interface CalendarProps {
  startDate: Date;
  endDate: Date;
  Day: FC<{ date: Date }>;
}

export const Calendar: FC<CalendarProps> = ({ startDate, endDate, Day }) => {
  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const startDateWeekday = startDate.getDay() + 1;

  return (
    <div className="grid grid-cols-7">
      {days.map((date, index) => (
        <div
          key={date.toISOString()}
          style={
            index === 0 ? { gridColumnStart: startDateWeekday } : undefined
          }
          className="flex items-center justify-center"
        >
          <Day date={date} />
        </div>
      ))}
    </div>
  );
};
