import slugify from "slugify";
import productModel from "../Database/Models/ProductModel.js";
import { v2 as cloudinary } from "cloudinary";

const AddProductsController = async (req, res)=>{
    try {
        const { name, description, price, discountedPrice, category, brand, stock, sizes, colors, isFeatured, tags, status } = req.body;
        const files = req.files;

        const imageUrl = await files.images.map((img)=>({
            url: img.path,
            public_id: img.filename
        }))

        let parsedSize = [];
        if(sizes){
            try {
                parsedSize = JSON.parse(sizes)
            } catch (error) {
                parsedSize = [];
            }
        }

        let parsedColor = [];
        if(colors){
            try {
                parsedColor = JSON.parse(colors)
            } catch (error) {
                parsedColor = []
            }
        }

        const products = await productModel.create({
            name,
            slug: slugify(name, {lower: true}),
            description,
            price, 
            discountedPrice,
            category, 
            brand,
            stock,
            images: imageUrl,
            sizes: parsedSize,
            colors: parsedColor,
            isFeatured: isFeatured || false,
            tags: tags ? tags.split(",") : [],
            status: status || "active"
        })

        return res.status(200).send({message: "product add successfully", products})

    } catch (error) {
        return res.status(400).send({message: error.message});   
    }
}

const GetProductsController = async (req, res)=>{
    try {
        const {category, brand, status, isFeatured, page = 1, limit = 10, sortBy = "createdAt", order = "desc"} = req.query;
        const filter = {};

        if(category) filter.category = category;
        if(brand) filter.brand = brand;
        if(status) filter.status = status;
        if(isFeatured) filter.isFeatured = isFeatured === "true";

        const skip = (page - 1) * limit;
        const sortOption = {[sortBy]: order === "desc" ? -1 : 1};
        const products = await productModel.find(filter).populate("category", "name slug").skip(skip).limit(Number(limit)).sort(sortOption);

        const total = await productModel.countDocuments(filter);
        return res.status(200).send({status: true, total, page: Number(page), pages: Math.ceil(total / limit), products})

    } catch (error) {
        return res.status(400).send({message: error.message});   
    }
}

const GetSingleProductController = async (req, res)=>{
    try {
        const {id} = req.params;

        const product = await productModel.findById(id).populate("reviews.user", "name email");

        if(!product){
            return res.status(404).send({success: false, message: "product not found"});
        }

        return res.status(200).send({success: true, message: "product found", product});

    } catch (error) {
        return res.status(400).send({message: error.message});   
    }
}

const DeleteProductsController = async (req, res)=>{
    try {
        const {id} = req.params;
        const product = await productModel.findByIdAndDelete(id);
        if(!product){
            return res.status(404).send({success: false, message: "product not found"});
        }

        if(product.images && product.images.length > 0){
            for(let img of product.images){
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await product.deleteOne();

        return res.status(201).send({success: true, message: "product delete successfully", product})

    } catch (error) {
        return res.status(400).send({message: error.message});   
    }
}

const UpdateProductsController = async (req, res)=>{
    try {
        const { name, description, price, discountedPrice, category, brand, stock, sizes, colors, isFeatured, tags, status } = req.body;
        const {id} = req.params;
        const files = req.files;

        const product = await productModel.findById(id);
        if(!product){
            return res.status(404).send({success: false, message: "product not found"});
        }

        if(product.images && product.images.length){
            for(let img of product.images){
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        const newImages = files.images.map((img)=>({
            url: img.path,
            public_id: img.filename
        }))

        let parsedSize = [];
        if(sizes){
            try {
                parsedSize = JSON.parse(sizes)
            } catch (error) {
                parsedSize = [];
            }
        }

        let parsedColor = [];
        if(colors){
            try {
                parsedColor = JSON.parse(colors)
            } catch (error) {
                parsedColor = [];
            }
        }

        product.name = name || product.name;
        product.slug = slugify(name, {lower: true}) || product.slug;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountedPrice = discountedPrice || product.discountedPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.stock = stock || product.stock;
        product.sizes = parsedSize.length > 0 ?  parsedSize : product.sizes;
        product.colors = parsedColor.length > 0 ? parsedColor : product.colors;
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.tags = tags ? tags.split(",") : product.tags;
        product.status = status || product.status;

        await product.save();
        return res.status(200).send({success: true, message: "product updated successfully", product});

    } catch (error) {
        return res.status(400).send({message: error.message});   
    }
}

const SearchProductController = async (req, res)=>{
    try {
        const {search} = req.query;
        
        const productData = await productModel.find({
            $or:[
                {name: {$regex: `${search}`, $options: 'i'}},
                {description: {$regex: `${search}`, $options: 'i'}},
                {brand: {$regex: `${search}`, $options: 'i'}},
                {category: {$regex: `${search}`, $options: 'i'}},
                {tags: {$regex: `${search}`, $options: 'i'}},
            ]
        });

        if(!productData){
            return res.status(404).send({success: false, message: "product not found"});
        }
        return res.status(200).send({success: true, total: productData.length, productData});

    } catch (error) {
        return res.status(400).send({message: error.message});  
    }
}

export {GetProductsController, GetSingleProductController, AddProductsController, DeleteProductsController, UpdateProductsController, SearchProductController};