const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// Importar Multer para manejar la subida de imágenes
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento local con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Definir la carpeta donde se guardarán las imágenes
    cb(null, './public/products');
  },
  filename: (req, file, cb) => {
    // Definir el nombre del archivo para evitar conflictos (puedes usar un identificador único)
    cb(null, Date.now() + path.extname(file.originalname)); // Fecha y extensión del archivo original
  }
});

// Filtro para asegurarse de que el archivo subido es una imagen
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'));
  }
};

// Configuración de Multer con límite de tamaño y filtro de tipo de archivo
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limitar a 5MB
  fileFilter: fileFilter
});

// Definir las rutas para productos
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Solo los usuarios autenticados pueden crear, actualizar o eliminar productos
router.post("/", authMiddleware, upload.single("image"), productController.createProduct);
router.put("/:id", authMiddleware, upload.single("image"), productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;