import express from 'express';
import Category from '../models/category.js';
import { upload } from '../middleware/multer.js'; // Assumes multer is configured correctly

const router = express.Router();

// ✅ Get all categories
router.get('/', async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      return res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Get a category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category with this ID is not present");
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ✅ Create a category with file upload (form-data)
router.post('/', upload.single('icon'), async (req, res) => {
  try {
    const { name, color } = req.body;
    const icon = req.file?.path || '';

    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }

    const category = new Category({ name, icon, color });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).send("Error saving category: " + error.message);
  }
});

// ✅ Update category
router.put('/:id', async (req, res) => {
  const { name, icon, restaurant ,color } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, color , restaurant},
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).send("Category not found");
    }
    res.send(updatedCategory);
  } catch (error) {
    res.status(500).send("Update error: " + error.message);
  }
});

// ✅ Delete category
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Separate endpoint for uploading/replacing icon only
router.post('/upload-icon/:id', upload.single('icon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No icon uploaded!' });
    }

    const iconPath = req.file.path;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    category.icon = iconPath;
    await category.save();

    res.status(200).json({ message: 'Icon uploaded successfully', icon: iconPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
