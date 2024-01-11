import chalk from 'chalk';

import { match, registerAnalyzer } from '../matcher';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { strictExtend } from './strictExtend';

/**
 * [Matcher] Expect a type to be assignable to the given type (i.e. the given type should be a
 * supertype of the type).
 *
 * **Warning:** In TypeScript, `any` is both a subtype and a supertype of all other types.
 * Therefore, `expect<string>().to(extend<any>)` and `expect<any>().to(extend<string>)` will both pass.
 * The exception is `never`, which is not assignable to any type (thus `expect<any>().to(extend<never>)` fails).
 * Keep this in mind, as it may lead to unexpected results when working with `any` or `never`.
 * Use {@link strictExtend} for a stricter version that fails if either the type or the given type is `never` or `any`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(extend<'foo'>); // pass
 * expect<'foo'>().not.to(extend<'foo'>); // fail
 * expect<'foo'>().to(extend('foo')); // pass
 * expect<'foo'>().to(extend<string>); // pass
 * expect<'foo'>().to(extend<'bar'>); // fail
 * expect<'foo'>().to(extend<'foo' | 'bar'>); // pass
 * expect<never>().to(extend<'foo'>); // pass
 * expect<'foo'>().to(extend<any>); // pass
 * ```
 */
export const extend = <U>(
  // @ts-expect-error - `y` is used only for type inference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  y?: U,
) => match<'extend', U>();

export const registerToExtend = () => {
  registerAnalyzer('extend', (actual, expected, passed, { not }) => {
    if (passed) return;

    const actualText = chalk.bold(actual.text);
    const expectedType = chalk.bold(expected.getText());
    const actualType = chalk.bold(actual.type.getText());

    throw (
      `Expect ${actualText} (${actualType}) ${not ? 'not ' : ''}to extend ${expectedType}, ` +
      `but ${not ? 'it does' : 'it does not'}.`
    );
  });
};
