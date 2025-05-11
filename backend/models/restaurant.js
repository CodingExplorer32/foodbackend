import mongoose from "mongoose";
const Schema = mongoose.Schema; // ✅ This is the fix

const restaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
    },
    pincode: {
        type: String,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    rating: {
        rate: Number,
    },
    images: {
        type: [String],
    },
    foods: [
        {
            type: Schema.Types.ObjectId,
            ref: "Food",
        },
    ],
    
});
restaurantSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
restaurantSchema.set('toJSON', {
    virtuals: true,
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
