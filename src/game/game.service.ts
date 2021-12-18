import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { endOfDay, format, startOfDay, subMonths } from 'date-fns';
import { Between, Connection, LessThan } from 'typeorm';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

import { GameRepository } from './repositories/game.repository';
import { PublisherRepository } from './repositories/publisher.repository';

@Injectable()
export class GameService {
  private gameRepository: GameRepository;
  private publisherRepository: PublisherRepository;
  constructor(private readonly connection: Connection) {
    this.gameRepository = this.connection.getCustomRepository(GameRepository);
    this.publisherRepository =
      this.connection.getCustomRepository(PublisherRepository);
  }

  async create(data: CreateGameDto) {
    const publisher = await this.publisherRepository.findOne({
      id: data.publisherId,
    });

    if (!publisher) {
      throw new NotFoundException('Publisher was not found');
    }

    const game = this.gameRepository.create({
      title: data.title,
      price: data.price,
      tags: data.tags,
      releaseDate: data.releaseDate,
      publisher,
    });

    await this.gameRepository.save(game, { reload: true });
    return game;
  }

  findAll() {
    return this.gameRepository.find({ relations: ['publisher'] });
  }

  async findOne(id: string) {
    const game = await this.gameRepository.findOne(
      { id },
      { relations: ['publisher'] },
    );

    if (!game) {
      throw new NotFoundException('Game was not found');
    }

    return game;
  }

  async findGamePublisher(id: string) {
    const game = await this.gameRepository.findOne(
      { id },
      { relations: ['publisher'] },
    );

    if (!game) {
      throw new NotFoundException('Game was not found');
    }

    return game.publisher;
  }

  async update(id: string, data: UpdateGameDto) {
    const [game, publisher] = await Promise.all([
      this.gameRepository.findOne(id),
      this.publisherRepository.findOne(data.publisherId),
    ]);

    if (!game) {
      throw new NotFoundException('Game was not found');
    }

    if (publisher) {
      game.publisher = publisher;
    }

    const updateData = {
      ...game,
      ...data,
    };

    game.price = updateData.price;
    game.title = updateData.title;
    game.tags = updateData.tags;
    game.releaseDate = updateData.releaseDate;

    await this.gameRepository.save(game, { reload: true });

    return game;
  }

  async remove(id: string) {
    const result = await this.gameRepository.delete({ id });

    if (!result.affected) {
      throw new NotFoundException('Game was not found');
    }

    return { id };
  }

  async processDiscounts() {
    const eighteenMonthsAgoDate = subMonths(new Date(), 18);
    const twelveMonthsAgoDate = subMonths(new Date(), 12);

    // Remove games older than 18 months
    await this.gameRepository.delete({
      releaseDate: LessThan(format(eighteenMonthsAgoDate, 'yyyy-MM-dd')),
    });

    // Apply 20% discount to games with age between 12 and 18 months
    await this.gameRepository.update(
      {
        releaseDate: Between(
          startOfDay(new Date(eighteenMonthsAgoDate)),
          endOfDay(new Date(twelveMonthsAgoDate)),
        ),
      },
      {
        price: () => 'price - 0.2 * price',
      },
    );

    return true;
  }
}
