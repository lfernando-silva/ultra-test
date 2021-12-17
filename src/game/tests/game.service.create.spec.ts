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
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { addDays } from 'date-fns';
import * as faker from 'faker';
import { getRepository } from 'typeorm';

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

  describe('Create Game', () => {
    let mockCreateGameDto;

    beforeEach(async () => {
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = {
        title: faker.name.title(),
        price: parseInt(faker.finance.amount(1), 10),
        tags: faker.random.words(10).split(' ') as string[],
        releaseDate: addDays(new Date(), Math.floor(Math.random() * 365)),
        publisherId: publisher.id,
      };
    });

    it('should create a new game', async () => {
      const response = await gameService.create(mockCreateGameDto);
      expect(response).toEqual({
        id: expect.any(String),
        title: mockCreateGameDto.title,
        price: mockCreateGameDto.price,
        tags: mockCreateGameDto.tags,
        releaseDate: expect.any(Date),
        publisher: expect.objectContaining({
          id: mockCreateGameDto.publisherId,
        }),
      });
    });

    it('should throw an error if publisher does not exist', async () => {
      mockCreateGameDto.publisherId = faker.datatype.uuid();
      expect(gameService.create(mockCreateGameDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if sent data is not valid', async () => {
      mockCreateGameDto.title = faker.random.words(200);
      expect(gameService.create(mockCreateGameDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
