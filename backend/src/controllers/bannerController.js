const Banner = require("../models/Banner");

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

// @desc    Get all banners (admin)
// @route   GET /api/banners/all
// @access  Admin
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort({ order: 1, createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
    });
  }
};

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Admin
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, isActive, order } =
      req.body;

    const bannerData = {
      title,
      subtitle,
      buttonText: buttonText || "Shop Now",
      buttonLink: buttonLink || "/shop",
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    };

    // If banner image uploaded
    if (req.file) {
      bannerData.image = req.file.path;
    }

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      data: banner,
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
      message: "Failed to create banner",
    });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Admin
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const { title, subtitle, buttonText, buttonLink, isActive, order } =
      req.body;

    // Update fields
    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (buttonText !== undefined) banner.buttonText = buttonText;
    if (buttonLink !== undefined) banner.buttonLink = buttonLink;
    if (isActive !== undefined) banner.isActive = isActive;
    if (order !== undefined) banner.order = order;
    if (req.file) banner.image = req.file.path;

    const updatedBanner = await banner.save();

    res.status(200).json({
      success: true,
      data: updatedBanner,
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
      message: "Failed to update banner",
    });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete banner",
    });
  }
};

module.exports = {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
