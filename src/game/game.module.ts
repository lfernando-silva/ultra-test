// import { Module } from '@nestjs/common';
// import { GamesService } from './game.service';
// import { GamesController } from './game.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Game } from './entities/game.entity';

// @Module({
//   // imports: [TypeOrmModule.forFeature([Game])],
//   controllers: [GamesController],
//   providers: [GamesService],
//   exports: [GamesService],
// })
// export class GamesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { GameController } from './game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService, GameRepository],
})
export class GameModule {}
