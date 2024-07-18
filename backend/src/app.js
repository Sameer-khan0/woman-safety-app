import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// injecting middlewares
app.use(json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// importing routes
import womenRoutes from "./routes/women.routes.js";
import alterRoutes from "./routes/alert.routes.js";
import guardianRoutes from "./routes/guardian.routes.js";

// routes declaration 
app.use("/api/v1/women", womenRoutes);
app.use("/api/v1/alerts", alterRoutes);
app.use("/api/v1/guardians", guardianRoutes);

export { app };