import { Entity, Column, PrimaryColumn ,ManyToOne} from "typeorm"
import { Teacher } from "./teacher.entity"

@Entity()
export class Class {
    @PrimaryColumn()
    class_id: number

    @Column({length:100})
    class_name: string
    @Column({length:100})
    subject:string
    @ManyToOne(()=>Teacher,(teacher)=>teacher.teacher_id)
    teacher_id:Teacher;

}