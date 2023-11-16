import { ts } from 'ts-morph';

import type { Node, Symbol } from 'ts-morph';

// eslint-disable-next-line @typescript-eslint/ban-types
export const isCallOfSymbol = (s: Symbol) => (call: Node<ts.Node>) => {
  if (!call.isKind(ts.SyntaxKind.CallExpression)) return false;
  const expression = call.getExpression();
  if (!expression) return false;
  const symbol = expression.getSymbol();
  if (!symbol) return false;
  return symbol.getAliasedSymbol() === s;
};
export const isCallOfSymbols =
  // eslint-disable-next-line @typescript-eslint/ban-types
  (ss: readonly Symbol[]) => (call: Node<ts.Node>) => {
    if (!call.isKind(ts.SyntaxKind.CallExpression)) return false;
    const expression = call.getExpression();
    if (!expression) return false;
    const symbol = expression.getSymbol();
    if (!symbol) return false;
    const aliasedSymbol = symbol.getAliasedSymbol();
    if (!aliasedSymbol) return false;
    return ss.includes(aliasedSymbol);
  };
