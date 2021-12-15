/**
 * Asserts that an object contains an exact list of keys.
 *
 * @param {object} received
 * @param {Array<string>} expected
 *
 * @example
 *
 * // It can be used when asserting an error object:
 *
 * expect(error).toEqual({
 *   extensions: {
 *     invalidInput: expect.toContainKeys(['email', 'name']),
 *   },
 * });
 *
 * // It can be used to assert an object directly:
 *
 * const { invalidInput } = error && error.extensions || {};
 * expect(invalidInput).toContainKeys(['email', 'name']),
 *
 */
export default function toContainKeys(received, expected) {
  if (typeof received !== 'object' || received === null) {
    return {
      pass: false,
      message: () => `${this.utils.printReceived(received)} is not an object`,
    };
  }

  const outcast = Object.keys(received).filter(
    (presentField) => !expected.includes(presentField)
  );

  const pass = outcast.length === 0;

  if (pass) {
    return {
      pass: true,
      message: () =>
        `Received object keys match match all of the expected keys: ${this.utils.printReceived(
          received
        )} `,
    };
  }

  return {
    pass: false,
    message: () =>
      `Expected invalid fields to be ${this.utils.printExpected(
        expected
      )} but got ${this.utils.printReceived(received)}`,
  };
}
