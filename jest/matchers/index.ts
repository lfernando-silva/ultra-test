import toBeFileLocationUri from './to-be-file-location-uri';
import toBeIsoDate from './to-be-iso-date';
import toContainKeys from './to-contain-keys';

expect.extend({
  toBeIsoDate,
  toContainKeys,
  toBeFileLocationUri,
});
