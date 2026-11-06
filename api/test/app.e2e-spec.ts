import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';
import { AppModule } from './../src/app.module';
import { AiService } from './../src/ai/ai.service';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';

describe('API endpoints (e2e)', () => {
  let app: INestApplication<App>;

  const getCookie = (headers: unknown): string => {
    if (
      typeof headers !== 'object' ||
      headers === null ||
      !('set-cookie' in headers)
    ) {
      throw new Error('Login did not return an access-token cookie');
    }

    const setCookie = headers['set-cookie'];
    if (!Array.isArray(setCookie) || typeof setCookie[0] !== 'string') {
      throw new Error('Login did not return an access-token cookie');
    }

    return setCookie[0];
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AiService)
      .useValue({ getRanking: () => Promise.resolve('E2E test rating info') })
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  it('GET / returns the application health message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /series returns seeded series', async () => {
    const response = await request(app.getHttpServer())
      .get('/series')
      .expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({ id: 1, title: 'The Test Series' }),
    ]);
  });

  it('GET /series/:id returns series relations', async () => {
    const response = await request(app.getHttpServer())
      .get('/series/1')
      .expect(200);

    expect(response.body as unknown).toEqual(
      expect.objectContaining({
        id: 1,
        seasons: expect.arrayContaining([
          expect.objectContaining({
            seasonNumber: 1,
            characters: expect.arrayContaining([
              expect.objectContaining({ name: 'Alpha Hero' }),
            ]) as unknown,
          }),
        ]) as unknown,
      }),
    );
  });

  it('GET /series/:id/characters filters and limits characters', async () => {
    const response = await request(app.getHttpServer())
      .get('/series/1/characters')
      .query({ sortBy: 'NAME', limit: 1 })
      .expect(200);

    const responseBody: unknown = response.body;
    if (!Array.isArray(responseBody)) {
      throw new Error('Expected the endpoint to return a character array');
    }

    const characters: unknown[] = responseBody;
    expect(characters).toHaveLength(1);
    expect(characters[0]).toEqual(
      expect.objectContaining({ name: 'Alpha Hero' }),
    );
  });

  it('GET /characters returns filtered characters', async () => {
    const response = await request(app.getHttpServer())
      .get('/characters')
      .query({ name: 'villain', seriesId: 1, limit: 10 })
      .expect(200);

    expect(response.body as unknown).toEqual([
      expect.objectContaining({ id: 2, name: 'Beta Villain' }),
    ]);
  });

  it('GET /characters/:id returns character detail', async () => {
    const response = await request(app.getHttpServer())
      .get('/characters/1')
      .expect(200);

    expect(response.body as unknown).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Alpha Hero',
        rank: 1,
        vote: null,
      }),
    );
  });

  it('supports the complete Vote workflow', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'e2e-test-password' })
      .expect(201);
    const cookie = getCookie(loginResponse.headers);

    const createResponse = await request(app.getHttpServer())
      .post('/votes')
      .set('Cookie', cookie)
      .send({ characterId: 2, isEvil: false, points: 1 })
      .expect(201);

    expect(createResponse.body as unknown).toEqual(
      expect.objectContaining({
        characterId: 2,
        userId: 1,
        isEvil: false,
        points: 1,
      }),
    );
    const voteId = (createResponse.body as { id: number }).id;

    const votesResponse = await request(app.getHttpServer())
      .get('/votes')
      .query({ characterId: 2, userId: 1 })
      .expect(200);
    expect(votesResponse.body as unknown).toEqual([
      expect.objectContaining({ id: voteId }),
    ]);

    const voteResponse = await request(app.getHttpServer())
      .get('/votes/1')
      .expect(200);
    expect(voteResponse.body as unknown).toEqual(
      expect.objectContaining({ id: 1, characterId: 1, userId: 1 }),
    );

    const updateResponse = await request(app.getHttpServer())
      .patch(`/votes/${voteId}`)
      .set('Cookie', cookie)
      .send({ isEvil: true, points: 3 })
      .expect(200);
    expect(updateResponse.body as unknown).toEqual(
      expect.objectContaining({ id: voteId, isEvil: true, points: 3 }),
    );

    const characterResponse = await request(app.getHttpServer())
      .get('/characters/2')
      .expect(200);
    expect(characterResponse.body as unknown).toEqual(
      expect.objectContaining({ totalVotes: 1, evilVotes: 1, points: 3 }),
    );

    await request(app.getHttpServer())
      .delete(`/votes/${voteId}`)
      .set('Cookie', cookie)
      .expect(200);
    await request(app.getHttpServer()).get(`/votes/${voteId}`).expect(404);
  });

  it('returns validation errors for invalid endpoint input', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'e2e-test-password' })
      .expect(201);
    const cookie = getCookie(loginResponse.headers);

    await request(app.getHttpServer())
      .get('/characters/not-a-number')
      .expect(400);

    await request(app.getHttpServer())
      .post('/votes')
      .set('Cookie', cookie)
      .send({ characterId: 2, isEvil: false, points: 4 })
      .expect(400);

    await request(app.getHttpServer())
      .post('/votes')
      .set('Cookie', cookie)
      .send({ characterId: 2, isEvil: false, points: 0 })
      .expect(400);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
