import { TestingModule } from '@nestjs/testing';
import { getRepository } from 'typeorm';

import { Publisher } from '../../entities';
import { GameController } from '../../game.controller';
import { GameService } from '../../game.service';
import truncate from '../../helpers/truncate';
import createTestingModule from '../helpers/create-testing-module';
import { generateGames } from '../helpers/generate-data';

describe('GameController', () => {
  let moduleRef: TestingModule;
  let gameController: GameController;
  let gameService: GameService;

  beforeAll(async () => {
    moduleRef = await createTestingModule();

    gameController = moduleRef.get<GameController>(GameController);
    gameService = moduleRef.get<GameService>(GameService);
  });

  afterAll(() => {
    moduleRef.close();
  });

  describe('Find all game (no pagination)', () => {
    let games;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      games = await Promise.all(
        generateGames(publisher, Math.floor(Math.random() * 5) + 1).map(
          (game) =>
            gameService.create({
              ...game,
              tags: game.tags as unknown as string,
            }),
        ),
      );
    });

    it('should find all existing games', async () => {
      const response = await gameController.findAll();

      expect(response).toHaveLength(games.length);
      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: expect.any(String) }),
        ]),
      );
    });
  });
});
