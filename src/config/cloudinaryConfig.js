const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configurar Cloudinary con credenciales desde variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento de Cloudinary para Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      return 'products'; // Carpeta en la que se almacenarán las imágenes
    },
    format: async (req, file) => 'png', // Formato de la imagen (se puede cambiar)
    public_id: (req, file) => file.originalname, // El nombre del archivo en Cloudinary
  },
});


module.exports = { cloudinary, storage };