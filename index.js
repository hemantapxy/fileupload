require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Database connect
const db = require('./config/database');
db.connect();

// Cloudinary connect    
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

// API routes
const Upload = require('./routes/FileUpload');
app.use('/api/v1/upload', Upload);

// Endpoint to list files in the local storage
app.get('/api/v1/files', (req, res) => {
    const directoryPath = path.join(__dirname, 'files');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to scan files",
                error: err.message
            });
        }
        res.json({
            success: true,
            files: files
        });
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
        error: err.message
    });
});

// Activate server
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});