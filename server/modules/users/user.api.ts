import * as express from "express";
import { AuthService } from "../auth/auth.service";
import { UserService } from "./user.service";
const router = express.Router();

const userService: UserService = new UserService();
const authService: AuthService = new AuthService();

router.get("/", authService.restrict, async (req, res) => {
  const users = await userService.findAllUser();
  res.json(users);
});

router.get("/:userId", authService.restrict, async (req, res) => {
  const user = await userService.findUserById(req.params.userId);
  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json({ _id: user.id });
});

router.put("/:userId", authService.restrict, async (req, res) => {
  const result = await userService.updateUser(req.params.userId, req.body);
  res.json(result);
});

router.put("/change-password", authService.restrict, async (req, res) => {
  const result = await userService.changePasswordUser(
    req.session.userId,
    req.body.newPassword
  );
  res.json(result);
});

router.delete("/:userId", authService.restrict, async (req, res) => {
  const result = await userService.deleteUser(req.params.userId);
  res.json(result);
});

module.exports = router;
