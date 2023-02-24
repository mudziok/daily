import { Calendar, Day } from "components/Calendar";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  addMonths,
} from "date-fns";
import type { FC, PropsWithChildren } from "react";
import { useDeferredValue } from "react";
import { useMemo, memo } from "react";
import { api } from "utils/api";

const startDate = startOfMonth(addMonths(new Date(), -1));

const interval = {
  start: startDate,
  end: addMonths(startDate, 3),
};

const months = eachMonthOfInterval(interval);
const MemoizedCalendar = memo(Calendar);

export const CalendarLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data } = api.calendar.getCalendar.useQuery();
  const defferedData = useDeferredValue(data);

  const MemoizedDay = useMemo(() => {
    const getStatus = (date: Date) => {
      const status = defferedData && defferedData.get(date.toDateString());
      return status || "unknown";
    };

    const day = ({ date }: { date: Date }) => (
      <Day date={date} status={getStatus(date)} />
    );
    return day;
  }, [defferedData]);

  return (
    <div className="fixed inset-0 flex font-semibold text-gray-300">
      <aside className="flex w-80 flex-col gap-2 overflow-x-auto bg-gray-900 py-4">
        {months.map((monthStart) => (
          <div key={monthStart.toDateString()}>
            <span className="mx-4 text-2xl text-gray-600">
              {format(monthStart, "MMMM")}
            </span>
            <MemoizedCalendar
              startDate={monthStart}
              endDate={endOfMonth(monthStart)}
              Day={MemoizedDay}
            />
          </div>
        ))}
      </aside>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
};
