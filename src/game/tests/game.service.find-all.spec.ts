import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { GameService } from '../game.service';
import { GameRepository } from '../repositories/game.repository';
import { PublisherRepository } from '../repositories/publisher.repository';
import config from '../../config';
import { Publisher } from '../entities/publisher.entity';
import { addDays } from 'date-fns';
import * as faker from 'faker';
import { getRepository } from 'typeorm';
import truncate from '../helpers/truncate';

const envFilePath = path.join(
  process.cwd(),
  `.env.${process.env.NODE_ENV || 'development'}`,
);

describe('GameService', () => {
  let moduleRef: TestingModule;
  let gameService: GameService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [config],
          envFilePath,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT, 10),
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DBNAME,
          entities: [Game, Publisher],
        }),
        TypeOrmModule.forFeature([Game, GameRepository, PublisherRepository]),
      ],
      providers: [GameService, GameRepository, PublisherRepository],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
  });

  afterAll(() => {
    moduleRef.close();
  });

  describe('Find all game (no pagination)', () => {
    let mockCreateGameDto;
    let games;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      const gamePromises = Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        () => {
          mockCreateGameDto = {
            title: faker.name.title(),
            price: parseInt(faker.finance.amount(1), 10),
            tags: faker.random.words(10).split(' '),
            releaseDate: addDays(new Date(), Math.floor(Math.random() * 365)),
            publisherId: publisher.id,
          };

          return gameService.create(mockCreateGameDto);
        },
      );

      games = await Promise.all(gamePromises);
    });

    it('should find all existing games', async () => {
      const response = await gameService.findAll();
      const someRandomGameId =
        games[Math.floor(Math.random() * (games.length - 1))].id;

      expect(response).toHaveLength(games.length);
      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: someRandomGameId }),
        ]),
      );
    });
  });
});
