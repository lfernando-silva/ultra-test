import { NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { getRepository } from 'typeorm';

import { Publisher } from '../../entities';
import { GameController } from '../../game.controller';
import { GameService } from '../../game.service';
import truncate from '../../helpers/truncate';
import createTestingModule from '../helpers/create-testing-module';
import { generateGame } from '../helpers/generate-data';

describe('GameController', () => {
  let moduleRef: TestingModule;
  let gameService: GameService;
  let gameController: GameController;

  beforeAll(async () => {
    moduleRef = await createTestingModule();

    gameController = moduleRef.get<GameController>(GameController);
    gameService = moduleRef.get<GameService>(GameService);
  });

  afterAll(() => {
    moduleRef.close();
  });

  describe('Find a Game', () => {
    let mockCreateGameDto;
    let game;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = generateGame(publisher);
      game = await gameService.create(mockCreateGameDto);
    });

    it('should find an existing game', async () => {
      const response = await gameController.findOne(game.id);
      expect(response).toEqual({
        id: game.id,
        title: game.title,
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
      expect(gameController.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });
});
