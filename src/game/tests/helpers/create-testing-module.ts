import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

import config from '../../../config';
import { Publisher, Game } from '../../entities';
import { GameController } from '../../game.controller';
import { GameService } from '../../game.service';
import { PublisherRepository, GameRepository } from '../../repositories';

const envFilePath = path.join(
  process.cwd(),
  `.env.${process.env.NODE_ENV || 'development'}`,
);

export default function createTestingModule() {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [config],
        envFilePath,
      }),
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DBNAME,
        entities: [Game, Publisher],
      }),
      TypeOrmModule.forFeature([Game, GameRepository, PublisherRepository]),
    ],
    controllers: [GameController],
    providers: [GameService, GameRepository, PublisherRepository],
  }).compile();
}
