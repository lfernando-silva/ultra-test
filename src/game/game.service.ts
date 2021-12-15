import { Injectable } from '@nestjs/common';

import { CreateGameDto } from './dto/create-game.dto';
// import { UpdateGameDto } from './dto/update-game.dto';

import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  constructor(private gamesRepository: GameRepository) {}

  async create(data: CreateGameDto) {
    const game = this.gamesRepository.create(data);
    await this.gamesRepository.save(data);
    return game;
  }

  findAll() {
    return `This action returns all games`;
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
