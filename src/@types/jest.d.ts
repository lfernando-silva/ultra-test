export {};

declare global {
  namespace jest {
    interface Expect {
      toBeIsoDate(): { pass: boolean; message: string };
      toContainKeys(): { pass: boolean; message: string };
      toBeFileLocationUri(): { pass: boolean; message: string };
    }
  }
}
