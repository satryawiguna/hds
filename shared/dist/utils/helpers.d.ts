export declare const sleep: (ms: number) => Promise<void>;
export declare const isEmptyObject: (obj: any) => boolean;
export declare const omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>;
export declare const pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>;
//# sourceMappingURL=helpers.d.ts.map