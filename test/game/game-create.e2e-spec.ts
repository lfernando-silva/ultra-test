import * as faker from 'faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GameService } from '../../src/game/game.service';
import { Publisher } from '../../src/game/entities/publisher.entity';
import truncate from '../../src/game/helpers/truncate';
import { generateGame } from '../../src/game/tests/helpers/generate-data';
import * as request from 'supertest';
import { createTestingModule } from '../helpers/init-app';
import { getRepository } from 'typeorm';
import { TestingModule } from '@nestjs/testing';

describe('GamesController - Find All (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let gameService: GameService;
  let game;
  let mockCreateGameDto;
  let mockUpdateGameDto;

  beforeAll(async () => {
    moduleRef = await createTestingModule();
    app = moduleRef.createNestApplication();
    gameService = moduleRef.get<GameService>(GameService);
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
    game = await gameService.create(mockCreateGameDto);
    mockUpdateGameDto = generateGame(publisher);
  });

  it('/games/:id (PATCH)', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/games/${game.id}`)
      .send(mockUpdateGameDto)
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        id: game.id,
      }),
    );
  });

  it('/games/:id (PATCH)', async () => {
    const title = 'Megaman X-8';
    const { body } = await request(app.getHttpServer())
      .patch(`/games/${game.id}`)
      .send({ title })
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        id: game.id,
        title,
      }),
    );
  });

  it('/games/:id (PATCH) - 404', async () => {
    const uuid = faker.datatype.uuid();
    const { body } = await request(app.getHttpServer())
      .patch(`/games/${uuid}`)
      .send(mockUpdateGameDto)
      .expect(404);

    expect(body).toEqual({
      error: 'Not Found',
      message: expect.any(String),
      statusCode: 404,
    });
  });

  it('/games/:id (PATCH) - 400', async () => {
    const title = faker.random.words(200);
    const { body } = await request(app.getHttpServer())
      .patch(`/games/${game.id}`)
      .send({ title })
      .expect(400);

    expect(body).toEqual({
      error: 'Bad Request',
      message: expect.any(Array),
      statusCode: 400,
    });
  });
});
