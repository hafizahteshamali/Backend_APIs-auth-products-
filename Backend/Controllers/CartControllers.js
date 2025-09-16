import CartModel from "../Database/Models/CartModel.js";
import productModel from "../Database/Models/ProductModel.js";

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await CartModel.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cart) {
      return res
        .status(200)
        .send({ success: true, message: "cart is empty", cart: [] });
    }
    return res.status(200).send(200).send({ success: true, cart });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const {productId, quantity} = req.body;
      const product = await productModel.findById(productId);
      if(!product){
        return res.status(404).send({success: false, message: "product not found"});
      }
      let cart = await CartModel.findOne({user: userId});
      if(!cart){
        cart = new CartModel({
            user: userId,
            items: [{
                product: productId, 
                quantity,
                price: product.price,
                discountedPrice: product.discountedPrice || product.price,
                itemTotal: (product.discountedPrice || product.price) * quantity
            }]
        })
      }else{
        const itemIndex = cart.items.findIndex((item)=>item.product.toString() === productId);
        if(itemIndex > -1){
            cart.items[itemIndex].quantity += quantity;
        }else{
            cart.items.push({product: productId, 
                quantity, 
                price: product.price, 
                discountedPrice: product.discountedPrice || product.price, 
                itemTotal: (product.discountedPrice || product.price) * quantity
            })
        }
      }
      await cart.save();
      return res.status(200).send({success: true, message: "product add in cart successfully", cart})
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  };  

const updateCartItem = async (req, res) => {
  try {
    console.log("updateCartItem");
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    console.log("removeCartItem");
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    console.log("clearCart");
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
