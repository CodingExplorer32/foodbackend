import express from 'express'; // Importing express
import Food  from '../models/food.js'; // Importing the Restaurant model
import { upload } from '../middleware/multer.js'; // Importing the upload middleware

const router = express.Router();
// 🟢 GET all food items
router.get('/', async (req, res) => {
  try {
    const foodList = await Food.find().populate('category'); // Optional: populate category
    if (!foodList || foodList.length === 0) {
      return res.status(404).json({ message: "No food items found" });
    }
    res.status(200).send(foodList);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const foodItem = await Food.findById(req.params.id).populate('category');
    if (!foodItem) {
      return res.status(404).send("Food item with this ID not found");
    }
    res.status(200).send(foodItem);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  const { name, description, category, readyTime, rating, price, images } = req.body; // ❗️Fix: req.body not req.body()

  try {
    const newFood = new Food({ name, description, category, readyTime, rating, price, images });
    const savedFood = await newFood.save();
    res.status(201).send(savedFood);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});



router.put('/:id', async (req, res) => {
  const {name} = req.body;
  const {  description, category, readyTime, rating,restaurant, price, images } = req.body;
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { name, description,restaurant, category, readyTime, rating, price, images },
      { new: true }
    );
    if (!updatedFood) {
      return res.status(404).send("Food not found");
    }
    res.send(updatedFood);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 🟢 DELETE: Remove a food item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndRemove(req.params.id);
    if (!deletedFood) {
      return res.status(404).send("Food item not found");
    }
    res.status(200).send("Food item deleted successfully");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

; // Import multer config
// Food model


// Route to upload multiple images for a food item
router.post('/upload-images/:id', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded!' });
    }

    // Get the uploaded file paths
    const imagePaths = req.files.map(file => file.path);

    // Find the food item by id and update its images field
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // Update food with new image paths
    food.images.push(...imagePaths);
    await food.save();

    res.status(200).json({ message: 'Images uploaded successfully', images: imagePaths });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;



