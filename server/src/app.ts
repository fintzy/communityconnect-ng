import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes";

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(morgan("dev"));

app.use("/api", routes);

app.get("/", (_, res) => {
  res.json({
    application: "CommunityConnect NG API",
    version: "2.0.0",
    status: "Running",
  });
});

export default app;