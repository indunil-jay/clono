"use client";
import { DottedSeparator } from "@/app/_components/custom/dotted-separator";
import { Button } from "@/app/_components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { useCreateTaskModal } from "./hooks/useCreateTaskModal";

export const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal();
  return (
    <Tabs className="flex-1 w-full border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calender
            </TabsTrigger>
          </TabsList>

          <Button onClick={open}>
            <PlusCircle className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="mt-4" />
        {/* add filters */}
        Data filters
        <DottedSeparator className="mt-4" />
        <>
          <TabsContent value="table" className="mt-0">
            table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            clendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
