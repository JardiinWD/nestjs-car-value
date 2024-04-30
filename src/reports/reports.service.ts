import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './DTO/create-report.dto';

@Injectable()
export class ReportsService {

    /** Inject the Repository<Report> from TypeOrm into this service.
     * @param userRepository The repository for the Report entity
     */
    constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) { }


    /** Create a new Report entity
     * @param {CreateReportDto} body - The data for creating the report.
     * @return {Promise<Report>} The created report.
    */
    create(reportDto: CreateReportDto) {
        // Create a new istance of Report 
        const report = this.reportRepository.create(reportDto);
        // Save the report in the database
        return this.reportRepository.save(report);
    }
}


