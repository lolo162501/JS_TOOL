const Tesseract = require('tesseract.js');
const imagePath = 'YOUR_IMAGE_PATH';

async function performOCR(imagePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imagePath,
            'eng+chi_tra', // 指定英文和繁体中文模型
            { logger: m => console.log(m) } //顯示處理進度
        );
        return text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
}

async function main() {
    try {
        console.log("OCR :",  await performOCR(imagePath));
    } catch (error) {
        console.error("Error in processing:", error);
    }
}

main();
