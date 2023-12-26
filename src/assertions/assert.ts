import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { registerToBeFalse } from './impl/toBeFalse';
import { registerToBeNever } from './impl/toBeNever';
import { registerToBeNull } from './impl/toBeNull';
import { registerToBeNullish } from './impl/toBeNullish';
import { registerToBeTrue } from './impl/toBeTrue';
import { registerToBeUndefined } from './impl/toBeUndefined';
import { registerToCover } from './impl/toCover';
import { registerToEqual } from './impl/toEqual';
import { registerToExtend } from './impl/toExtend';
import { registerToMatchBoolean } from './impl/toMatchBoolean';
import { registerToStrictCover } from './impl/toStrictCover';
import { registerToStrictExtend } from './impl/toStrictExtend';
import { registerToThrow } from './impl/toThrow';

import type { NotToBeAny, ToBeAny } from './impl/toBeAny';
import type { NotToBeFalse, ToBeFalse } from './impl/toBeFalse';
import type { NotToBeNever, ToBeNever } from './impl/toBeNever';
import type { NotToBeNull, ToBeNull } from './impl/toBeNull';
import type { NotToBeNullish, ToBeNullish } from './impl/toBeNullish';
import type { NotToBeTrue, ToBeTrue } from './impl/toBeTrue';
import type { NotToBeUndefined, ToBeUndefined } from './impl/toBeUndefined';
import type { ToCover } from './impl/toCover';
import type { NotToEqual, ToEqual } from './impl/toEqual';
import type { ToExtend } from './impl/toExtend';
import type { NotToMatchBoolean, ToMatchBoolean } from './impl/toMatchBoolean';
import type { ToStrictCover } from './impl/toStrictCover';
import type { ToStrictExtend } from './impl/toStrictExtend';
import type { NotToThrow, ToThrow } from './impl/toThrow';
import type { Project } from 'ts-morph';

/* Register all assertions */
registerToEqual();
registerToCover();
registerToBeNever();
registerToBeNull();
registerToBeNullish();
registerToBeUndefined();
registerToMatchBoolean();
registerToBeTrue();
registerToBeFalse();
registerToExtend();
registerToStrictExtend();
registerToCover();
registerToStrictCover();
registerToThrow();

export interface Expect<T> {
  /**
   * Expect a pre emitted diagnostic between the start and end of the given type.
   *
   * @example
   * ```typescript
   * type IdNumber<N extends number> = N;
   * expect<IdNumber<'foo'>>().toThrow(); // pass
   * //              ~~~~~
   * //  Type '"foo"' is not assignable to type 'number'.
   * expect<IsNumber<42>>().toThrow(); // fail
   * ```
   */
  toThrow: ToThrow;

  /**
   * Expect a type to be equal to the given type.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toEqual<'foo'>(); // pass
   * expect<'foo'>().toEqual<'bar'>(); // fail
   * expect<'foo'>().toEqual<'foo' | 'bar'>(); // fail
   * ```
   */
  toEqual: ToEqual<T>;
  /**
   * Expect a type to be `any`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toBeAny(); // fail
   * expect<any>().toBeAny(); // pass
   * ```
   */
  toBeAny: ToBeAny<T>;
  /**
   * Expect a type to be `never`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toBeNever(); // fail
   * expect<never>().toBeNever(); // pass
   * ```
   */
  toBeNever: ToBeNever<T>;
  /**
   * Expect a type to be `null`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toBeNull(); // fail
   * expect<null>().toBeNull(); // pass
   * ```
   */
  toBeNull: ToBeNull<T>;
  /**
   * Expect a type to be `undefined`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toBeUndefined(); // fail
   * expect<undefined>().toBeUndefined(); // pass
   * ```
   */
  toBeUndefined: ToBeUndefined<T>;
  /**
   * Expect a type to be `null` or `undefined`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toBeNullish(); // fail
   * expect<null>().toBeNullish(); // pass
   * expect<undefined>().toBeNullish(); // pass
   * ```
   */
  toBeNullish: ToBeNullish<T>;
  /**
   * @deprecated Use {@link toMatchBoolean} instead.
   *
   * @since 0.1.1
   */
  toBeBoolean: ToMatchBoolean<T>;
  /**
   * Expect a type to be `true`, `false`, or `boolean`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toMatchBoolean(); // fail
   * expect<true>().toMatchBoolean(); // pass
   * expect<false>().toMatchBoolean(); // pass
   * expect<boolean>().toMatchBoolean(); // pass
   * ```
   *
   * @since 0.1.2
   */
  toMatchBoolean: ToMatchBoolean<T>;
  /**
   * Expect a type to be `true`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toBeTrue(); // fail
   * expect<true>().toBeTrue(); // pass
   * expect<false>().toBeTrue(); // fail
   * expect<boolean>().toBeTrue(); // fail
   * ```
   *
   * @since 0.1.1
   */
  toBeTrue: ToBeTrue<T>;
  /**
   * Expect a type to be `false`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toBeFalse(); // fail
   * expect<true>().toBeFalse(); // fail
   * expect<false>().toBeFalse(); // pass
   * expect<boolean>().toBeFalse(); // fail
   * ```
   *
   * @since 0.1.1
   */
  toBeFalse: ToBeFalse<T>;

  /**
   * Expect a type to be assignable to the given type (i.e. the given type should be a supertype of
   * the type).
   *
   * **Warning:** `any` is considered both subtype and supertype of all types in TypeScript, so
   * both `expect<string>().toExtend<any>();` and `expect<any>().toExtend<string>();` will pass
   * (`string` can be replaced with any other type, including `any`), so keep that in mind when
   * using this. If you want to check if the type is assignable to the given type but not `any`,
   * use {@link toStrictExtend} instead.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toExtend<'foo'>(); // pass
   * expect<'foo'>().toExtend<string>(); // pass
   * expect<'foo'>().toExtend<'bar'>(); // fail
   * expect<'foo'>().toExtend<'foo' | 'bar'>(); // pass
   * expect<never>().toExtend<'foo'>(); // pass
   * expect<'foo'>().toExtend<any>(); // pass
   * ```
   */
  toExtend: ToExtend<T>;
  /**
   * Like {@link toExtend}, but fails if either type is `never` or `any`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toStrictExtend<'foo'>(); // pass
   * expect<'foo'>().toStrictExtend<string>(); // pass
   * expect<'foo'>().toStrictExtend<'bar'>(); // fail
   * expect<'foo'>().toStrictExtend<'foo' | 'bar'>(); // pass
   * expect<never>().toStrictExtend<'foo'>(); // fail
   * expect<'foo'>().toStrictExtend<any>(); // fail
   * ```
   */
  toStrictExtend: ToStrictExtend<T>;

  /**
   * Expect the given type to be assignable to the type (i.e. the given type should be a subtype of
   * the type).
   *
   * **Warning:** `any` is considered both subtype and supertype of all types in TypeScript, so
   * both `expect<string>().toCover<any>();` and `expect<any>().toCover<string>();` will pass
   * (`string` can be replaced with any other type, including `any`), so keep that in mind when
   * using this. If you want to check if the given type is assignable to the type but not `any`,
   * use {@link toStrictCover} instead.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toCover<'foo'>(); // pass
   * expect<string>().toCover<'foo'>(); // pass
   * expect<'foo' | 'bar'>().toCover<'foo'>(); // pass
   * expect<'foo'>().toCover<'bar'>(); // fail
   * expect<'foo'>().toCover<never>(); // pass
   * expect<any>().toCover<'foo'>(); // pass
   * ```
   */
  toCover: ToCover<T>;
  /**
   * Like {@link toCover}, but fails if either type is `never` or `any`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().toStrictCover<'foo'>(); // pass
   * expect<string>().toStrictCover<'foo'>(); // pass
   * expect<'foo' | 'bar'>().toStrictCover<'foo'>(); // pass
   * expect<'foo'>().toStrictCover<'bar'>(); // fail
   * expect<'foo'>().toStrictCover<never>(); // fail
   * expect<any>().toStrictCover<'foo'>(); // fail
   * ```
   */
  toStrictCover: ToStrictCover<T>;
}

export interface ExpectNot<T> {
  /**
   * Expect no pre emitted diagnostic between the start and end of the given type.
   *
   * @example
   * ```typescript
   * type IdNumber<N extends number> = N;
   * expect<IdNumber<'foo'>>().not.toThrow(); // fail
   * //              ~~~~~
   * //  Type '"foo"' is not assignable to type 'number'.
   * expect<IsNumber<42>>().not.toThrow(); // pass
   * ```
   */
  toThrow: NotToThrow;

  /**
   * Expect a type not to be the same as the given type.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toEqual<'foo'>(); // fail
   * expect<'foo'>().not.toEqual<'bar'>(); // pass
   * expect<'foo'>().not.toEqual<'foo' | 'bar'>(); // pass
   * ```
   */
  toEqual: NotToEqual<T>;
  /**
   * Expect a type not to be `any`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toBeAny(); // pass
   * expect<any>().not.toBeAny(); // fail
   * ```
   */
  toBeAny: NotToBeAny<T>;
  /**
   * Expect a type not to be `never`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toBeNever(); // pass
   * expect<never>().not.toBeNever(); // fail
   * ```
   */
  toBeNever: NotToBeNever<T>;
  /**
   * Expect a type not to be `null`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toBeNull(); // pass
   * expect<null>().not.toBeNull(); // fail
   * ```
   */
  toBeNull: NotToBeNull<T>;
  /**
   * Expect a type not to be `undefined`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toBeUndefined(); // pass
   * expect<undefined>().not.toBeUndefined(); // fail
   * ```
   */
  toBeUndefined: NotToBeUndefined<T>;
  /**
   * Expect a type not to be `null` or `undefined`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toBeNullish(); // pass
   * expect<null>().not.toBeNullish(); // fail
   * expect<undefined>().not.toBeNullish(); // fail
   * ```
   */
  toBeNullish: NotToBeNullish<T>;
  /**
   * @deprecated Use {@link toMatchBoolean} instead.
   *
   * @since 0.1.1
   */
  toBeBoolean: NotToMatchBoolean<T>;
  /**
   * Expect a type not to be `true`, `false`, or `boolean`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toMatchBoolean(); // pass
   * expect<true>().not.toMatchBoolean(); // fail
   * expect<false>().not.toMatchBoolean(); // fail
   * expect<boolean>().not.toMatchBoolean(); // fail
   * ```
   *
   * @since 0.1.2
   */
  toMatchBoolean: NotToMatchBoolean<T>;
  /**
   * Expect a type not to be `true`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toBeTrue(); // pass
   * expect<true>().not.toBeTrue(); // fail
   * expect<false>().not.toBeTrue(); // pass
   * expect<boolean>().not.toBeTrue(); // pass
   * ```
   *
   * @since 0.1.1
   */
  toBeTrue: NotToBeTrue<T>;
  /**
   * Expect a type not to be `false`.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toBeFalse(); // pass
   * expect<true>().not.toBeFalse(); // pass
   * expect<false>().not.toBeFalse(); // fail
   * expect<boolean>().not.toBeFalse(); // pass
   * ```
   *
   * @since 0.1.1
   */
  toBeFalse: NotToBeFalse<T>;

  /**
   * Expect a type not to extend the given type.
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toExtend<'foo'>(); // fail
   * expect<'foo'>().not.toExtend<string>(); // fail
   * expect<'foo'>().not.toExtend<'bar'>(); // pass
   * expect<'foo'>().not.toExtend<'foo' | 'bar'>(); // fail
   * expect<never>().not.toExtend<'foo'>(); // fail
   * expect<'foo'>().not.toExtend<any>(); // fail
   * ```
   */
  toExtend: ToExtend<T>;
  /**
   * Expect a type not to strictly extend the given type (i.e. both types should not be `never` or `any`).
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toStrictExtend<'foo'>(); // fail
   * expect<'foo'>().not.toStrictExtend<string>(); // fail
   * expect<'foo'>().not.toStrictExtend<'bar'>(); // pass
   * expect<'foo'>().not.toStrictExtend<'foo' | 'bar'>(); // fail
   * expect<never>().not.toStrictExtend<'foo'>(); // pass
   * expect<'foo'>().not.toStrictExtend<any>(); // pass
   * ```
   */
  toStrictExtend: ToStrictExtend<T>;

  /**
   * Expect a type not to cover the given type (i.e. the given type should not extend the type).
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toCover<'foo'>(); // fail
   * expect<string>().not.toCover<'foo'>(); // fail
   * expect<'foo' | 'bar'>().not.toCover<'foo'>(); // fail
   * expect<'foo'>().not.toCover<'bar'>(); // pass
   * expect<'foo'>().not.toCover<never>(); // fail
   * expect<any>().not.toCover<'foo'>(); // fail
   * ```
   */
  toCover: ToCover<T>;
  /**
   * Expect a type not to strictly cover the given type (i.e. both types should not be `never` or `any`).
   *
   * @example
   * ```typescript
   * expect<'foo'>().not.toStrictCover<'foo'>(); // fail
   * expect<string>().not.toStrictCover<'foo'>(); // fail
   * expect<'foo' | 'bar'>().not.toStrictCover<'foo'>(); // fail
   * expect<'foo'>().not.toStrictCover<'bar'>(); // pass
   * expect<'foo'>().not.toStrictCover<never>(); // pass
   * expect<any>().not.toStrictCover<'foo'>(); // pass
   * ```
   */
  toStrictCover: ToStrictCover<T>;
}

/**
 * Expect a type to satisfy a set of assertions.
 *
 * @example
 * ```typescript
 * import { expect } from 'typroof';
 *
 * expect<'foo'>().toEqual<'foo'>(); // pass
 * expect<'foo'>().toExtend<number>(); // fail
 * expect<'foo'>().not.toExtend<number>(); // pass
 * ```
 */
export const expect: <T>(t?: T) => Expect<T> & { not: ExpectNot<T> } = () =>
  new Proxy({} as never, {
    get: (_, key) => (key === 'not' ? new Proxy({} as never, { get: () => {} }) : () => {}),
  });

const currentFilePathName = (() => {
  let result = '';
  try {
    result = __dirname;
  } catch (error) {
    result = fileURLToPath(import.meta.url);
  }
  if (path.extname(result) === '.js')
    result = path.join(path.dirname(result), path.basename(result, '.js') + '.d.ts');
  return result;
})();
export const getExpectSymbol = (project: Project) => {
  const file = project.addSourceFileAtPath(currentFilePathName);
  const symbol = file.getExportedDeclarations().get('expect')?.[0]?.getSymbol();
  if (!symbol) throw new Error('Cannot find `expect` symbol');
  return symbol;
};
