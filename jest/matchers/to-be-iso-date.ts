/**
 * A RegExp to match ISO formatted UTC dates, like "2020-01-23T03:42:23.022Z"
 */
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

/**
 * Asserts that a string is a valid ISO formatted date,
 * like "2020-01-23T03:42:23.022Z"
 *
 * @param {string} received
 *
 * @example
 *
 * expect(res.body).toEqual(
 *   expect.objectContaining({
 *     createdAt: expect.toBeIsoDate(),
 *     updatedAt: expect.toBeIsoDate(),
 *  })
 * );
 *
 * // Alternativelly:
 *
 * expect(res.body.createdAt).toBeIsoDate()
 *
 */
export default function toBeIsoDate(received) {
  const pass = isoDateRegex.test(received);

  if (pass) {
    return {
      pass: true,
      message: () =>
        `${this.utils.printReceived(received)} is a valid ISO date`,
    };
  }

  return {
    pass: false,
    message: () =>
      `${this.utils.printReceived(received)} is not a valid ISO date`,
  };
}
