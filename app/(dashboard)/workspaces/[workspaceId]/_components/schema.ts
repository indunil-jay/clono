import {z} from 'zod'
import { TaskStatus } from '@/src/entities/task.enums';


export  const  tableSchema = z.object({
    id:z.string(),
    name:z.string(),
    project: z.object({
        id:z.string(),
        name:z.string(),
       imageUrl:z.string().optional().nullable()
    }),
    assignee: z.object({
        id:z.string(),
        name:z.string(),
        email:z.string(),
    //    imageUrl:z.string().optional()
    }),
    // dueDate:z.coerce.date(),
    dueDate:z.string(),

    status:z.nativeEnum(TaskStatus)
})


export type Task  = z.infer<typeof tableSchema>


