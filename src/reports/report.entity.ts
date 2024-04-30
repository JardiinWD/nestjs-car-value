// Import decorators from TypeORM library
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

// Define Report entity
@Entity()
export class Report {
    // Define the id, price, make, model, year, lng, lat, and mileage properties
    @PrimaryGeneratedColumn()
    id: number;

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
}