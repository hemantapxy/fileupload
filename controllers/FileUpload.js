const File = require('../models/File');
const cloudinary = require('cloudinary').v2;

//localfileupload  -> handler function
exports.localFileUpload = async (req, res) => {
  try {
    // Check if files are present in the request
    if (!req.files || !req.files.fileUpload) {
      console.log("No file found in the request");
      console.log("Request headers:", req.headers);
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Fetch file from request
    const file = req.files.fileUpload;
    console.log("File received:", file);

    let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.').pop()}`;
    console.log("File path:", path);

    // Move file to path
    file.mv(path, (err) => {
      if (err) {
        console.log("Error moving file:", err);
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: err.message
        });
      }
    });

    res.json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message
    });
  }
};

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  console.log("Uploading file to Cloudinary...");
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;
    console.log("Request body:", name, tags, email);

    // Check if files are present in the request
    if (!req.files) {
      console.log("No files found in the request");
      console.log("Request headers:", req.headers);
      console.log("Request body:", req.body);
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Check if imageUpload is present in the files
    const file = req.files.imageUpload;
    if (!file) {
      console.log("No imageUpload found in the request files");
      console.log("Request files:", req.files);
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    console.log("File received:", file);

    // Validate file type
    const supportedTypes = ['png', 'jpeg', 'jpg'];
    const fileType = file.name.split('.').pop().toLowerCase();
    console.log("File type:", fileType);

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported"
      });
    }

    // File type is supported
    const response = await uploadFileToCloudinary(file, 'imageUpload');
    console.log("Cloudinary response:", response);

    // Save file to database
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url, // Corrected field name
      public_id: response.public_id
    });

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: fileData
    });

  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message
    });
  }
};