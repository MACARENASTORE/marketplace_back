const express = require('express');
const router = express.Router();

// Importar los controladores de rutas
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const reviewRoutes = require('./reviewRoutes');

// Importar el middleware de autenticación (si es necesario para algunas rutas)
const authMiddleware = require('../middleware/authMiddleware');

// Definir las rutas para la API
router.use('/auth', authRoutes);              // Rutas de autenticación
router.use('/users', authMiddleware, userRoutes);  // Rutas de usuarios, protegidas con autenticación
router.use('/products', productRoutes);       // Rutas para productos
router.use('/orders', authMiddleware, orderRoutes);  // Rutas de órdenes, protegidas con autenticación
router.use('/reviews', reviewRoutes);         // Rutas para reviews o comentarios de productos

// Exportar el router principal
module.exports = router;
