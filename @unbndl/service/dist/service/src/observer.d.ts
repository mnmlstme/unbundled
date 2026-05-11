import { Effector, Signal } from '@unbndl/html';
export declare class Observer<T extends object> {
    private contextLabel;
    private provider?;
    private observed?;
    constructor(contextLabel: string);
    observe(from: Element, fn: Effector<[Signal<T, keyof T>]>): Promise<T>;
    private attachObserver;
}
