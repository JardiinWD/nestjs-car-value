import { Injectable } from '@nestjs/common';
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
}


