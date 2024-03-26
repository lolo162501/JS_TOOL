const https = require('https');
const readline = require('readline');

const fetchData = () => {
  const apiUrl = `https://max-api.maicoin.com/api/v2/summary`;

  https.get(apiUrl, (response) => {
    let data = '';

    // A chunk of data has been received.
    response.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received.
    response.on('end', () => {
      try {
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
        console.log(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);
        const parsedData = JSON.parse(data);
        calculatePoint(parsedData.tickers, 'btc')
        calculatePoint(parsedData.tickers, 'eth')
        calculatePoint(parsedData.tickers, 'sol')
        calculatePoint(parsedData.tickers, 'bnb')
        calculatePoint(parsedData.tickers, 'xrp')
        calculatePoint(parsedData.tickers, 'max')
        calculatePoint(parsedData.tickers, 'matic')
        calculatePoint(parsedData.tickers, 'ada')
        calculatePoint(parsedData.tickers, 'usdt')
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
      }
    });
  }).on('error', (error) => {
    console.error('Error making API request:', error.message);
  });

  function calculatePoint(tickers, market) {
    const twdInfo = tickers[market + 'twd'];
    const open = parseFloat(twdInfo.open);
    const low = parseFloat(twdInfo.low);
    const high = parseFloat(twdInfo.high);
    const last = parseFloat(twdInfo.last);
    const buy = parseFloat(twdInfo.buy);
    const sell = parseFloat(twdInfo.sell);
    const volume = parseFloat(twdInfo.volume);
    // 簡單趨勢分析
    const trend = last > open ? 'UP' : last < open ? 'DOWN' : 'UNCHANGED';
    // 支撐與阻力點
    const supportLevel = low;
    const resistanceLevel = high;
    // 輸出結果
    if (market == 'btc') {
      // const usdt = tickers['usdt' + 'twd'];
      const btc = tickers['btc' + 'usdt'];
      // const btcUSDT = usdt.last * btc.last;
      // const trend = btcUSDT > last ? 'B' : 'P';
      console.log(`BTC/USDT : ${btc.last}`);
    } else if (market == 'eth') {
      const eth = tickers['eth' + 'usdt'];
      console.log(`ETH/USDT : ${eth.last}`);
    }
    console.log(`${market.toUpperCase()}/TWD : ${last}`);
  }
}
setInterval(fetchData, 200);