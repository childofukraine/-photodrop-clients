import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/router";
import { errorHandler } from "./utils/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/',router)

app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server has been started on http://localhost:${
      process.env.PORT || 5000
    }...`,
  );
});