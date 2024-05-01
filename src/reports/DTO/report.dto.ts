import { Expose, Transform } from "class-transformer";
import { User } from "src/users/user.entity";


export class ReportDto {
    @Expose()
    id: number; // The ID of the report

    @Expose()
    price: number; // The price of the car

    @Expose()
    make: string; // The make of the car

    @Expose()
    model: string; // The model of the car

    @Expose()
    year: number; // The year the car was made

    @Expose()
    lng: number; // The longitude of the location

    @Expose()
    lat: number; // The latitude of the location

    @Expose()
    mileage: number; // The mileage of the car

    @Expose()
    approved: boolean; // Whether the report has been approved by the admin

    @Transform(({ obj }) => obj.user.id) // Transform the user ID into the user object
    @Expose()
    userId: number; // The ID of the user who created the report

}