const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// 設定輸入和輸出資料夾的路徑
const inputFolder = './PIC';
const outputFolder = './PIC/out';

// 讀取指定資料夾內的所有檔案
fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('讀取資料夾錯誤:', err);
        return;
    }

    files.forEach(file => {
        // 完整的輸入和輸出檔案路徑
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(outputFolder, file);

        // 使用 sharp 進行圖片壓縮
        sharp(inputPath)
            .resize({ width: 1000 }) // 調整寬度，高度自動調整保持比例
            .jpeg({ quality: 80 }) // 設置JPEG質量
            .toFile(outputPath)
            .then(() => {
                console.log('圖片已壓縮並保存到:', outputPath);
            })
            .catch(err => {
                console.error('壓縮圖片錯誤:', err);
            });
    });
});
