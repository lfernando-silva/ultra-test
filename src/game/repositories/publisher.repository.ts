import { EntityRepository, Repository } from 'typeorm';
import { Publisher } from '../entities';

@EntityRepository(Publisher)
export default class PublisherRepository extends Repository<Publisher> {}
