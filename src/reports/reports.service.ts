import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './DTO/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './DTO/get-estimate.dto';

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

    /** Asynchronously creates an estimate based on the provided GetEstimateDto.
     * @param {GetEstimateDto} estimateDto - The data for creating the estimate.
     * @return {Promise<any>} A promise that resolves with the created estimate.
     */
    async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
        return this.reportRepository.createQueryBuilder()
            .select('AVG(price)', 'price') // Select all columns
            .where('make = :make', { make }) // Filter by make property
            .andWhere('model = :model', { model }) // Filter by model property
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng }) // Filter by longitude
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat }) // Order by latitude
            .andWhere('year - :year BETWEEN -3 AND 3', { year }) // Filter by year
            .andWhere('approved IS TRUE') // Filter by approved property
            .orderBy('ABS(mileage - :mileage)', 'DESC') // Order by mileage
            .setParameters({ mileage })
            .limit(3)
            .getRawOne() // Get the raw results as an array of objects
    }
}


