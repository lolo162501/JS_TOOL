const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculateResult_2(holdingQuantity, purchaseAmount, sellAmount, isMarket) {
  const feeRate = isMarket ? 0.00045 : 0.0015;
  const feePurchase = (purchaseAmount * holdingQuantity) * feeRate;
  const feeSell = (sellAmount * holdingQuantity) * feeRate;
  const result = ((sellAmount - purchaseAmount) * holdingQuantity) - feePurchase - feeSell;
  console.log(`手續費(買)為: ${feePurchase}`);
  console.log(`手續費(賣)為: ${feeSell}`);
  return result;
}
function calculateResult_1(baseMoney, purchaseAmount, sellAmount, isMarket) {
  const feeRate = isMarket ? 0.00045 : 0.0015;
  const holdingQuantity = baseMoney / purchaseAmount;
  const feePurchase = (purchaseAmount * holdingQuantity) * feeRate;
  const feeSell = (sellAmount * holdingQuantity) * feeRate;
  const result = ((sellAmount - purchaseAmount) * holdingQuantity) - feePurchase - feeSell;
  console.log(`手續費(買)為: ${feePurchase}`);
  console.log(`手續費(賣)為: ${feeSell}`);
  return result;
}

rl.question('請選擇模式:', (mode) => {
  if (mode === '1') {
    rl.question('請輸入投資金額: ', (baseMoney) => {
      rl.question('請輸入購買金額: ', (purchaseAmount) => {
        rl.question('請輸入賣出金額: ', (sellAmount) => {
          rl.question('是否為 market (是請輸入1，否請輸入0): ', (isMarket) => {
            const result = calculateResult_1(
              parseFloat(baseMoney),
              parseFloat(purchaseAmount),
              parseFloat(sellAmount),
              parseInt(isMarket) === 1);
            console.log(`計算結果為: ${result}`);
            rl.close();
          });
        });
      });
    })
  } else {
    rl.question('請輸入持有數量: ', (holdingQuantity) => {
      rl.question('請輸入購買金額: ', (purchaseAmount) => {
        rl.question('請輸入賣出金額: ', (sellAmount) => {
          rl.question('是否為 market (是請輸入1，否請輸入0): ', (isMarket) => {
            const result = calculateResult_2(
              parseFloat(holdingQuantity),
              parseFloat(purchaseAmount),
              parseFloat(sellAmount),
              parseInt(isMarket) === 1);
            console.log(`計算結果為: ${result}`);
            rl.close();
          });
        });
      });
    })
  }
});

rl.on('close', () => {
  process.exit(0);
});
