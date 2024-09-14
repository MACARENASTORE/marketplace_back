// Importar el modelo de Product (Producto)
const Product = require("../models/ProductModel");
const { cloudinary } = require('../config/cloudinaryConfig');



// Función para crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { name, description, price, category, stock } = req.body;

    // Subir la imagen a Cloudinary si está presente
    let imageUrl = null;
    console.log(req.body)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      imageUrl = result.secure_url;
      console.log(imageUrl);
    }

    // Crear una nueva instancia de Product con los datos proporcionados
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: imageUrl, // Almacenar la URL de la imagen de Cloudinary
    });

    // Guardar el producto en la base de datos
    await product.save();

    // Responder con un estado 201 (Creado) y el producto creado
    res.status(201).json(product);
  } catch (error) {
    console.log(error)
    // Manejar errores al crear el producto y responder con un estado 500
    res.status(500).json({ message: "Error al crear el producto", error });
  }
};


