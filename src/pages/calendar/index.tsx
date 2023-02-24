import type { NextPage } from "next";
import { format } from "date-fns";
import { useDateParam } from "hooks/useDateParam";
import { api } from "utils/api";
import { fromEvent, interval, Subject, throttle, merge } from "rxjs";
import { useEffect } from "react";
import { CalendarLayout } from "layouts/CalendarLayout";

const entryChange = new Subject<{ value: string; date: Date }>();

const CalendarPage: NextPage = () => {
  const date = useDateParam();
  const utils = api.useContext();

  const { data } = api.entry.getEntry.useQuery({ date });
  const { mutate } = api.entry.setEntry.useMutation();

  useEffect(() => {
    const shouldSave = merge(interval(1000), fromEvent(window, "beforeunload"));
    const subscription = entryChange
      .pipe(throttle(() => shouldSave, { trailing: true }))
      .subscribe(mutate);
    return () => subscription.unsubscribe();
  }, [mutate]);

  /* eslint-disable @typescript-eslint/no-misused-promises */
  useEffect(() => {
    const subscription = entryChange.subscribe(async ({ value, date }) => {
      await utils.entry.getEntry.cancel({ date });
      utils.entry.getEntry.setData({ date }, () => value);

      await utils.calendar.getCalendar.cancel();
      const calendarData = utils.calendar.getCalendar.getData() || new Map();

      if (value && !calendarData.has(date.toDateString())) {
        const optimisticCalendarData = new Map(calendarData);
        optimisticCalendarData.set(date.toDateString(), "completed");
        utils.calendar.getCalendar.setData(
          undefined,
          () => optimisticCalendarData
        );
      } else if (!value && calendarData.has(date.toDateString())) {
        const optimisticCalendarData = new Map(calendarData);
        optimisticCalendarData.delete(date.toDateString());
        utils.calendar.getCalendar.setData(
          undefined,
          () => optimisticCalendarData
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [utils]);

  return (
    <CalendarLayout>
      <main className="flex flex-1 flex-col">
        <span className="mx-4 mt-4 text-2xl">
          {format(date, "d MMMM yyyy")}
        </span>
        <textarea
          className="m-4 flex-1 resize-none rounded bg-gray-900 p-4 focus:outline-none"
          value={data}
          onChange={(e) => entryChange.next({ value: e.target.value, date })}
        />
      </main>
    </CalendarLayout>
  );
};

export default CalendarPage;
