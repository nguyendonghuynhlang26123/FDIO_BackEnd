import * as express from "express";
import { UserService } from "./user.service";
const router = express.Router();

let userService: UserService = new UserService();

router.get("/", async (req, res) => {
  const users = await userService.findAllUser();
  res.json(users);
});

router.get("/:userId", async (req, res) => {
  const user = await userService.findUserById(req.params.userId);
  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json({ _id: user.id });
});

router.put("/:userId", async (req, res) => {
  const result = await userService.updateUser(req.params.userId, req.body);
  res.json(result);
});

router.put("/change-password/:userId", async (req, res) => {
  const result = await userService.changePasswordUser(
    req.params.userId,
    req.body.newPassword
  );
  res.json(result);
});

router.delete("/:userId", async (req, res) => {
  const result = await userService.deleteUser(req.params.userId);
  res.json(result);
});

module.exports = router;
