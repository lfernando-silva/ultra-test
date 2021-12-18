import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import Game from './game.entity';

@Entity('publisher')
export default class Publisher {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  siret: number;

  @Column()
  @ApiProperty()
  phone: string;

  @OneToMany(() => Game, (game) => game.publisher)
  @ApiProperty()
  games: Game[];
}
