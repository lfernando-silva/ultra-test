import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';

import { CreateGameDto } from './dto/create-game.dto';
// import { UpdateGameDto } from './dto/update-game.dto';

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

  // update(id: number, updateGameDto: UpdateGameDto) {
  //   return `This action updates a #${id} game`;
  // }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
