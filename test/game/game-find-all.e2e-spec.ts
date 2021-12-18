import { INestApplication } from '@nestjs/common';
import { GameService } from '../../src/game/game.service';
import { Publisher } from '../../src/game/entities';
import truncate from '../../src/game/helpers/truncate';
import { generateGames } from '../../src/game/tests/helpers/generate-data';
import * as request from 'supertest';
import { createTestingModule } from '../helpers/init-app';
import { getRepository } from 'typeorm';
import { TestingModule } from '@nestjs/testing';

describe('GamesController - Find All (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let gameService: GameService;

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
    await Promise.all(
      generateGames(publisher, Math.floor(Math.random() * 5) + 1).map((game) =>
        gameService.create({
          ...game,
          tags: game.tags as unknown as string,
        }),
      ),
    );
  });

  it('/games (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/games')
      .expect(200);

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
        }),
      ]),
    );
  });
});
