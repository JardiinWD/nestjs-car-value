import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './DTO/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './DTO/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
    // Inject the ReportsService into the constructor
    constructor(private reportsService: ReportsService) { }


    @Post() // Create a new report
    @UseGuards(AuthGuard) // Use the AuthGuard to ensure that only authenticated users can create reports
    @Serialize(ReportDto) // Serialize the ReportDto class
    /** Create a new report with the given data using the ReportsService.
     * @param {CreateReportDto} body - The data for creating the report.
     * @param {User} user - The current user.
     * @return {any} The created report.
     */
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        // Create a new report with the given data with the ReportsService
        return this.reportsService.create(body, user);
    }
}
