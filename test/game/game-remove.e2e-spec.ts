import * as faker from 'faker';
import { INestApplication } from '@nestjs/common';
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

  beforeAll(async () => {
    moduleRef = await createTestingModule();
    app = moduleRef.createNestApplication();
    gameService = moduleRef.get<GameService>(GameService);
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
  });

  it('/games/:id (DELETE)', async () => {
    const { body } = await request(app.getHttpServer())
      .delete(`/games/${game.id}`)
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        id: game.id,
      }),
    );
  });

  it('/games/:id (DELETE) - 404', async () => {
    const uuid = faker.datatype.uuid();
    const { body } = await request(app.getHttpServer())
      .delete(`/games/${uuid}`)
      .expect(404);

    expect(body).toEqual({
      error: 'Not Found',
      message: expect.any(String),
      statusCode: 404,
    });
  });
});
