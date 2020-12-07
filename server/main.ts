import * as express from "express";
import * as bodyParser from "body-parser";
import * as userApi from "./modules/users/user.api";
import * as promotionApi from "./modules/promotions/promotion.api";
import * as orderApi from "./modules/orders/order.api";
import * as foodListApi from "./modules/foodLists/foodList.api";
import * as foodApi from "./modules/foods/food.api";
import * as swaggerUi from "swagger-ui-express";

async function initServer() {
  const app = express();
  const port = process.env.PORT || 8002;

  const swaggerDocument = require("../swagger.json");

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(express.static(__dirname + "/../public"));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/user", userApi);
  app.use("/promotion", promotionApi);
  app.use("/order", orderApi);
  app.use("/food-list", foodListApi);
  app.use("/food", foodApi);

  app.set("view engine", "ejs");
  app.set("views", "./views");

  app.get("/", (req, res) => {
    res.render("pages/loginPage", {});
  });

  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
}

initServer();
