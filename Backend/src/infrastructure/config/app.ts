import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import userRouter from "../../presentation/routes/userRoutes";


dotenv.config();
const createServer = () => {
  try {
    const app: express.Application = express();

    const corsOptions = {
      origin: "https://pic-cloud-psi.vercel.app",
      credentials: true,
      methods: "GET,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    };

    // Apply CORS middleware
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(
      session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', userRouter);

    app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to the PicCloud API!');
    });

    
    //error middleware
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal server error!";
      res.status(statusCode).json({
        success: false,
        message: message,
      });
    });
    return app;
  } catch (error) {
    console.log(error);
  }
};

export default createServer;
