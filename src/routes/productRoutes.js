const express = require("express");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const multer = require("multer");
const config = require("../config/firebase.config");
const productController = require("../controllers/productController");

const router = express.Router();

// Inicializa la aplicación de Firebase
initializeApp(config.firebaseConfig);

// Inicializa Firebase Cloud Storage
const storage = getStorage();

// Configuración de Multer para almacenar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Middleware para manejar la subida de productos
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let downloadURL = null;

    // Subir imagen a Firebase Storage si se proporciona un archivo
    if (req.file) {
      // Crear nombre de archivo único con fecha y hora
      const dateTime = giveCurrentDateTime();
      const fileName = req.file.originalname
        ? `${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`
        : `${Date.now()}_default_filename.png`;
      console.log(fileName);  
      const storageRef = ref(storage, `products/${fileName}`);
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Subir el archivo
      const uploadTask = uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      // Esperar a que la subida se complete y obtener la URL de descarga
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          () => {}, // Progreso, no necesitamos usarlo en este caso
          (error) => reject(error),
          async () => {
            try {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    }

    // Añadir la URL de la imagen al objeto req.file para que esté disponible en el controlador
    req.file = { downloadURL };

    // Llamar al controlador de productos para crear el producto
    await productController.createProduct(req, res);
  } catch (error) {
    res
      .status(400)
      .send({
        message: "Error en la carga del producto",
        error: error.message,
      });
  }
});

// Función para obtener la fecha y hora actual
const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return `${date}_${time}`;
};

module.exports = router;
