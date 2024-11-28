import { Badge } from "@/app/_components/ui/badge"
import { snakeCaseToTitleCase } from "@/app/_features/tasks/utils"
import { TaskStatus } from "@/src/entities/task.enums"


interface DataTableStatusBadgeProps  {
    status:TaskStatus
}

export const DataTableStatusBadge = ({status}:DataTableStatusBadgeProps)=>{
    return <Badge>{snakeCaseToTitleCase(status)}</Badge>
}