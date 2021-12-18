import { TestingModule } from '@nestjs/testing';
import { GameService } from '../../game.service';
import { Publisher } from '../../entities/publisher.entity';
import * as faker from 'faker';
import { getRepository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import truncate from '../../helpers/truncate';
import createTestingModule from '../helpers/create-testing-module';
import { GameController } from '../../game.controller';
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

  describe('Remove a Game', () => {
    let mockCreateGameDto;
    let game;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = generateGame(publisher);
      game = await gameService.create(mockCreateGameDto);
    });

    it('should remove an existing game', async () => {
      const response = await gameController.remove(game.id);
      expect(response).toEqual({
        id: game.id,
      });
    });

    it('should throw an error if game does not exist', async () => {
      const id = faker.datatype.uuid();
      expect(gameController.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
