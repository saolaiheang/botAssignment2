import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class Teacher {
    @PrimaryColumn()
    teacher_id: number

    @Column({length:50})
    first_name: string
    @Column({length:50})
    last_name: string
    @Column({length:100,unique:true})
    email: string
    @Column({length:20,nullable:true})
    phone: string

}