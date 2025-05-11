import express from 'express';
import Restaurant from '../models/restaurant.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// GET all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurantList = await Restaurant.find().populate('foods');
    if (!restaurantList || restaurantList.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }
    res.status(200).send(restaurantList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create restaurant
router.post('/', async (req, res) => {
  const { name, foodType, pincode, lat, lng, address, phone, rate, images, foods } = req.body;

  try {
    const restaurant = new Restaurant({
      name,
      foodType,
      pincode,
      lat,
      lng,
      address,
      phone,
      rating: { rate },
      images,
      foods
    });

    const savedRestaurant = await restaurant.save();

    if (!savedRestaurant) {
      return res.status(500).json({ message: "New restaurant cannot be posted" });
    }

    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server Error" });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('foods');
    if (!restaurant) {
      return res.status(404).send("No restaurant with this ID");
    }
    res.status(200).send(restaurant);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST upload images
router.post('/upload-images/:id', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded!' });
    }

    const imagePaths = req.files.map(file => file.path);

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    restaurant.images.push(...imagePaths);
    await restaurant.save();

    res.status(200).json({ message: 'Images uploaded successfully', images: imagePaths });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
