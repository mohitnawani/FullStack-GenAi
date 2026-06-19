const cloudinary = require("cloudinary").v2;
const Document = require("../models/Document");

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
    const resourceType = type === "video" ? "video" :"image";

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
const getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.result._id }).sort({
      createdAt: -1,
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// DELETE /api/documents/:id
// const deleteDocument = async (req, res) => {
//   try {
//     const doc = await Document.findOne({
//       _id: req.params.id,
//       userId: req.result._id
//     });

//     if (!doc) return res.status(404).json({ message: 'Document not found' });

//     await cloudinary.uploader.destroy(doc.cloudinaryPublicId, {
//       resource_type: doc.resourceType === 'video' ? 'video' : 'raw'
//     });

//     await doc.deleteOne();
//     res.json({ message: 'Document deleted successfully' });

//   } catch (error) {
//     res.status(500).json({ message: 'Delete failed', error: error.message });
//   }
// };

module.exports = {
  generateUploadSignature,
  saveDocumentMetadata,
  getMyDocuments,
};
