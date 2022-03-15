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

export const calculatePercent = (coinVNDC, coinUSDT) => {
  console.log(
    "Number(coinVNDC.ask) > Number(coin2.bid)123",
    Number(coinVNDC.ask) > Number(coinUSDT.bid)
  );
  if (Number(coinVNDC.ask) > Number(coinUSDT.bid)) {
    const deviation = Number(coinVNDC.ask) - Number(coinUSDT.bid);
    console.log("deviationVNDC > USDT", deviation);
    return (deviation / Number(coinUSDT.bid)) * 100;
  }
  if (Number(coinUSDT.ask) > Number(coinVNDC.bid)) {
    const deviation = Number(coinUSDT.ask) - Number(coinVNDC.bid);
    console.log("deviationVNDC < USDT", deviation);
    return (deviation / Number(coinVNDC.bid)) * 100;
  }
  return 0;
};
