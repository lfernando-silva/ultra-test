import { TestingModule } from '@nestjs/testing';
import { GameService } from '../../game.service';
import { Publisher } from '../../entities';
import { NotFoundException } from '@nestjs/common';
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

  describe('Find a Game Publisher', () => {
    let mockCreateGameDto;
    let game;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      mockCreateGameDto = generateGame(publisher);
      game = await gameService.create(mockCreateGameDto);
    });

    it('should find an existing game', async () => {
      const response = await gameService.findGamePublisher(game.id);
      expect(response).toEqual(game.publisher);
    });

    it('should throw an error if game does not exist', async () => {
      const id = faker.datatype.uuid();
      expect(gameService.findGamePublisher(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
