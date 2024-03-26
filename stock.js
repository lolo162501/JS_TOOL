const axios = require('axios');

// Function to make the API call and process the data
const fetchData = async () => {
  const stockListTSE = ['0050', '0056', '00713', '00878', '2330', '2303', '2454', '2317', '1517', '1609', '1605', '6443', '2609','2603'];
  const stockListOTC = ['5278'];
  const stockList1 = stockListTSE.map(stock => `tse_${stock}.tw`).join('|');
  const stockList2 = stockListOTC.map(stock => `otc_${stock}.tw`).join('|');
  const stockList = `${stockList1}|${stockList2}`;
  const queryUrl = `http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${stockList}&delay=0`;

  try {
    const response = await axios.get(queryUrl);
    if (response.status !== 200) {
      throw new Error('取得股票資訊失敗...');
    }
    const data = response.data;
    const columns = ['c', 'n', 'z', 'tv', 'v', 'o', 'h', 'l', 'y', 'tlong'];
    const stockDataFrame = data.msgArray.map(stock => ({
      '股票代號': stock.c,
      '公司簡稱': stock.n,
      '成交價': stock.z !== '-' ? stock.z : previousPriceData[stock.c]?.['成交價'] || 0,
      '成交量': stock.tv !== '-' ? stock.tv : previousVolumData[stock.c]?.['成交量'] || 0,
      '累積成交量': stock.v,
      '開盤價': stock.o,
      '最高價': stock.h,
      '最低價': stock.l,
      '昨收價': stock.y,
      '資料更新時間': new Date(parseInt(stock.tlong) + 8 * 60 * 60 * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      '漲跌百分比': 0.0
    }));

    // Calculate the percentage change for each stock
    stockDataFrame.forEach(stock => {
      const result = (parseFloat(stock['成交價']) - parseFloat(stock['昨收價'])) / parseFloat(stock['昨收價']) * 100;
      stock['成交價'] = parseFloat(stock['成交價']).toFixed(2);
      stock['開盤價'] = parseFloat(stock['開盤價']).toFixed(2);
      stock['最高價'] = parseFloat(stock['最高價']).toFixed(2);
      stock['最低價'] = parseFloat(stock['最低價']).toFixed(2);
      stock['昨收價'] = parseFloat(stock['昨收價']).toFixed(2);
      stock['漲跌百分比'] = result === -100 ? '-' : result.toFixed(2);
    });

    console.table(stockDataFrame);

    // Store the current data to use as previous data in the next call
    previousPriceData = stockDataFrame.reduce((obj, stock) => {
      obj[stock['股票代號']] = { '成交價': stock['成交價'] };
      return obj;
    }, {});
    previousVolumData = stockDataFrame.reduce((obj, stock) => {
      obj[stock['股票代號']] = { '成交量': stock['成交量'] };
      return obj;
    }, {});
  } catch (error) {
    console.error(error);
  }
};

// Variable to store previous data 
let previousPriceData = {};
let previousVolumData = {};

// Call the fetchData function every second
fetchData();
// setInterval(fetchData, 3600);