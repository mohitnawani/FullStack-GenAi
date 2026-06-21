const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (cloudinaryUrl) => {
  try {
    const parser = new PDFParse({ url: cloudinaryUrl });

    const result = await parser.getText();

    return {
      text: result.text,
      pageCount: result.pages.length,
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

module.exports = extractTextFromPDF;