import express, { json, urlencoded } from "express";
import { json as _json, urlencoded as _urlencoded } from "body-parser";
import cors from "cors";
import healthcareRoutes from "./routes/healthcareRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded requests
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(_json());
app.use(_urlencoded({ extended: true }));

// Register Routes
app.use("/api/healthcare", healthcareRoutes);

// Start the server
app.listen(PORT, "192.168.1.7", () => {
  console.log(`Server running on http://192.168.1.7:${PORT}`);
});
