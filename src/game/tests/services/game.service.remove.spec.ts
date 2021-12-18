import { NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { getRepository } from 'typeorm';

import { Publisher } from '../../entities';
import { GameService } from '../../game.service';
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
