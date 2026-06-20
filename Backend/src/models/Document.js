const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["pdf", "video"],
      default: "pdf",
    },
    duration: {
      type: Number,   // only for video, in seconds
      default: null,
    },
    thumbnailUrl: {
      type: String,   // only for video
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "processed", "failed"],
      default: "pending",
    },
    pageCount: {
      type: Number,   // only for pdf
      default: null,
    },
    vectorNamespace:{
      type:String,
      default:null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);