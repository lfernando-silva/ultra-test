import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Publisher } from './publisher.entity';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column({ array: true })
  tags: string;

  @Column()
  releaseDate: Date;

  @ManyToOne(() => Publisher, (publisher) => publisher.games)
  @JoinColumn({ name: 'publisher' })
  publisher: Publisher;
}
