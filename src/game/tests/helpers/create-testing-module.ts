import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../../entities/game.entity';
import { GameService } from '../../game.service';
import { GameRepository } from '../../repositories/game.repository';
import { PublisherRepository } from '../../repositories/publisher.repository';
import config from '../../../config';
import { Publisher } from '../../entities/publisher.entity';
import { GameController } from '../../game.controller';

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
