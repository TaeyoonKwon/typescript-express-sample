process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";
import "dotenv/config";
import express from "express";
import config from "config";
import cors from "cors";
import hpp from "hpp";
import morgan from "morgan";
import helmet from "helmet";
import { logger, stream } from "./utils/logger";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || "development";

    this.initializeMiddleware();
  }

  private initializeMiddleware() {
    this.app.use(morgan(config.get("log.format"), { stream }));
    this.app.use(
      cors({
        origin: config.get("cors.origin"),
        credentials: config.get("cors.credentials"),
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}

const app = new App().app;

app.get("/", (req: express.Request, res: express.Response) => {
  try {
    let greeting: string = "Hello World";

    if (Math.random() >= 0.5) {
      // 50% chance to throw an error in this route.
      throw Error("Error here!");
    } else {
      res.send(greeting);
    }
  } catch (e) {
    res.status(500).send("Server Error");
  }
});

app.listen(process.env.PORT || 3000, () =>
  logger.info(`Server running at port ${process.env.PORT}`)
);
