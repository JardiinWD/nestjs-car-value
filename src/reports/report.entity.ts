// Import decorators from TypeORM library
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// Define Report entity
@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;
}