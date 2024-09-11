declare const fs: any;
declare function getFile(file: string): any;
declare function setFile(file: string, contents: {}, sync?: boolean, that?: any): void;
declare function setnest(data: any, key: string, value: any): any;
declare class DB {
    file: string;
    constructor(file?: string);
    set(key: string, value: any): void;
    get(key: string): any;
    has(key: string): boolean;
    remove(key: string): void;
    find(func: (arg0: Function) => string[]): string[];
    keys(): string[];
    values(): any[];
    all(): any;
    backup(file: string): void;
    add(key: string, number: number): void;
    sub(key: string, number: number): void;
    push(key: string, value: any): void;
    pull(key: string, index: number): void;
    pop(key: string): any;
    flat(key: string): void;
    concat(key: string, value: any): void;
    okey(key: string): string[];
}
declare class miniDB {
    file: string;
    constructor(file?: string);
    set(key: string, value: any): void;
    get(key: string): any;
    has(key: string): boolean;
    remove(key: string): void;
    all(): any;
    backup(file: string): void;
}
declare class fastDB {
    file: string;
    stream: WritableStream;
    cont: any;
    constructor(file?: string);
    set(key: string, value: any): void;
    get(key: string): any;
    has(key: string): boolean;
    remove(key: string): void;
    find(func: (arg0: Function) => string[]): string[];
    keys(): string[];
    values(): any[];
    all(): any;
    backup(file: string): void;
    add(key: string, number: number): void;
    sub(key: string, number: number): void;
    push(key: string, value: any): void;
    pull(key: string, index: number): void;
    pop(key: string): any;
    flat(key: string): void;
    concat(key: string, value: any): void;
    okey(key: string): string[];
}
