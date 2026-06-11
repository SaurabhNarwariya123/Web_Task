const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/svg+xml", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only SVG, PNG, or JPG files are allowed"), false);
  }
  cb(null, true);
};

// Store in memory, then stream to cloudinary in controller
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "napworks/products", allowed_formats: ["jpg", "jpeg", "png", "svg"] },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

module.exports = { upload, uploadToCloudinary };
