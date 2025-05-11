import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['waiting', 'received', 'on_the_way', 'arrived', 'cancelled'],
    default: 'waiting',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paidThrough: {
    // COD, CARD, Net Banking, Google Pay
    type: String,
    enum: ['COD', 'CARD', 'NET_BANKING', 'GOOGLE_PAY'],
    default: 'COD',
  },
  paymentResponse: {
    // Bank or PG response with Transaction number Log for refund or enquiry
    type: String,
  }
}, {
  timestamps: true
});

// Virtual ID for easier frontend usage
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
