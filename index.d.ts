declare const fs: any;
declare class DB {
    file: string;
    compact: boolean;
    constructor(file?: string, options?: {});
    _getFile(): any;
    _setFile(contents: any, file?: string): void;
    _setnest(data: any, key: string, value: any): any;
    set(key: string, value: any): void;
    get(key: string): any;
    has(key: string): boolean;
    remove(key: string): void;
    find(func: (arg0: any, arg1: string) => any): string[];
    keys(): string[];
    values(): unknown[];
    all(): any;
    backup(file: string): void;
    add(key: string, number: number): void;
    sub(key: string, number: number): void;
    push(key: string, value: any): void;
    pull(key: string, index: number): void;
    pop(key: string): any;
    flat(key: string): void;
    concat(key: string, value: any): void;
}
