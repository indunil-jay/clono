import { useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "./types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

interface DataKanbanProps {
  data: Task[];
  onChange: (
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.DONE,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.TODO,
];

type TaskState = {
  [key in TaskStatus]: Task[];
};

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TaskState>(() => {
    //load inital states
    const initialTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    //push each task to category
    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    //sort
    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks: TaskState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    //push each task to category
    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    //sort
    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatesPayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      setTasks((prevTask) => {
        const newTask = { ...prevTask };

        //remove task from source colum
        const sourceColumn = [...newTask[sourceStatus]];
        //get the moved task
        const [movedTask] = sourceColumn.splice(source.index, 1);
        //if there;s no moved tak
        if (!movedTask) {
          console.error("No task found at the source index");
          return prevTask;
        }

        //create a task object,with potentially updated status
        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        //updated the source column
        newTask[sourceStatus] = sourceColumn;

        //add the task to the destination column
        const destinationColumn = [...newTask[destinationStatus]];
        destinationColumn.splice(destination.index, 0, updatedMovedTask);
        newTask[destinationStatus] = destinationColumn;

        //updates payloads
        updatesPayload = [];

        //always updated the moved taks
        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        //update postion for affected taks in destination columns
        newTask[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);

            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        //if the task moved between columns, update postins in source column
        if (sourceStatus !== destinationStatus) {
          newTask[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTask;
      });
      onChange(updatesPayload);
    },
    [onChange]
  );
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px] "
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />

              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
