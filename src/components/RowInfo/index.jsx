import React, { useState } from "react";
import "./row-info.css";
import { getPercentFluctuating } from "./../../func/func";

const RowInfo = ({
  name,
  vndcPrice,
  usdtPrice,
  usdtVndcFixed,
  pcAlert,
  percentInlation,
  handleALert,
  percentShowWarning,
}) => {
  const [percentAlert, setPercentAlert] = useState(pcAlert || 1);
  const [percentAlertFixed, setPercentAlertFixed] = useState(pcAlert || 1);

  const avgVndcPrice = Number((vndcPrice?.ask + vndcPrice?.bid) / 2);
  const avgUsdtPrice = Number(
    (Number(usdtPrice?.ask) + Number(usdtPrice?.bid)) / 2
  );
  const usdtExchangePrice = Number(usdtVndcFixed * avgUsdtPrice);

  const percentFluctuating = getPercentFluctuating(
    avgVndcPrice,
    usdtExchangePrice,
    percentInlation || 0.01
  );

  if (percentFluctuating > Number(percentAlertFixed)) {
    handleALert();
  }
  console.log(percentShowWarning);
  return (
    <>
      <tr>
        <td>{name}</td>
        <td>
          <div className="price usdt">
            Buy: {usdtPrice?.bid}
            <br />
            Sell: {usdtPrice?.ask}
          </div>
        </td>
        <td>
          <div className="price vndc">
            Buy: {vndcPrice?.bid}
            <br />
            Sell: {vndcPrice?.ask}
          </div>
          <div>
            <input
              onChange={(e) => {
                setPercentAlert(e.target.value);
              }}
              value={percentAlert}
            />
            <button
              onClick={() => {
                setPercentAlertFixed(percentAlert);
              }}
            >
              Set
            </button>
          </div>
        </td>
        <td className={`${percentFluctuating > 0 ? "up-price" : "down-price"}`}>
          {usdtExchangePrice?.toFixed(2)}
          <br /> {percentFluctuating}%
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          {Number(avgVndcPrice) < Number(usdtExchangePrice) &&
            percentFluctuating > percentShowWarning && (
              <div className="alert-buy">
                BUY {name} BY<span className="vndc"> VNDC </span> {"===>"} SELL{" "}
                {name}
                TO <span className="usdt">USDT</span>
              </div>
            )}
          {Number(avgVndcPrice) > Number(usdtExchangePrice) &&
            percentFluctuating > percentShowWarning && (
              <div className="alert-buy">
                BUY {name} BY<span className="usdt"> USDT </span> {"===>"} SELL{" "}
                {name}
                TO <span className="vndc"> VNDC </span>
              </div>
            )}
        </td>
      </tr>
    </>
  );
};
export default RowInfo;
