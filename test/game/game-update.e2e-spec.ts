import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import * as request from 'supertest';
import { getRepository } from 'typeorm';

import { Publisher } from '../../src/game/entities';
import truncate from '../../src/game/helpers/truncate';
import { generateGame } from '../../src/game/tests/helpers/generate-data';
import { createTestingModule } from '../helpers/init-app';

describe('GamesController - Update (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let mockCreateGameDto;

  beforeAll(async () => {
    moduleRef = await createTestingModule();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await truncate();
    const publisher = await getRepository(Publisher).findOne();
    mockCreateGameDto = generateGame(publisher);
  });

  it('/games (POST)', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/games`)
      .send(mockCreateGameDto)
      .expect(201);

    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('/games (POST) - 400', async () => {
    const title = faker.random.words(200);
    const { body } = await request(app.getHttpServer())
      .post(`/games`)
      .send({ title })
      .expect(400);

    expect(body).toEqual({
      error: 'Bad Request',
      message: expect.any(Array),
      statusCode: 400,
    });
  });
});
