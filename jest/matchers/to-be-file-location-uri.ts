/**
 * Asserts that a string is a valid file location uri,
 *
 * @param {string} received the location URI
 * @param {string} fileExt the file extension
 *
 * @example
 *
 * expect(res.body).toEqual(
 *   expect.objectContaining({
 *     location: expect.toBeFileLocationUri('png'),
 *   })
 * );
 *
 * // Alternativelly:
 *
 * expect(res.body.location).toBeFileLocationUri('png')
 *
 */
export default function toBeFileLocationUri(received, fileExt) {
  const locationRegex = new RegExp(`^(file|https?)://.+${fileExt}$`);

  const pass = locationRegex.test(received);

  if (pass) {
    return {
      pass: true,
      message: () =>
        `${this.utils.printReceived(received)} is a valid file location URI`,
    };
  }

  return {
    pass: false,
    message: () =>
      `${this.utils.printReceived(received)} is not a valid file location URI`,
  };
}
