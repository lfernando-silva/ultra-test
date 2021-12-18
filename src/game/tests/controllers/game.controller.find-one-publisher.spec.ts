import { TestingModule } from '@nestjs/testing';
import { GameService } from '../../game.service';
import { Publisher } from '../../entities';
import { NotFoundException } from '@nestjs/common';
import * as faker from 'faker';
import { getRepository } from 'typeorm';
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

  describe('Find a Game Publisher', () => {
    let mockCreateGameDto;
    let game;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = generateGame(publisher);
      game = await gameService.create(mockCreateGameDto);
    });

    it('should find an existing game publisher', async () => {
      const response = await gameController.findGamePublisher(game.id);
      expect(response).toEqual(game.publisher);
    });

    it('should throw an error if game does not exist', async () => {
      const id = faker.datatype.uuid();
      expect(gameController.findGamePublisher(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
