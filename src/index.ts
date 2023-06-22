import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/router";
import { errorHandler } from "./utils/errorHandler";

dotenv.config();

const app = express();

app.use(
  cors({
      origin: '*',
      methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'Access-Control-Allow-Origin'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
  }),
);
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