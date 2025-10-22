// controllers/inventoryController.js
const Product = require('../models/Product');

// Get all products for a user
exports.getAllProducts = async (req, res) => {
  try {
    const { category, lowStock, page = 1, limit = 10 } = req.query;
    let filter = { user: req.user.id };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (lowStock === 'true') {
      filter.$expr = { $lte: ["$stock", "$min_stock"] };
    }
    
    const products = await Product.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, cost, stock, min_stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    const product = new Product({
      user: req.user.id,
      name,
      category: category || '',
      price,
      cost: cost || 0,
      stock: stock || 0,
      min_stock: min_stock || 10
    });
    console.log(product)
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, cost, stock, min_stock } = req.body;
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, category, price, cost, stock, min_stock },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product stock
exports.updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined) {
      return res.status(400).json({ message: 'Stock value is required' });
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { stock },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory statistics
/* exports.getInventoryStats = async (req, res) => {
  try {
    console.log("hello")
    const stats = await Product.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalInventoryValue: { 
            $sum: { $multiply: ["$price", "$stock"] } 
          },
          lowStockItems: {
            $sum: { $cond: [{ $lte: ["$stock", "$min_stock"] }, 1, 0] }
          },
          outOfStockItems: {
            $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] }
          },
          byCategory: { $push: { category: "$category", value: { $multiply: ["$price", "$stock"] } } }
        }
      },
      {
        $unwind: "$byCategory"
      },
      {
        $group: {
          _id: "$byCategory.category",
          total: { $sum: "$byCategory.value" },
          count: { $sum: 1 }
        }
      },
    
      {
        $group: {
          _id: null,
          totalProducts: { $first: "$totalProducts" },
          totalInventoryValue: { $first: "$totalInventoryValue" },
          lowStockItems: { $first: "$lowStockItems" },
          outOfStockItems: { $first: "$outOfStockItems" },
          
          byCategory: { 
            $push: { 
              category: "$_id", 
              total: "$total",
              count: "$count"
            } 
          }
        }
      }
    ]);
    
    res.json(stats[0] || {
      totalProducts: 0,
      totalInventoryValue: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      byCategory: []
    });
      console.log("hello2")
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
// Get product categories
exports.getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { user: req.user.id });
    res.json(categories.filter(cat => cat !== ''));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
   
    
    // Check 1: Saare products dekhte hain
    const allProducts = await Product.find({});
    
    // Check 2: User ke products
    const userProducts = await Product.find({ user: req.user.id });
    
    // Check 3: User ID ko ObjectId mein convert karke try karein
    const mongoose = require('mongoose');
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const userProductsWithObjectId = await Product.find({ user: userObjectId });
    
    // Check 4: Kya koi bhi product mein user field hai?
   /* if (allProducts.length > 0) {
      allProducts.slice(0, 3).forEach((product, index) => {
        console.log(`Product ${index + 1}:`, {
          _id: product._id,
          user: product.user,
          userType: typeof product.user,
          userString: product.user.toString(),
          name: product.name
        });
      });
    }*/
    
    // Check 5: Kya user ID same format mein hai?
    if (allProducts.length > 0 && userProducts.length === 0) {
      
      const sampleProduct = allProducts[0];
      
    }
    
    

    // Temporary: Saare products show kardo for testing
    const products = await Product.find({});
    
    if (products.length === 0) {
      return res.json({
        totalProducts: 0,
        totalInventoryValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        byCategory: [],
        message: "No products found in entire database"
      });
    }

    // Calculate stats from all products (temporary)
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, product) => 
      sum + (product.price * product.stock), 0);
    
    const lowStockItems = products.filter(product => 
      product.stock <= product.min_stock && product.stock > 0
    ).length;
    
    const outOfStockItems = products.filter(product => 
      product.stock === 0
    ).length;

    // Category breakdown
    const categoryMap = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = { total: 0, count: 0 };
      }
      categoryMap[category].total += product.price * product.stock;
      categoryMap[category].count += 1;
    });

    const byCategory = Object.keys(categoryMap).map(category => ({
      category,
      total: categoryMap[category].total,
      count: categoryMap[category].count
    }));

    const result = {
      totalProducts,
      totalInventoryValue,
      lowStockItems,
      outOfStockItems,
      byCategory,
      debugInfo: {
        userFromToken: req.user.id,
        totalProductsInDB: allProducts.length,
        userProductsFound: userProducts.length,
        usingAllProductsForDemo: true
      }
    };

    res.json(result);
    
  } catch (error) {
    console.error("Error in getInventoryStats:", error);
    res.status(500).json({ error: error.message });
  }
};