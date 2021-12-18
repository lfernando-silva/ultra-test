import { EntityRepository, Repository } from 'typeorm';

import { Game } from '../entities';

@EntityRepository(Game)
export default class GameRepository extends Repository<Game> {}
