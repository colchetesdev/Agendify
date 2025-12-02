import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { Service } from '../src/services/entities/service.entity';
import { ScheduledService } from '../src/scheduled-services/entities/scheduled-service.entity';
import { ServicesModule } from '../src/services/services.module';
import { ScheduledServicesModule } from '../src/scheduled-services/scheduled-services.module';

describe('API E2E', () => {
  let app: INestApplication;
  let createdServiceId: number;
  let createdScheduledId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Service, ScheduledService],
          synchronize: true,
          logging: false,
        }),
        ServicesModule,
        ScheduledServicesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Services', () => {
    it('creates a service', async () => {
      const res = await request(app.getHttpServer())
        .post('/services')
        .send({ name: 'Corte Teste', durationTimeMinutes: 45 })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Corte Teste');
      expect(res.body.durationTimeMinutes).toBe(45);
      createdServiceId = res.body.id;
    });

    it('lists services with pagination metadata', async () => {
      const res = await request(app.getHttpServer()).get('/services').expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.find((s: any) => s.id === createdServiceId)).toBeTruthy();
      expect(res.body).toMatchObject({
        total: expect.any(Number),
        page: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
      });
    });

    it('retrieves a single service', async () => {
      const res = await request(app.getHttpServer())
        .get(`/services/${createdServiceId}`)
        .expect(200);

      expect(res.body.id).toBe(createdServiceId);
      expect(res.body.name).toBe('Corte Teste');
    });

    it('updates a service', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/services/${createdServiceId}`)
        .send({ name: 'Corte Atualizado' })
        .expect(200);

      expect(res.body.name).toBe('Corte Atualizado');
    });
  });

  describe('Scheduled Services', () => {
    it('creates a scheduled service linked to a service', async () => {
      const res = await request(app.getHttpServer())
        .post('/scheduled-services')
        .send({
          serviceDate: '2025-01-01',
          scheduledHour: '10:00',
          clientName: 'Cliente Teste',
          clientPhone: '11988887777',
          serviceId: createdServiceId,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.service.id).toBe(createdServiceId);
      createdScheduledId = res.body.id;
    });

    it('lists scheduled services with relations and pagination', async () => {
      const res = await request(app.getHttpServer())
        .get('/scheduled-services')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0]).toHaveProperty('service');
      expect(res.body.data.find((s: any) => s.id === createdScheduledId)).toBeTruthy();
      expect(res.body).toMatchObject({
        total: expect.any(Number),
        page: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
      });
    });

    it('retrieves a scheduled service by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/scheduled-services/${createdScheduledId}`)
        .expect(200);

      expect(res.body.id).toBe(createdScheduledId);
      expect(res.body.service.id).toBe(createdServiceId);
    });

    it('updates a scheduled service', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/scheduled-services/${createdScheduledId}`)
        .send({ scheduledHour: '11:00' })
        .expect(200);

      expect(res.body.scheduledHour).toBe('11:00');
    });

    it('deletes a scheduled service', async () => {
      await request(app.getHttpServer())
        .delete(`/scheduled-services/${createdScheduledId}`)
        .expect(200);
    });
  });

  describe('Cleanup', () => {
    it('deletes the created service', async () => {
      await request(app.getHttpServer())
        .delete(`/services/${createdServiceId}`)
        .expect(200);
    });
  });
});
