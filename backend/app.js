import express from "express";
import cors from "cors";
import healthcareRoutes from "./routes/healthcareRoutes.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/healthcare", healthcareRoutes);


const HOST = process.env.HOST || "0.0.0.0"; 
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
