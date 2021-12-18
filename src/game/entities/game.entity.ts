import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Publisher from './publisher.entity';

@Entity('game')
export default class Game {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  price: number;

  @Column({ array: true })
  @ApiProperty()
  tags: string;

  @Column()
  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  @ManyToOne(() => Publisher, (publisher) => publisher.games)
  @JoinColumn({ name: 'publisher' })
  publisher: Publisher;
}
