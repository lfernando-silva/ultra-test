import { TestingModule } from '@nestjs/testing';
import { GameService } from '../../game.service';
import { Publisher } from '../../entities';
import { getRepository } from 'typeorm';
import truncate from '../../helpers/truncate';
import createTestingModule from '../helpers/create-testing-module';
import { generateGames } from '../helpers/generate-data';

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
      const response = await gameService.findAll();

      expect(response).toHaveLength(games.length);
      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: expect.any(String) }),
        ]),
      );
    });
  });
});
