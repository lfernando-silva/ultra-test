import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from './entities';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PublisherRepository, GameRepository } from './repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GameRepository, PublisherRepository]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository, PublisherRepository],
})
export class GameModule {}
