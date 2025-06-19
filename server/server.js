/*  ========== Importing Constants ========== */
import { colours } from './constants/constants.js';

/*  ========== Importing Middleware ========== */
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

/*  ========== Importing External Libraries ========== */
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

/*  ========== Importing Configuration ========== */
import connectDB from './config/db.js';

const app = express();
const __dirname = path.resolve();
dotenv.config();

connectDB();

const API_VERSION = process.env.API_VERSION
const PORT = process.env.PORT || 5000;
const PROJECT_NAME = process.env.PROJECT_NAME;

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

/*  ========== API - Routes ========== */
// app.use(`/api/${API_VERSION}/users`, usersRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get(`/api/${API_VERSION}`, (req, res) => {
    res.send(`${PROJECT_NAME} API is running...`);
  });
}

/** Middleware */
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    app.listen(PORT, console.log(colours.fg.yellow, `${PROJECT_NAME} API is running in ${process.env.NODE_ENV} mode on port ${PORT}`, colours.reset));
  } catch (error) {
    console.log(error);
  }
};

// Invoke Start Application Function
startServer();