import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router/router";
import { errorHandler } from "./utils/errorHandler";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "https://photodropclient.vercel.app",
    "http://localhost:3000",
  ],
  methods: ["HEAD", "OPTIONS", "POST", "GET", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Uppy-Versions",
    "Accept",
    "x-requested-with",
    "Access-Control-Allow-Origin",
  ],
  exposedHeaders: [
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
},
));
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