const Order = require("../models/OrderModel");

exports.createOrder = async (req, res) => {
  try {
    const { user, products, totalPrice } = req.body;
    const order = new Order({ user, products, totalPrice });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el pedido", error });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user").populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pedido", error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado del pedido", error });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el pedido", error });
  }
};
