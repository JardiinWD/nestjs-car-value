import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';


describe('Authentication System (e2e)', () => {
    // Define the app variable for each test
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Handles a signup request', () => {
        const email = 'jQyZd@example.com';

        return request(app.getHttpServer())
            .post('/auth/signup') // Send a request to the '/auth/signup' endpoint
            .send({
                email: email, // Send a request with the email 'jQyZd@example.com'
                password: '123456' // Send a request with the password '123456'
            })
            .expect(201) // Expect a status code of 201
            .then((res) => {
                // Get the id and email from the response
                const { id, email } = res.body;
                // Assert that the id and email are defined
                expect(id).toBeDefined();
                // Assert that the email is 'jQyZd@example.com'
                expect(email).toEqual(email);
            })
    });
});
