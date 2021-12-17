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
import { NotFoundException } from '@nestjs/common';
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

  describe('Remove a Game', () => {
    let mockCreateGameDto;
    let game;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = {
        title: faker.name.title(),
        price: parseInt(faker.finance.amount(1), 10),
        tags: faker.random.words(10).split(' '),
        releaseDate: addDays(new Date(), Math.floor(Math.random() * 365)),
        publisherId: publisher.id,
      };
      game = await gameService.create(mockCreateGameDto);
    });

    it('should remove an existing game', async () => {
      const response = await gameService.remove(game.id);
      expect(response).toEqual({
        id: game.id,
      });
    });

    it('should throw an error if game does not exist', async () => {
      const id = faker.datatype.uuid();
      expect(gameService.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
