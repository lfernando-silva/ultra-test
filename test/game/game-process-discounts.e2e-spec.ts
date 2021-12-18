import { INestApplication } from '@nestjs/common';
import { GameService } from '../../src/game/game.service';
import { Publisher } from '../../src/game/entities/publisher.entity';
import truncate from '../../src/game/helpers/truncate';
import { generateGame } from '../../src/game/tests/helpers/generate-data';
import * as request from 'supertest';
import { createTestingModule } from '../helpers/init-app';
import { getRepository } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { subMonths } from 'date-fns';

describe('GamesController - Process Discounts (e2e)', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;
  let gameService: GameService;
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
    const referenceDate = new Date();
    mockCreateGameDto = generateGame(publisher);
    /**
     * 1st game date: older than 18 months, should be deleted
     * 2nd game date: exactly 18 months old, update price
     * 3nd game date: between 18 12 months, update price
     * 4th game date: exactly 12 months old, update price
     * 5th game date: newer than 12 months, remains the same
     */
    await Promise.all([
      gameService.create({
        ...mockCreateGameDto,
        title: 'Game 19',
        releaseDate: subMonths(referenceDate, 19),
        price: 10,
      }),
      gameService.create({
        ...mockCreateGameDto,
        title: 'Game 18',
        releaseDate: subMonths(referenceDate, 18),
        price: 10,
      }),
      gameService.create({
        ...mockCreateGameDto,
        title: 'Game 15',
        releaseDate: subMonths(referenceDate, 15),
        price: 10,
      }),
      gameService.create({
        ...mockCreateGameDto,
        title: 'Game 12',
        releaseDate: subMonths(referenceDate, 12),
        price: 10,
      }),
      gameService.create({
        ...mockCreateGameDto,
        title: 'Game 9',
        releaseDate: subMonths(referenceDate, 9),
        price: 10,
      }),
    ]);
  });

  it('/games/process-discounts (POST)', async () => {
    const { body: discountsBody } = await request(app.getHttpServer())
      .post(`/games/process-discounts`)
      .expect(201);

    const { body: remainingGamesBody } = await request(app.getHttpServer())
      .get('/games')
      .expect(200);

    expect(discountsBody).toEqual({ processed: true });
    expect(remainingGamesBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
        }),
      ]),
    );
    expect(remainingGamesBody).toHaveLength(4);
    expect(remainingGamesBody.filter((u) => u.price === 8)).toHaveLength(3);
    expect(
      remainingGamesBody.filter((u) => u.price === 10 && u.title === 'Game 9'),
    ).toHaveLength(1);
  });
});
