declare const fs: any;
declare class DB {
    file: string;
    compact: boolean;
    warm: boolean;
    contents?: object;
    constructor(file?: string, options?: {});
    set(key: string, value: any): void;
    get(key: string): any;
    has(key: string): boolean;
    remove(key: string): void;
    find(func: (arg0: any, arg1: string) => boolean): string[];
    all(): object;
    backup(file: string): void;
    add(key: string, number: number): void;
    sub(key: string, number: number): void;
    push(key: string, value: any): void;
    pull(key: string, index: number): void;
    pop(key: string): any;
    flat(key: string, number?: number): void;
    concat(key: string, value: any): void;
}
