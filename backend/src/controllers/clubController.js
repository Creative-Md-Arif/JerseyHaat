const Club = require("../models/Club");
const Product = require("../models/Product");

// @desc    Get all active clubs
// @route   GET /api/clubs
// @access  Public
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    // Send a 500 response directly instead of throwing
    res.status(500).json({
      success: false,
      message: "Failed to fetch clubs",
    });
  }
};

// @desc    Get single club by slug with products
// @route   GET /api/clubs/:slug
// @access  Public
const getClubBySlug = async (req, res) => {
  try {
    const club = await Club.findOne({
      slug: req.params.slug,
      isActive: true,
    }).select("-__v");

    if (!club) {
      // Send response directly and return to stop execution
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Get products for this club
    const products = await Product.find({ club: club._id, isActive: true })
      .populate("club", "name slug logo league country color")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      data: {
        club,
        products,
      },
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch club",
    });
  }
};

// @desc    Create a new club
// @route   POST /api/clubs
// @access  Admin
const createClub = async (req, res) => {
  try {
    const { name, slug, league, country, color } = req.body;

    // Check if club with slug already exists
    const existingClub = await Club.findOne({ slug: slug.toLowerCase() });
    if (existingClub) {
      // Send response directly and return
      return res.status(400).json({
        success: false,
        message: "Club with this slug already exists",
      });
    }

    const clubData = {
      name,
      slug: slug.toLowerCase(),
      league,
      country,
      color,
    };

    // If logo image uploaded
    if (req.file) {
      clubData.logo = req.file.path;
    }

    const club = await Club.create(clubData);

    res.status(201).json({
      success: true,
      data: club,
    });
  } catch (error) {
    // Handle potential Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create club",
    });
  }
};

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Admin
const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    const { name, slug, league, country, color, isActive, order } = req.body;

    // Check slug uniqueness if changed
    if (slug && slug !== club.slug) {
      const existingClub = await Club.findOne({ slug: slug.toLowerCase() });
      if (existingClub && existingClub._id.toString() !== req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Club with this slug already exists",
        });
      }
    }

    // Update fields
    if (name) club.name = name;
    if (slug) club.slug = slug.toLowerCase();
    if (league) club.league = league;
    if (country) club.country = country;
    if (color) club.color = color;
    if (isActive !== undefined) club.isActive = isActive;
    if (order !== undefined) club.order = order;
    if (req.file) club.logo = req.file.path;

    const updatedClub = await club.save();

    res.status(200).json({
      success: true,
      data: updatedClub,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update club",
    });
  }
};

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Admin
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found",
      });
    }

    // Check if products exist for this club
    const productCount = await Product.countDocuments({ club: club._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete club. ${productCount} products are associated with it.`,
      });
    }

    await club.deleteOne();

    res.status(200).json({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete club",
    });
  }
};

const getAllClubsAdmin = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ order: 1, name: 1 }).select("-__v");

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clubs",
    });
  }
};

module.exports = {
  getAllClubs,
  getAllClubsAdmin,
  getClubBySlug,
  createClub,
  updateClub,
  deleteClub,
};
