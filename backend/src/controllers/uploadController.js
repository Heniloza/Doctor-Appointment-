import cloudinary from "../utils/cloudinary.js";

export const uploadFileController = async (req, res) => {
  try {
    const { file, folder } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: folder || "appointments/reports",
      resource_type: "auto",
    });

    res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};

export const uploadMultipleFilesController = async (req, res) => {
  try {
    const { files, folder } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.data, {
        folder: folder || "appointments/reports",
        resource_type: "auto",
      }),
    );

    const results = await Promise.all(uploadPromises);

    const uploadedFiles = results.map((result, index) => ({
      fileName: files[index].name,
      fileUrl: result.secure_url,
      fileType: files[index].type,
      public_id: result.public_id,
    }));

    res.status(200).json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    res.status(500).json({
      success: false,
      message: "Files upload failed",
      error: error.message,
    });
  }
};
