import { TestingModule } from '@nestjs/testing';
import { subMonths } from 'date-fns';
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

  describe('Process Discounts', () => {
    let mockCreateGameDto;

    beforeEach(async () => {
      await truncate();
      const publisher = await getRepository(Publisher).findOne();
      const referenceDate = new Date();
      mockCreateGameDto = generateGame(publisher);
      /**
       * 1st game date: older than 18 months, should be deleted
       * 2nd game date: exactly 18 months old, update price
       * 3nd game date: between 18 12 months, update price
       * 4th game date: exactly 12 months old, update price
       * 5th game date: newer than 12 months, remains the same
       */
      await Promise.all([
        gameService.create({
          ...mockCreateGameDto,
          title: 'Game 19',
          releaseDate: subMonths(referenceDate, 19),
          price: 10,
        }),
        gameService.create({
          ...mockCreateGameDto,
          title: 'Game 18',
          releaseDate: subMonths(referenceDate, 18),
          price: 10,
        }),
        gameService.create({
          ...mockCreateGameDto,
          title: 'Game 15',
          releaseDate: subMonths(referenceDate, 15),
          price: 10,
        }),
        gameService.create({
          ...mockCreateGameDto,
          title: 'Game 12',
          releaseDate: subMonths(referenceDate, 12),
          price: 10,
        }),
        gameService.create({
          ...mockCreateGameDto,
          title: 'Game 9',
          releaseDate: subMonths(referenceDate, 9),
          price: 10,
        }),
      ]);
    });

    it('should process correctly all the games', async () => {
      await gameController.processDiscounts();

      const updatedGames = await gameService.findAll();

      expect(updatedGames).toHaveLength(4);
      expect(updatedGames.filter((u) => u.price === 8)).toHaveLength(3);
      expect(
        updatedGames.filter((u) => u.price === 10 && u.title === 'Game 9'),
      ).toHaveLength(1);
    });
  });
});
