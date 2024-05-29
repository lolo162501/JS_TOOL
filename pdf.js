const fs = require('fs');
const pdf = require('pdf-parse');

function readPdfFile(filePath) {
    let dataBuffer = fs.readFileSync(filePath);

    pdf(dataBuffer).then(function(data) {
        console.log(data.info);
        console.log(data.metadata); 
        console.log(data.text);          
    });
}

// 調用函數並指定 PDF 檔案的路徑
readPdfFile('YOUR_PDF_PATH');
