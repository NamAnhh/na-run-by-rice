import React, { useEffect, useState, useMemo, createRef } from "react";
import logo from "./logo.svg";
import axios from "axios";
import RowInfo from "./components/RowInfo/index";
import "./App.css";
import { getPercentFluctuating } from "./func/func";
import notifyAudio from "./assets/tien-ve4.mp3";

function getAllListCrypto() {
  return axios.get("https://exchange.vndc.io/exchange/api/v1/showup-prices");
}
function getCryptoBySymbolAtlas(symbol) {
  return axios.get(
    `https://api.attlas.io/api/v1/exchange/depth?symbol=${symbol || "RACAUSDT"}`
  );
}

function getKaiInfo() {
  return axios
    .post(
      `https://ex-graph.kardiachain.io/subgraphs/name/kai/exchange-v2`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log(res?.data);
    });
}
function getUsdtP2p(symbol, type) {
  return axios
    .get(
      `https://vndc.io/p2p?type=${type || "BUY"}&currency=${symbol || "USDT"}`
    )
    .then((res) => {
      const slideIndexFrom = res?.data.search("font-bold text-18px");
      const dataSlice = res?.data
        ?.slice(slideIndexFrom + 25, slideIndexFrom + 35)
        ?.replace("V", "")
        ?.replace("N", "")
        ?.replace(",", "");
      return dataSlice;
    });
}

const useAudio = (url) => {
  const audio = useMemo(() => new Audio(url), []);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(true);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

function App() {
  const [listCoins, setListCoins] = useState([]);
  const [usdtVndcFixed, setUsdtVndcFixed] = useState(
    localStorage.getItem("usdt") || 23800
  );
  const [playing, alertNotify] = useAudio(notifyAudio);
  const [atlasRaccaUsdt, setAtlasRaccaUsdt] = useState({});
  const [atlasRaccaVndc, setAtlasRaccaVndc] = useState({});

  const handleUsdt = async () => {
    const [usdtBuy, usdtSell] = await Promise.all([
      getUsdtP2p("USDT"),
      getUsdtP2p("USDT", "SELL"),
    ]);
    const avg = (Number(usdtSell) + Number(usdtBuy)) / 2;

    if (avg) {
      setUsdtVndcFixed(avg || 0);
    }
  };

  const handleGetAtlasCrypto = async () => {
    try {
      const [resusdt, resvndc] = await Promise.all([
        getCryptoBySymbolAtlas("RACAUSDT"),
        getCryptoBySymbolAtlas("RACAVNDC"),
      ]);
      const dataUsdt = resusdt?.data?.data;
      const dataVndc = resvndc?.data?.data;
      setAtlasRaccaUsdt({
        ask: dataUsdt.bids[0][0],
        bid: dataUsdt.asks[0][0],
      });
      setAtlasRaccaVndc({
        ask: dataVndc.bids[0][0],
        bid: dataVndc.asks[0][0],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      handleUsdt();
    }, 10000);
    // getKaiInfo();
    setInterval(async () => {
      handleGetAtlasCrypto();
      const res = await getAllListCrypto();
      const data = res?.data;
      setListCoins(data);
    }, 2000);
  }, []);

  function handleALert() {
    if (playing) {
      return;
    }
    console.log("sound!!!");
    alertNotify();
  }

  const listCoinsWatch = [
    {
      name: "ONUS",
      vndcPrice: listCoins["ONUSVNDC"],
      usdtPrice: listCoins["ONUSUSDT"],
      usdtVndcFixed: usdtVndcFixed,
      pcAlert: 0.5,
      percentInlation: 0.01,
      handleALert: handleALert,
      percentShowWarning: 0.5,
    },
    {
      name: "RACA",
      vndcPrice: listCoins["RACAVNDC"],
      usdtPrice: listCoins["RACAUSDT"],
      usdtVndcFixed: usdtVndcFixed,
      pcAlert: 2,
      percentInlation: 0.02,
      handleALert: handleALert,
      percentShowWarning: 1,
    },
  ];

  const handleChange = (value) => {
    localStorage.setItem("usdt", value);
    setUsdtVndcFixed(value);
  };

  return (
    <div className="App">
      <div>
        Update USDT:{" "}
        <input
          value={usdtVndcFixed}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="p2p-usdt">P2P USDT/VNDC: 1/{usdtVndcFixed}</div>
      <br />
      <br />
      <br />
      <table border="1">
        <thead>
          <tr>
            <th>NAME</th>
            <th>USDT</th>
            <th>VND</th>
            <th>USDT*COIN = VNDC</th>
          </tr>
        </thead>
        <tbody>
          {listCoinsWatch.map((item, index) => (
            <RowInfo
              key={index}
              name={item.name}
              vndcPrice={item.vndcPrice}
              usdtPrice={item.usdtPrice}
              usdtVndcFixed={item.usdtVndcFixed}
              pcAlert={item.pcAlert}
              percentInlation={item.percentInlation}
              handleALert={item.handleALert}
              percentShowWarning={item.percentShowWarning}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
