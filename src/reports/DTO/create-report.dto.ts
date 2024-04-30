// Import Decorators from class-validator
import {
    IsString, IsNumber, Min, Max, IsLongitude, IsLatitude
} from "class-validator";


export class CreateReportDto {
    // Define the price, make, model, year, lng, lat, and mileage properties
    @IsNumber()
    @Min(0)
    @Max(1_000_000)
    price: number;

    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(1_000_000)
    mileage: number;
}