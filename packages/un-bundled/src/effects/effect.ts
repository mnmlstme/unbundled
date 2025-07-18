export type Effector<T extends object> = (scope: T) => void;

export interface Effect<T extends object> {
  execute(scope: T): void;
}

export class DirectEffect<T extends object> implements Effect<T> {
  private effectFn: Effector<T>;

  constructor(fn: Effector<T>) {
    this.effectFn = fn;
  }

  execute(scope: T): void {
    this.effectFn(scope);
  }
}
