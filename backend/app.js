import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv using ESM syntax
import connectdb from './db/index.js'; // MongoDB connection
import categoryRoute from './routes/categoryRoute.js';
import restaurantRoute from './routes/restaurantRoute.js';
import foodRoute from './routes/foodRoute.js';

dotenv.config(); // Load environment variables

const app = express();

// ✅ Enable CORS with environment-defined origin
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // fallback to '*' for dev
    credentials: true
}));

// ✅ Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Middleware for file uploads (via multer)

// ✅ Serve static files from the "public" folder (e.g., images)
app.use(express.static('public'));
app.use('/uploads', express.static('public'));

// ✅ Use route handlers
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/restaurant', restaurantRoute);
app.use('/api/v1/food', foodRoute);

// ✅ Connect to MongoDB and then start the server
connectdb()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`⚙️ Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err);
  });
