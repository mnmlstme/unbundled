import { Source, SourceEffect } from '@unbndl/view';
export declare function fromService<T extends object>(target: HTMLElement, contextLabel: string): Source<T>;
export declare class FromService<T extends object> implements Source<T> {
    private client;
    private observer;
    constructor(client: HTMLElement, contextLabel: string);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}
