import * as express from "express";
import { AuthService } from "../auth/auth.service";
import { OrderService } from "./order.service";
const router = express.Router();

const orderService: OrderService = new OrderService();
const authService: AuthService = new AuthService();

router.get("/", async (req, res) => {
  const orders = await orderService.findAllOrder();
  res.json(orders);
});

router.get("/:orderId", authService.restrict, async (req, res) => {
  const order = await orderService.findOrderById(req.params.orderId);
  res.json(order);
});

router.get("/statistic/revenue", async (req, res) => {
  const statistic = await orderService.orderStatistics();
  res.json(statistic);
});

router.post("/", authService.restrict, async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.json({ _id: order.id });
});

router.put("/:orderId", authService.restrict, async (req, res) => {
  const result = await orderService.updateOrder(req.params.orderId, req.body);
  res.json(result);
});

router.delete("/:orderId", authService.restrict, async (req, res) => {
  const result = await orderService.deleteOrder(req.params.orderId);
  res.json(result);
});

module.exports = router;
