const bcrypt = require('bcrypt');
const User = require('../models/UserModel'); 
const jwt = require('jsonwebtoken');

// Secret para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { name, last_name, nick, bio, email, password, role } = req.body;

    // Validación básica de campos requeridos
    if (!name || !last_name || !nick || !bio || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const user = new User({
      name,
      last_name,
      nick,
      bio,
      email,
      password: hashedPassword,
      role
    });

    // Guardar el usuario en la base de datos
    await user.save();

    // Generar un token JWT para el usuario (opcional)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Enviar respuesta al cliente
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: user._id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Función para iniciar sesión (opcional)
exports.login = async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const { email, password } = req.body;

    // Validación básica de campos requeridos
    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
    }

    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT para el usuario
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Enviar respuesta al cliente
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};
