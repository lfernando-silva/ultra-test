import { TestingModule } from '@nestjs/testing';
import { GameService } from '../../game.service';
import { Publisher } from '../../entities/publisher.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as faker from 'faker';
import { getRepository } from 'typeorm';
import truncate from '../../helpers/truncate';
import createTestingModule from '../helpers/create-testing-module';
import { generateGame } from '../helpers/generate-data';

describe('GameService', () => {
  let moduleRef: TestingModule;
  let gameService: GameService;

  beforeAll(async () => {
    moduleRef = await createTestingModule();

    gameService = moduleRef.get<GameService>(GameService);
  });

  afterAll(() => {
    moduleRef.close();
  });

  describe('Create Game', () => {
    let mockCreateGameDto;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = generateGame(publisher);
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