declare module 'bun:sqlite' {
  interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }
  interface Statement {
    run(...params: unknown[]): RunResult;
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }
  class Database {
    constructor(filename: string, options?: { readonly?: boolean; create?: boolean });
    run(sql: string, ...params: unknown[]): RunResult;
    prepare(sql: string): Statement;
    close(): void;
  }
}
