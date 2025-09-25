import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../config/prisma/prisma.service';

describe('Auth Integration (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prismaService.user.deleteMany();
  });

  describe('/auth/signup (POST)', () => {
    it('should create a new user', () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signUpDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data.user.email).toBe(signUpDto.email);
        });
    });

    it('should return 409 if user already exists', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Create user first
      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signUpDto)
        .expect(201);

      // Try to create same user again
      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signUpDto)
        .expect(409);
    });

    it('should return 400 for invalid data', () => {
      const invalidSignUpDto = {
        email: 'invalid-email',
        password: '123', // Too short
        firstName: 'J',
        lastName: 'D',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(invalidSignUpDto)
        .expect(400);
    });
  });

  describe('/auth/signin (POST)', () => {
    beforeEach(async () => {
      // Create a test user
      const signUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signUpDto);
    });

    it('should sign in user successfully', () => {
      const signInDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/signin')
        .send(signInDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data.user.email).toBe(signInDto.email);
        });
    });

    it('should return 401 for invalid credentials', () => {
      const signInDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/signin')
        .send(signInDto)
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Create a test user and get refresh token
      const signUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(signUpDto);

      // Extract refresh token from cookie
      const cookies = response.headers['set-cookie'] as unknown as string[];
      const refreshTokenCookie = cookies.find((cookie: string) =>
        cookie.startsWith('refreshToken='),
      );
      refreshToken = refreshTokenCookie?.split('=')[1]?.split(';')[0];
    });

    it('should refresh access token successfully', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
        });
    });

    it('should return 401 for invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });
});
