import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';

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
    return [`This action returns all games`];
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
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

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
