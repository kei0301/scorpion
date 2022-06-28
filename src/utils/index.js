import { Zero } from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';

export function formatBNToString(bn = Zero, nativePrecison = 8, decimalPlaces = 6, sigfig) {
  let fullPrecision = formatUnits(bn, nativePrecison);
  if (sigfig !== undefined) {
    const fpNum = Number(fullPrecision);
    const fpS = fpNum.toPrecision(sigfig);
    if (fpS.indexOf('e') === -1) {
      fullPrecision = fpS;
    }
  }
  const decimalIdx = fullPrecision.indexOf('.');
  return decimalPlaces === undefined || decimalIdx === -1
    ? fullPrecision
    : fullPrecision.slice(
      0,
      decimalIdx + (decimalPlaces > 0 ? decimalPlaces + 1 : 0)
    );
}

export function calculatePrice(amount, decimals) {
  if (typeof amount === 'string') {
    if (isNaN(+amount)) return Zero;
    return parseUnits(amount, decimals);
  } else if (decimals != null) {
    return amount
      .mul(parseUnits(amount, decimals))
      .div(BigNumber.from(10).pow(decimals));
  }
  return Zero;
}