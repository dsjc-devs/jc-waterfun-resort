/*  ========== Importing Constants ========== */
import { colours } from './constants/constants.js';

/*  ========== Importing Middleware ========== */
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

/*  ========== Importing External Libraries ========== */
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

/*  ========== Importing Configuration ========== */
import connectDB from './config/db.js';

/*  ========== Importing Routes ========== */
import usersRoutes from './routes/userRoutes.js';
import testimonialsRoutes from './routes/testimonialsRoutes.js';
import marketingMaterialsRoutes from './routes/marketingMaterialsRoutes.js';
import contactUsRoutes from './routes/contactUsRoutes.js';
import resortDetailsRoutes from './routes/resortDetailsRoutes.js';
import accommodationTypeRoutes from './routes/accommodationTypeRoutes.js';
import accommodationRoutes from './routes/accommodationRoutes.js';
import faqsRoutes from './routes/faqsRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import amenitiesTypeRoutes from './routes/amenitiesTypeRoutes.js';
import amenitiesRoutes from './routes/amenitiesRoutes.js';
import resortRatesRoutes from './routes/resortRatesRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import blockedDateRoutes from './routes/blockedDateRoutes.js';

/*  ========== CRON ========== */
import { startReservationCron } from './cron/reservationCron.js';

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

/*  ========== CORS - Setup ========== */
app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

/*  ========== Swagger - Setup ========== */
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'schemas.yml'));
app.use(`/api/${API_VERSION}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*  ========== API - Routes ========== */
app.use(`/api/${API_VERSION}/users`, usersRoutes);
app.use(`/api/${API_VERSION}/testimonials`, testimonialsRoutes);
app.use(`/api/${API_VERSION}/marketing-material`, marketingMaterialsRoutes);
app.use(`/api/${API_VERSION}/contact`, contactUsRoutes);
app.use(`/api/${API_VERSION}/resort-details`, resortDetailsRoutes);
app.use(`/api/${API_VERSION}/accommodation-type`, accommodationTypeRoutes);
app.use(`/api/${API_VERSION}/accommodations`, accommodationRoutes);
app.use(`/api/${API_VERSION}/faqs`, faqsRoutes);
app.use(`/api/${API_VERSION}/gallery`, galleryRoutes);
app.use(`/api/${API_VERSION}/resort-rates`, resortRatesRoutes);
app.use(`/api/${API_VERSION}/amenities-type`, amenitiesTypeRoutes);
app.use(`/api/${API_VERSION}/amenities`, amenitiesRoutes);
app.use(`/api/${API_VERSION}/reservations`, reservationRoutes);
app.use(`/api/${API_VERSION}/blocked-dates`, blockedDateRoutes);

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
    await connectDB();

    app.listen(PORT, () =>
      console.log(
        colours.fg.yellow,
        `${PROJECT_NAME} API is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
        colours.reset
      )
    );

    startReservationCron();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Invoke Start Application Function
startServer();