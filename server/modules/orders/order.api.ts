import * as express from "express";
import { OrderService } from "./order.service";
const router = express.Router();

let orderService: OrderService = new OrderService();

router.get("/", async (req, res) => {
  const orders = await orderService.findAllOrder();
  res.json(orders);
});

router.get("/:orderId", async (req, res) => {
  const order = await orderService.findOrderById(req.params.orderId);
  res.json(order);
});

router.post("/", async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.json({ _id: order.id });
});

router.put("/:orderId", async (req, res) => {
  const result = await orderService.updateOrder(req.params.orderId, req.body);
  res.json(result);
});

router.delete("/:orderId", async (req, res) => {
  const result = await orderService.deleteOrder(req.params.orderId);
  res.json(result);
});

module.exports = router;
