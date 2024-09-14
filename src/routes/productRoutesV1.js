const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllerV1");
const authMiddleware = require("../middleware/authMiddleware");

// Importar Cloudinary y Multer para manejar la subida de imágenes
const multer = require("multer");
const { storage } = require("../config/cloudinaryConfig"); 


const upload = multer({ storage });


// Solo los usuarios autenticados pueden crear, actualizar o eliminar productos
router.post("/", authMiddleware, upload.single("image"), productController.createProduct);

module.exports = router;