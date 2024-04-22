export abstract class Event<T = any> {
  name: string;

  run(...args: T[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
