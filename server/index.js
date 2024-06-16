import express from 'express';
import router from './routes.js';
import 'dotenv/config';
import { connectToMongoDB } from './database.js'; 
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json())
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dist/index.html"))
})
app.use("/api", router);

const port = process.env.PORT || 4000;

async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`server is listening on http://localhost:${port}`);
    })
}

startServer();



