import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import Game from './game.entity';

@Entity('publisher')
export default class Publisher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  siret: number;

  @Column()
  phone: string;

  @OneToMany(() => Game, (game) => game.publisher)
  games: Game[];
}
