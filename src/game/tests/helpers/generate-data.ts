import { addDays } from 'date-fns';
import * as faker from 'faker';

import { Publisher } from '../../entities';

export function generateGame(publisher: Publisher) {
  return {
    title: faker.name.title(),
    price: parseInt(faker.finance.amount(1), 10),
    tags: faker.random.words(10).split(' ') as string[],
    releaseDate: addDays(new Date(), Math.floor(Math.random() * 365)),
    publisherId: publisher.id,
  };
}

export function generateGames(publisher: Publisher, length = 10) {
  return Array.from({ length }, () => generateGame(publisher));
}
