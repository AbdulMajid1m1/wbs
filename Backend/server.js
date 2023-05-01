import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { client } from "./cacheManager.js";
import path from "path"
const app = express();
const corsOptions = {
  exposedHeaders: ['Content-Length', 'Authorization'],
  origin: [
    'http://localhost:3000',
    'http://localhost:3006',
    'http://gs1ksa.org:3006',
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
const uploadFolder = path.join(process.cwd(), "uploads"); // get the absolute path to the uploads folder
app.use("/uploads", express.static(uploadFolder));
import WBSDB from "./router/router.js";
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", WBSDB);
const PORT = process.env.PORT || 3005;

const server = app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
app.get("/ping", async (req, res) => {
  try {
    console.log("Setting key...");
    await client.set("myKey", "myValue");
    console.log("Getting value...");
    const value = await client.get("myKey");
    console.log(`Value for key "myKey":`, value);

    res.send("working");
  } catch (error) {
    console.log("Error in /ping route:", error);
    res.status(500).send("Internal server error");
  }
});

// Set the timeout to 2 minutes (120000 milliseconds) 

server.timeout = 120000;
