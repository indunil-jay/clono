import { ColumnDef } from "@tanstack/react-table";
import { Task } from "./schema";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { ProjectAvatar } from "@/app/_features/projects/project-avatar";
import { MemberAvatar } from "@/app/_features/members/member-avatar";
import { TaskTableDateString } from "./task-table-date-string";
import { DataTableStatusBadge } from "./data-table-status-badge";
import { DataTableRowActions } from "./data-table-row-action";

export const columns :ColumnDef<Task>[] = [
    {
        id:'select',
        header:({table})=>(
            <Checkbox
            
            checked={
                table.getIsAllRowsSelected() ||   (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="select-all"
            className="translate-y-[2px]"
            
            />
        ),

        cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="select-row"
              className="translate-y-[2px]"
            />
          ),
          enableSorting: false,
          enableHiding: false,
    },

    {
        accessorKey:"name",
        header:({column})=>(<DataTableColumnHeader column={column} title="Name"/>),
        cell: ({ row }) =>  ( <p className="line-clamp-1 text-left font-semibold">{row.getValue("name")}</p>),
    },

    {
        accessorKey: "project.name",
        header: ({ column }) => (<DataTableColumnHeader column={column} title="Project Name"/>),
        cell: ({ row }) => {
          const project = row.original.project;
          return (
            <div className="flex items-center gap-x-2 text-sm font-medium">
              <ProjectAvatar
                className="size-7 rounded-full"
                name={project.name}
                image={project.imageUrl}
              />
              <p className="line-clamp-1 text-left font-normal">{project.name}</p>
            </div>
          );
        },
    },
    
      {
        accessorKey: "assignee.name",
        header:({column})=>(<DataTableColumnHeader column={column} title="Assignee"/>),
        cell: ({ row }) => {
          const assignee = row.original.assignee;
          return (
            <div className="flex items-center gap-x-2.5 text-sm font-medium">
              <MemberAvatar
                className="size-7 "
                fallbackClassName="text-xs"
                name={assignee.name}
              />
              <div className="flex flex-col">
                <p className="line-clamp-1 text-sm font-normal">{assignee.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground font-normal">
                  {assignee.email}
                </p>
              </div>
            </div>
          );
        },
      },
    
      {
        accessorKey: "dueDate",
        header:({column})=>(<DataTableColumnHeader column={column} title="Due Date"/>),
        cell: ({ row }) =>  <TaskTableDateString value={row.getValue("dueDate")} />
        
      },
    
      {
        accessorKey: "status",
        header:({column})=>(<DataTableColumnHeader column={column} title="Status"/>),
        cell: ({ row }) =>  <DataTableStatusBadge status={row.getValue('status')}/>
    
      },


      {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
      },


]

