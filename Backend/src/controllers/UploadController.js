const cloudinary = require("cloudinary").v2;
const Document = require("../models/Document");
const {ingestDocument} = require("../services/ragService");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/documents/upload-signature?type=pdf  or  ?type=video
const generateUploadSignature = async (req, res) => {
  try {
    const userId = req.result._id;
    const type = req.query.type || "pdf"; // "pdf" or "video"

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `edumind/${type}s/${userId}_${timestamp}`;

    const uploadParams = {
      timestamp,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET,
    );

    // resource_type: raw for pdf, video for video
    const resourceType = type === "video" ? "video" : "image";

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      resource_type: resourceType,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ error: "Failed to generate upload credentials" });
  }
};

// POST /api/documents/save  — save metadata after frontend uploads to cloudinary
const saveDocumentMetadata = async (req, res) => {
  try {
    const { cloudinaryPublicId, secureUrl, filename, resourceType, duration } =
      req.body;
    const userId = req.result._id;

    // verify file actually exists on cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: resourceType === "video" ? "video" : "image" },
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: "File not found on Cloudinary" });
    }

    // check duplicate
    const existing = await Document.findOne({ cloudinaryPublicId, userId });
    if (existing) {
      return res.status(409).json({ error: "Document already exists" });
    }

    // thumbnail only for video
    let thumbnailUrl = null;
    if (resourceType === "video") {
      thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
        resource_type: "image",
        transformation: [
          { width: 400, height: 225, crop: "fill" },
          { quality: "auto" },
          { start_offset: "auto" },
        ],
        format: "jpg",
      });
    }

    const doc = await Document.create({
      userId,
      filename: filename || cloudinaryPublicId,
      cloudinaryUrl: secureUrl,
      cloudinaryPublicId,
      resourceType, // "pdf" or "video"
      duration: cloudinaryResource.duration || duration || null,
      thumbnailUrl,
      status: "pending",
    });

    res.status(201).json({
      message: "Document saved successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Error saving metadata:", error);
    res.status(500).json({ error: "Failed to save document metadata" });
  }
};

// GET /api/documents
const DocumentIngest = async (req, res) => {
  try {
    const { cloudinaryUrl } = req.body;
    console.log("url", cloudinaryUrl);

    const doc = await Document.findOne({
      userId: req.result._id,
      cloudinaryUrl,
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const documentId = doc._id;
    console.log("documentId", documentId);

    const output = await ingestDocument(documentId, cloudinaryUrl, doc.resourceType);
    console.log("ingest output", output);
    

    res.status(200).json(output);
  } catch (error) {
    console.error("Document ingest failed:", error);
    res.status(500).json({ message: "Failed to fetch documents", error: error.message });
  }
};

const getMyDocuments = async (req, res) => {
  {
    try{
      const userId = req.result._id;
      const documents = await Document.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ documents });
    }

    catch(error){
      console.error("Error fetching documents:", error)
      res.status(500).json({ message: "Failed to fetch documents", error: error.message });
    }
  }
};

const deleteDocument = async (req , res)=>{
  try{
    const {id}= req.params;
    console.log("Deleting document with ID:", id);
    const doc = await Document.findOneAndDelete({_id:id, userId:req.result._id});

    if(!doc)
    {
      return res.status(404).json ({message:"Document not found"})
    }
    res.status(200).json({ message: "Document deleted successfully" }); 
  }

  catch(error)
  {
    console.error("Error deleting document:", error)
    res.status(500).json({ message: "Failed to delete document", error: error.message });
  }
};

const getDocumentStatus = async (req, res) => {
  try {
    const id = req.params.documentId;

    if (!id) {
      return res.status(400).json({ message: "Document ID is required" });
    }

    const document = await Document.findOne({
      _id: id,
      userId: req.result._id,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json({
      status: document.status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  generateUploadSignature,
  saveDocumentMetadata,
  DocumentIngest,
  getMyDocuments,
  deleteDocument,
  getDocumentStatus,
};
