const axios = require('axios');

async function getPrice() {
    try {
        const symbols = `["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","AAVEUSDT","ADAUSDT","AVAXUSDT","XRPUSDT","ORDIUSDT","DOGEUSDT","SHIBUSDT"]`
        // const symbols = `["ETHBTC","BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","AAVEUSDT","ADAUSDT","XRPUSDT","USDCUSDT"]`
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbols=${symbols}`);
        const data = response.data;
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');

        let str = `${year}/${month}/${day} ${hours}:${minutes}:${seconds} \n`;
        data.forEach(entry => {
            const symbol = entry.symbol;
            const price = entry.price;
            str += `${symbol} : ${parseFloat(price).toFixed(5)} \n`;
        });
        return str;
    } catch (error) {
        return `Error => ${error.message}`;
    }
}

async function getBinancePrice() {
    return await getPrice();
}

setInterval(() => {
    getBinancePrice().then(r =>
        console.log(r)
    )
}, 200);