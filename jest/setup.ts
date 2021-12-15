import toBeFileLocationUri from './matchers/to-be-file-location-uri';
import toBeIsoDate from './matchers/to-be-iso-date';
import toContainKeys from './matchers/to-contain-keys';

beforeAll(async () => {
  expect.extend({
    toBeIsoDate,
    toContainKeys,
    toBeFileLocationUri,
  });
});
