const Product = require('../models/ProductModel');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const multer = require("multer");
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

// Initialize Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

exports.createProduct = async (req, res) => {
    try {
        // Extract product data
        const { name, description, price, category, stock } = req.body;

        // Check if the file is present in the request
        let imageUrl = null;
        if (req.file) {
            console.log(req.file);
            const fileName = `${Date.now()}_${req.file.originalname}`; // Ensure originalname is not undefined
            const fileRef = ref(storage, `products/${fileName}`);

            // Upload file
            const uploadTask = uploadBytesResumable(fileRef, req.file.buffer, {
                contentType: req.file.mimetype
            });

            // Get download URL once the upload is complete
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    () => {}, // You can handle progress here if necessary
                    (error) => {
                        reject(error);
                    },
                    async () => {
                        try {
                            // Retrieve the download URL after the file is uploaded
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });
        }

        // Create a new Product instance
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            image: imageUrl, // Save the download URL to the database
        });

        // Save the product to the database
        await product.save();

        // Respond with the created product
        res.status(201).json(product);
    } catch (error) {
        console.log("Error creating product:", error);
        res.status(500).json({ message: "Error creating product", error });
    }
};
