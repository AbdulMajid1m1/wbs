import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();
const corsOptions = {
  exposedHeaders: ['Content-Length', 'Authorization'],
  origin: [
    'http://localhost:3000',
    'http://localhost:3006',
    'http://gs1ksa.org:3006',
    "http://10.10.12.153:3006",
    "http://192.168.100.9:3006"
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
const uploadFolder = path.join(process.cwd(), "uploads"); // get the absolute path to the uploads folder
app.use("/uploads", express.static(uploadFolder));
import WBSDB from "./router/router.js";
import { pool1ConnectPromise, pool2ConnectPromise } from "./config/connection.js";
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use("/api", WBSDB);
const PORT = process.env.PORT || 3005;

// Retry connecting to the database
const connectWithRetry = async (retries = 5, interval = 5000) => {
  try {
    await Promise.all([pool1ConnectPromise, pool2ConnectPromise]);
    const server = app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
    });
    server.timeout = 980000;
  } catch (error) {
    if (retries === 0) {
      console.error('Could not connect to database after several retries:', error);
      return; // or you could choose to exit the process here
    }

    console.error(`Database connection failed, retrying in ${interval}ms...`, error);
    setTimeout(() => connectWithRetry(retries - 1, interval), interval);
  }
};

connectWithRetry();
