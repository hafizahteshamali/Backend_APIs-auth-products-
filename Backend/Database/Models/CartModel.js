import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Products", 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    selectedSize:{
        type: String
    },
    selectedColor:{
        type: String
    },
    itemTotal:{
        type: Number,
        required: true
    }
}, {_id: true})

const CartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items:[
        CartItemSchema
    ],
    subTotal: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const CartModel = mongoose.model("Cart", CartSchema);
export default CartModel;