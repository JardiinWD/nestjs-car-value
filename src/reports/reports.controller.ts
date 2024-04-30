import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './DTO/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../users/guards/auth.guard';

@Controller('reports')
export class ReportsController {
    // Inject the ReportsService into the constructor
    constructor(private reportsService: ReportsService) { }


    @Post()
    @UseGuards(AuthGuard)
    /** Create a new report with the given data using the ReportsService.
     * @param {CreateReportDto} body - The data for creating the report.
     * @return {any} The created report.
     */
    createReport(@Body() body: CreateReportDto) {
        // Create a new report with the given data with the ReportsService
        return this.reportsService.create(body);
    }
}
