import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Publisher } from './publisher.entity';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column()
  tags: string[];

  @Column()
  releaseDate: Date;

  @ManyToOne(() => Publisher, (publisher) => publisher.games)
  publisher: Publisher;
}
