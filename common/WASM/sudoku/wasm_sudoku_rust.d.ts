/* tslint:disable */
/* eslint-disable */
/**
 * @param {string} input
 * @returns {boolean}
 */
export function validate_sudoku(input: string): boolean;
/**
 * @param {string} input
 * @returns {string}
 */
export function solve_sudoku(input: string): string;
/**
 * @returns {string}
 */
export function generate_sudoku(): string;
/**
 * @param {string} input
 * @param {number} row
 * @param {number} col
 * @returns {string}
 */
export function generate_suggestions(
  input: string,
  row: number,
  col: number
): string;

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly validate_sudoku: (a: number, b: number) => number;
  readonly solve_sudoku: (a: number, b: number, c: number) => void;
  readonly generate_sudoku: (a: number) => void;
  readonly generate_suggestions: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number
  ) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
 * Synchronously compiles the given `bytes` and instantiates the WebAssembly module.
 *
 * @param {BufferSource} bytes
 *
 * @returns {InitOutput}
 */
export function initSync(bytes: BufferSource): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function init(
  module_or_path?: InitInput | Promise<InitInput>
): Promise<InitOutput>;
