const Product = require("../models/Product");
const Club = require("../models/Club");

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("club", "name slug logo league country color")
      .sort({ createdAt: -1 })
      .limit(8)
      .select("-__v");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products",
    });
  }
};

// @desc    Get new arrivals (badge: NEW)
// @route   GET /api/products/new
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ badge: "NEW", isActive: true })
      .populate("club", "name slug logo league country color")
      .sort({ createdAt: -1 })
      .limit(8)
      .select("-__v");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch new arrivals",
    });
  }
};

// @desc    Get best sellers (sorted by salesCount)
// @route   GET /api/products/bestsellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      salesCount: { $gt: 0 },
    })
      .populate("club", "name slug logo league country color")
      .sort({ salesCount: -1 })
      .limit(8)
      .select("-__v");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch best sellers",
    });
  }
};

// @desc    Get products by club slug
// @route   GET /api/products/club/:clubSlug
// @access  Public
const getProductsByClub = async (req, res) => {
  try {
    const club = await Club.findOne({ slug: req.params.clubSlug });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const products = await Product.find({ club: club._id, isActive: true })
      .populate("club", "name slug logo league country color")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by club",
    });
  }
};

// @desc    Get products by type (Home/Away/Third/Retro)
// @route   GET /api/products/type/:type
// @access  Public
const getProductsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = [
      "Home",
      "Away",
      "Third",
      "Goalkeeper",
      "Training",
      "Retro",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    const products = await Product.find({ type, isActive: true })
      .populate("club", "name slug logo league country color")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by type",
    });
  }
};

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      club,
      type,
      search,
      badge,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = "newest",
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Filter by club slug
    if (club) {
      const clubDoc = await Club.findOne({ slug: club.toLowerCase() });
      if (clubDoc) {
        filter.club = clubDoc._id;
      }
    }

    // Filter by type
    if (type) {
      const validTypes = [
        "Home",
        "Away",
        "Third",
        "Goalkeeper",
        "Training",
        "Retro",
      ];
      if (validTypes.includes(type)) {
        filter.type = type;
      }
    }

    // Filter by badge
    if (badge) {
      filter.badge = badge.toUpperCase();
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "best-selling":
        sortOption = { salesCount: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(filter)
      .populate("club", "name slug logo league country color")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .select("-__v");

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("club", "name slug logo league country color")
      .select("-__v");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get related products (same club or same type)
    const relatedProducts = await Product.find({
      $and: [
        { _id: { $ne: product._id } },
        { isActive: true },
        {
          $or: [{ club: product.club._id }, { type: product.type }],
        },
      ],
    })
      .populate("club", "name slug logo color")
      .limit(4)
      .select("-__v");

    res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      club,
      type,
      season,
      sizes,
      colors,
      badge,
      stock,
      isFeatured,
    } = req.body;

    // Check if product with slug already exists
    const existingProduct = await Product.findOne({ slug: slug.toLowerCase() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists",
      });
    }

    // Verify club exists
    const clubDoc = await Club.findById(club);
    if (!clubDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID",
      });
    }

    const productData = {
      name,
      slug: slug.toLowerCase(),
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      club,
      type,
      season,
      sizes: sizes ? JSON.parse(sizes) : ["S", "M", "L", "XL", "XXL"],
      colors: colors ? JSON.parse(colors) : [],
      badge: badge || "",
      stock: Number(stock) || 0,
      isFeatured: isFeatured === "true" || isFeatured === true,
    };

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => file.path);
    }

    const product = await Product.create(productData);

    const populatedProduct = await Product.findById(product._id)
      .populate("club", "name slug logo league country color")
      .select("-__v");

    res.status(201).json({
      success: true,
      data: populatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      club,
      type,
      season,
      sizes,
      colors,
      badge,
      stock,
      isFeatured,
      isActive,
    } = req.body;

    // Check slug uniqueness if changed
    if (slug && slug !== product.slug) {
      const existing = await Product.findOne({ slug: slug.toLowerCase() });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Product with this slug already exists",
        });
      }
    }

    // Update fields
    if (name) product.name = name;
    if (slug) product.slug = slug.toLowerCase();
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (oldPrice !== undefined)
      product.oldPrice = oldPrice ? Number(oldPrice) : undefined;
    if (club) product.club = club;
    if (type) product.type = type;
    if (season !== undefined) product.season = season;
    if (sizes)
      product.sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    if (colors)
      product.colors = typeof colors === "string" ? JSON.parse(colors) : colors;
    if (badge !== undefined) product.badge = badge;
    if (stock !== undefined) product.stock = Number(stock);
    if (isFeatured !== undefined)
      product.isFeatured = isFeatured === "true" || isFeatured === true;
    if (isActive !== undefined)
      product.isActive = isActive === "true" || isActive === true;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();

    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate("club", "name slug logo league country color")
      .select("-__v");

    res.status(200).json({
      success: true,
      data: populatedProduct,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getProductsByClub,
  getProductsByType,
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
