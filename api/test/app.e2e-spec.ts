import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';

describe('API endpoints (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
        characters: expect.arrayContaining([
          expect.objectContaining({ name: 'Alpha Hero' }),
        ]) as unknown,
        seasons: expect.arrayContaining([
          expect.objectContaining({ seasonNumber: 1 }),
        ]) as unknown,
      }),
    );
  });

  it('GET /series/:id/characters filters and limits characters', async () => {
    const response = await request(app.getHttpServer())
      .get('/series/1/characters')
      .query({ sortBy: 'name', limit: 1 })
      .expect(200);

    const characters = response.body as unknown[];
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

  it('GET /characters/:id returns character relations', async () => {
    const response = await request(app.getHttpServer())
      .get('/characters/1')
      .expect(200);

    expect(response.body as unknown).toEqual(
      expect.objectContaining({
        id: 1,
        series: expect.objectContaining({ id: 1 }) as unknown,
        seasons: expect.arrayContaining([
          expect.objectContaining({ id: 1 }),
        ]) as unknown,
      }),
    );
  });

  it('supports the complete Vote workflow', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/votes')
      .send({ characterId: 2, userId: 2, isEvil: false, points: 1 })
      .expect(201);

    expect(createResponse.body as unknown).toEqual(
      expect.objectContaining({
        characterId: 2,
        userId: 2,
        isEvil: false,
        points: 1,
      }),
    );
    const voteId = (createResponse.body as { id: number }).id;

    const votesResponse = await request(app.getHttpServer())
      .get('/votes')
      .query({ characterId: 2, userId: 2 })
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

    await request(app.getHttpServer()).delete(`/votes/${voteId}`).expect(200);
    await request(app.getHttpServer()).get(`/votes/${voteId}`).expect(404);
  });

  it('returns validation errors for invalid endpoint input', async () => {
    await request(app.getHttpServer())
      .get('/characters/not-a-number')
      .expect(400);

    await request(app.getHttpServer())
      .post('/votes')
      .send({ characterId: 2, userId: 2, isEvil: false, points: 4 })
      .expect(400);

    await request(app.getHttpServer())
      .post('/votes')
      .send({ characterId: 2, userId: 2, isEvil: false, points: 0 })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
