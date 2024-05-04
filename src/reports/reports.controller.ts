import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './DTO/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './DTO/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportDto } from './DTO/approve-report.dto';
import { AdminGuard } from '../users/guards/admin.guard';
import { GetEstimateDto } from './DTO/get-estimate.dto';

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


    @Patch('/:id') // Approve a report with the given ID
    @UseGuards(AdminGuard) // Use the AdminGuard to ensure that only admin users can approve reports
    /** Approves a report with the given ID.
     * @param {string} id - The ID of the report to be approved.
     * @param {ApproveReportDto} body - The data for approving the report.
     * @return {any} 
     */
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }


    @Get() // Get all reports
    @UseGuards(AuthGuard) // Use the AuthGuard to ensure that only authenticated users can get reports
    /** Retrieves all reports from the database.
     * @return {any} The retrieved reports.
     */
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query);
    }
}


