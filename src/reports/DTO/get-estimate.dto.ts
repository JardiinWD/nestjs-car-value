// Import Decorators from class-validator
import {
    IsString, IsNumber, IsLongitude, IsLatitude, Min, Max
} from "class-validator";
import { Transform } from "class-transformer";



export class GetEstimateDto {
    // Define the make, model, year, lng, lat, and mileage properties
    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform(({ value }) => parseInt(value)) // This is needed to convert the value to an integer
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;

    @IsLongitude()
    @Transform(({ value }) => parseFloat(value)) // This is needed to convert the value to a float
    lng: number;

    @IsLatitude()
    @Transform(({ value }) => parseFloat(value)) // This is needed to convert the value to a float
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(1_000_000)
    @Transform(({ value }) => parseInt(value))
    mileage: number;
}