const axios = require('axios');
const ExcelJS = require('exceljs');

async function fetchData(rid, sid, page) {
    const url = `https://newhouse.591.com.tw/home/housing/search?rid=${rid}&sid=${sid}&page=${page}`;
    console.log('Fetching data from URL:', url);
    const response = await axios.get(url);
    return response.data.data.items;
}

async function appendDataToWorksheet(items, worksheet) {
    // Add rows to the worksheet from the API response
    items.forEach(item => {
        worksheet.addRow({
            build_name: item.build_name,
            address: item.address,
            price: item.price,
            price_unit_test: item.price_unit_test,
            total_price_test: item.total_price_test,
            area: item.area,
            room: item.room,
            updatetime: item.updatetime,
            cover: item.cover,
            detail: 'http://newhouse.591.com.tw/home/housing/info?hid=' + item.hid,
        });
    });
}

async function fetchMultiplePagesAndWriteToExcel(rid, sid, totalPages) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Define columns in the worksheet
    worksheet.columns = [
        { header: 'Build Name', key: 'build_name', width: 30 },
        { header: 'Address', key: 'address', width: 30 },
        { header: 'Price', key: 'price', width: 15 },
        { header: 'Price Test', key: 'price_unit_test', width: 30 },
        { header: 'Total Test', key: 'total_price_test', width: 30 },
        { header: 'Area', key: 'area', width: 30 },
        { header: 'Room', key: 'room', width: 30 },
        { header: 'Update Time', key: 'updatetime', width: 30 },
        { header: 'Cover', key: 'cover', width: 50 },
        { header: 'Detail', key: 'detail', width: 50 },
    ];

    for (let page = 1; page <= totalPages; page++) {
        const items = await fetchData(rid, sid, page);
        await appendDataToWorksheet(items, worksheet);
        console.log(`Data for page ${page} added to the Excel file.`);
    }

    await workbook.xlsx.writeFile('591.xlsx');
    console.log('All data written to Excel file successfully.');
}

// 1:台北 => (3:中山區,5:大安區,7:信義區,8:士林區,10:內湖區,1:中正區,6:萬華區,4:松山區,2:大同區,12:文山區,9:北投區,11:南港區)
// 3:新北 => (26:板橋區,43:三重區,50:淡水區,38:中和區,37:永和區,44:新莊區,34:新店區,27:汐止區,46:林口區,47:蘆洲區,39:土城區,40:三峽區,45:泰山區,42:鶯歌區,41:樹林區,48:五股區,49:八里區,28:深坑區,51:三芝區,30:瑞芳區,21:金山區,20:萬里區,36:烏來區,33:貢寮區,35:坪林區,29:石碇區,31:平溪區,32:雙溪區,52:石門區)
fetchMultiplePagesAndWriteToExcel('1,3', '6,26,38', 30);
