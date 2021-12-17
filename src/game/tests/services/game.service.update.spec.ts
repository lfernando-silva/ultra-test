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

  describe('Update Game', () => {
    let mockCreateGameDto;
    let mockUpdateGameDto;
    let game;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = generateGame(publisher);
      game = await gameService.create(mockCreateGameDto);
      mockUpdateGameDto = generateGame(publisher);
    });

    it('should update an existing game', async () => {
      const response = await gameService.update(game.id, mockUpdateGameDto);
      expect(response).toEqual({
        id: game.id,
        title: mockUpdateGameDto.title,
        price: mockUpdateGameDto.price,
        tags: mockUpdateGameDto.tags,
        releaseDate: expect.any(Date),
        publisher: expect.objectContaining({
          id: mockUpdateGameDto.publisherId,
        }),
      });
    });

    it('should update only one field from an existing game', async () => {
      const title = 'Destiny 2 - Beyond The Light';
      const response = await gameService.update(game.id, {
        title,
      });
      expect(response).toEqual({
        id: game.id,
        title,
        price: game.price,
        tags: game.tags,
        releaseDate: expect.any(Date),
        publisher: expect.objectContaining({
          id: game.publisher.id,
        }),
      });
    });

    it('should throw an error if game does not exist', async () => {
      const id = faker.datatype.uuid();
      expect(gameService.update(id, mockUpdateGameDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if sent data is not valid', async () => {
      const title = faker.random.words(200);
      expect(gameService.update(game.id, { title })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});