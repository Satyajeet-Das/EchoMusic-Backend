import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import authRoutes from "./routes/authRoutes"
import songRoutes from "./routes/songRoutes"


const app = express();

mongoose.connect(process.env.CONNECTION as string)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Database Connection Error', err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/api/test", (req: Request, res: Response) => {
    res.json({message: "Hello from Express"})
});

app.use("/api/users", authRoutes);
app.use("/api/songs", songRoutes);

app.listen(7000, () => {
    console.log("Server Running at localhost:7000")
});

