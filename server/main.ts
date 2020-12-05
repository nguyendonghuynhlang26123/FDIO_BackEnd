import * as express from "express";
import * as bodyParser from "body-parser";
import * as userApi from "./modules/users/user.api";

async function initServer() {
  const app = express();
  const port = process.env.PORT || 8002;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/user", userApi);

  app.get("/", (req, res) => {
    res.send("Hello World! Welcome to Team 3!!!");
  });

  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
}

initServer();
