// Importar el modelo de Product (Producto)
const Product = require("../models/ProductModel");

// Función para obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    // Obtener todos los productos de la base de datos y poblar la categoría asociada
    const products = await Product.find().populate("category");

    // Responder con un estado 200 (Éxito) y los productos obtenidos
    res.status(200).json(products);
  } catch (error) {
    // Manejar errores al obtener los productos y responder con un estado 500
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

// Función para obtener un producto por su ID
exports.getProductById = async (req, res) => {
  try {
    // Buscar el producto por su ID y poblar la categoría asociada
    const product = await Product.findById(req.params.id).populate("category");

    // Si no se encuentra el producto, responder con un estado 404 (No encontrado)
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Responder con un estado 200 (Éxito) y el producto encontrado
    res.status(200).json(product);
  } catch (error) {
    // Manejar errores al obtener el producto y responder con un estado 500
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

// Función para crear un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { name, description, price, category, stock } = req.body;

    // Inicializar la variable de la URL de la imagen
    let imageUrl = null;

    // Verificar si el archivo fue cargado correctamente
    if (req.file) {
      // Guardar la ruta local de la imagen
      imageUrl = req.file.path; 
    }

    // Crear un nuevo producto con los datos recibidos
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: imageUrl // Asignar la ruta de la imagen subida
    });

    // Guardar el producto en la base de datos
    await product.save();

    // Responder con el producto creado y un estado 201 (Creado)
    res.status(201).json({
      message: "Producto creado con éxito",
      product
    });

  } catch (error) {
    // Manejar errores y responder con un estado 500
    console.error("Error al crear el producto:", error);
    res.status(500).json({
      message: "Error al crear el producto",
      error
    });
  }}
// Función para actualizar un producto por su ID
exports.updateProduct = async (req, res) => {
  try {
    // Actualizar el producto basado en el ID proporcionado y los datos en el cuerpo de la solicitud
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Si no se encuentra el producto, responder con un estado 404 (No encontrado)
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Responder con un estado 200 (Éxito) y el producto actualizado
    res.status(200).json(product);
  } catch (error) {
    // Manejar errores al actualizar el producto y responder con un estado 500
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

// Función para eliminar un producto por su ID
exports.deleteProduct = async (req, res) => {
  try {
    // Buscar y eliminar el producto por su ID
    await Product.findByIdAndDelete(req.params.id);

    // Responder con un estado 200 (Éxito) y un mensaje de eliminación exitosa
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    // Manejar errores al eliminar el producto y responder con un estado 500
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
};
