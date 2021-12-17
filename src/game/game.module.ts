import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { GameRepository } from './repositories/game.repository';
import { GameController } from './game.controller';
import { PublisherRepository } from './repositories/publisher.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GameRepository, PublisherRepository]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository, PublisherRepository],
})
export class GameModule {}
