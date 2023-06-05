import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from "typeorm"
import { Group } from "./Group"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn({name: "user_id", primaryKeyConstraintName: "users_user_pk"})
    id!: number

    @Column({name: "first_name"})
    @Index("users_first_name_idx")
    firstName!: string

    @Column({name: "last_name"})
    lastName!: string

    @Column({name: "age"})
    age!: number
}
