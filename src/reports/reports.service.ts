import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './DTO/create-report.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {

    /** Inject the Repository<Report> from TypeOrm into this service.
     * @param userRepository The repository for the Report entity
     */
    constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) { }


    /** Create a new Report entity
     * @param {CreateReportDto} body - The data for creating the report.
     * @param {User} user - The current user.
     * @return {Promise<Report>} The created report.
    */
    create(reportDto: CreateReportDto, user: User) {
        // Create a new istance of Report 
        const report = this.reportRepository.create(reportDto);
        // Update the report with the current user
        report.user = user;
        // Save the report in the database
        return this.reportRepository.save(report);
    }

    /** Retrieves a report with the specified ID and updates its approval status.
     * @param {string} id - The ID of the report to be updated.
     * @param {boolean} approved - The new approval status of the report.
     * @return {Promise<void>} - A promise that resolves when the report is successfully updated.
     */
    async changeApproval(id: string, approved: boolean) {
        // Update the report with the new approval status
        const report = await this.reportRepository.findOne({ where: { id: parseInt(id) } });
        // Check if the report exists
        if (!report) throw new NotFoundException('Report not found');
        // Update the report
        report.approved = approved;
        // Save the report in the database
        await this.reportRepository.save(report);
    }
}


