import { Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Student {
    @PrimaryColumn()
    student_id: number
    @Column({length:50})
    first_name: string
    @Column({length:50})
    last_name: string
    @Column({length:100,unique:true})
    email: string
    @Column({length:20,nullable:true})
    phone: string
    @Column({type:Date,nullable:true})
    birth_date:Date
    @Column({length:10})
    gender:string
    @Column({type:'text',nullable:true})
    address: string

}