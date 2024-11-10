"use client";
import { Task } from "./types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { EventCard } from "./event-card";
import { Button } from "@/app/_components/ui/button";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import "react-big-calendar/lib/addons/dragAndDrop/styles";

interface DataCalendarProps {
  data: Task[];
}

const locales = {
  "en-US": enUS,
};

const locallizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const DataCalendar = ({ data }: DataCalendarProps) => {
  //if task,get latest task month   else current month
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={locallizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        toolbar: () => (
          <CustomToolBar date={value} onNavigate={handleNavigate} />
        ),

        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
      }}
    />
  );
};

interface CustomToolBarProps {
  date: any;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolBar = ({ date, onNavigate }: CustomToolBarProps) => {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-a justify-center lg:justify-start">
      <Button
        size="icon"
        variant={"secondary"}
        onClick={() => onNavigate("PREV")}
        className="flex items-center"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        size="icon"
        variant={"secondary"}
        onClick={() => onNavigate("NEXT")}
        className="flex items-center"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};
