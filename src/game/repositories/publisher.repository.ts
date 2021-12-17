import { EntityRepository, Repository } from 'typeorm';
import { Publisher } from '../entities/publisher.entity';

@EntityRepository(Publisher)
export class PublisherRepository extends Repository<Publisher> {}
