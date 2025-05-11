import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      
      readyTime: {
        type: Number,
      },
      rating: {
        rate: Number,
      },
      price: {
        type: Number,
        required: true,
      },
      images: {
        type: [String],
      }
      
    });
    itemSchema.virtual('id').get(function () {
      return this._id.toHexString();
  });
  itemSchema.set('toJSON', {
      virtuals: true,
  });
    const Food = mongoose.model('Food',itemSchema);
    
    export default Food;
    
