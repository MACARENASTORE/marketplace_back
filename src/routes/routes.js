const express = require('express');
const router = express.Router();


// Importar los controladores de rutas
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const reviewRoutes = require('./reviewRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes1 = require('./productRoutesV1');


// Importar el middleware de autenticación (si es necesario para algunas rutas)
const authMiddleware = require('../middleware/authMiddleware');

// Definir las rutas para la API
router.use('/auth', authRoutes);              // Rutas de autenticación
router.use('/products', productRoutes);       // Rutas para productos
router.use('/category', categoryRoutes); 
router.use('/orders', authMiddleware, orderRoutes);  // Rutas de órdenes, protegidas con autenticación
router.use('/reviews', reviewRoutes);         // Rutas para reviews o comentarios de productos

router.use('/products1', productRoutes1); 
// Exportar el router principal
module.exports = router;
