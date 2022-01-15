export function getPercentFluctuating(avgVndc, usdtVndc, inflation) {
  if (Number(avgVndc) > Number(usdtVndc)) {
    const difference = Number(avgVndc) - Number(usdtVndc);
    return Number((difference / Number(avgVndc) - inflation) * 100).toFixed(2);
  }
  if (Number(avgVndc) < Number(usdtVndc)) {
    const difference = Number(usdtVndc) - Number(avgVndc);

    return ((Number(difference) / Number(usdtVndc) - inflation) * 100).toFixed(
      2
    );
  }
  return 0;
}
