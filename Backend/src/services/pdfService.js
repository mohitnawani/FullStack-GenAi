const axios = require("axios");
const  pdfParse  = require("pdf-parse");

const extractTextFromPDF = async (cloudinaryUrl) => {
  try {
    // Step 1: Download PDF from Cloudinary as buffer
    const response = await axios.get(cloudinaryUrl, {
      responseType: "arraybuffer",
    });

    const pdfBuffer = Buffer.from(response.data);

    // Step 2: Extract text from buffer
    const pdfData = await pdfParse(pdfBuffer);

    return {
      text: pdfData.text,           // full extracted text
      pageCount: pdfData.numpages,  // number of pages
      info: pdfData.info,           // metadata (title, author etc)
    };

  } catch (error) {
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
};

export default extractTextFromPDF;