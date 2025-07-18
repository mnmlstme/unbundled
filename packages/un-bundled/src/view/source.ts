export type SourceEffect<T> = (name: keyof T, value: any) => void;

export interface Source<T extends object> {
  start(fn: SourceEffect<T>): Promise<T>;
}
