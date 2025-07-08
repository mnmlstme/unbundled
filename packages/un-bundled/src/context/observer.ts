export type ObserverEffect<T> = (name: keyof T, value: any) => void;

export interface Observer<T extends object> {
  setEffect(fn: ObserverEffect<T>): void;
}
