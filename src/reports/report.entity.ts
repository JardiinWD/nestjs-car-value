// Import decorators from TypeORM library
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

// Define Report entity
@Entity()
export class Report {
    // Define the id, price, make, model, year, lng, lat, and mileage properties
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    approved: boolean

    @Column()
    price: number;

    @Column()
    make: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    lng: number;

    @Column()
    lat: number;

    @Column()
    mileage: number;

    // Define the relationship between the Report and User entities
    @ManyToOne(() => User, (user) => user.reports)
    user: User;
}