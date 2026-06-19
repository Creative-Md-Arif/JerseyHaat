import React, { useState, useEffect } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllClubsAdmin,
} from "../services/adminApi";

const badgeTypes = ["", "NEW", "HOT", "SALE", "LIMITED", "RETRO"];
const jerseyTypes = [
  "Home",
  "Away",
  "Third",
  "Goalkeeper",
  "Training",
  "Retro",
];
const sizeOptions = ["S", "M", "L", "XL", "XXL", "3XL"];

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  // View State: 'list' বা 'form'
  const [view, setView] = useState("list");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    oldPrice: "",
    club: "",
    type: "Home",
    season: "",
    sizes: ["M", "L", "XL"],
    colors: [],
    colorInput: "#c9a84c",
    badge: "",
    stock: "0",
    isFeatured: false,
    isActive: true,
  });

  const trebuchetFont = {
    fontFamily:
      '"Trebuchet MS", "TrebuchetMS", "TrebuchetMS-Bold", "Trebuchet MS Bold", "TrebuchetMS-Italic", sans-serif',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, clubsRes] = await Promise.all([
        getAllProducts(),
        getAllClubsAdmin(),
      ]);

      // ডাটা ফেচিং সমস্যার সমাধান: response.data এর ভেতরেই ডাটা অ্যারে থাকে
      setProducts(productsRes.data || []);
      setClubs(clubsRes.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      oldPrice: "",
      club: "",
      type: "Home",
      season: "",
      sizes: ["M", "L", "XL"],
      colors: [],
      colorInput: "#c9a84c",
      badge: "",
      stock: "0",
      isFeatured: false,
      isActive: true,
    });
    setImageFiles([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.slug || !formData.price || !formData.club) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.oldPrice) data.append("oldPrice", formData.oldPrice);
      data.append("club", formData.club);
      data.append("type", formData.type);
      if (formData.season) data.append("season", formData.season);
      data.append("sizes", JSON.stringify(formData.sizes));
      data.append("colors", JSON.stringify(formData.colors));
      data.append("badge", formData.badge);
      data.append("stock", formData.stock);
      data.append("isFeatured", formData.isFeatured.toString());
      data.append("isActive", formData.isActive.toString());

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      if (isEditing && editingId) {
        await updateProduct(editingId, data);
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(data);
        setSuccess("Product created successfully!");
      }

      resetForm();
      fetchData();
      setView("list"); // সাবমিট করার পর লিস্ট পেজে চলে যাবে
    } catch (err) {
      setError(err.message || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price?.toString() || "",
      oldPrice: product.oldPrice?.toString() || "",
      club: product.club?._id || product.club || "",
      type: product.type || "Home",
      season: product.season || "",
      sizes: product.sizes || ["M", "L", "XL"],
      colors: product.colors || [],
      colorInput: "#c9a84c",
      badge: product.badge || "",
      stock: product.stock?.toString() || "0",
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== undefined ? product.isActive : true,
    });
    setIsEditing(true);
    setEditingId(product._id);
    setView("form"); // এডিট করার সময় ফর্ম পেজে চলে যাবে
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      setSuccess("Product deleted successfully!");
      fetchData();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    if (formData.colorInput && !formData.colors.includes(formData.colorInput)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, prev.colorInput],
        colorInput: "#c9a84c",
      }));
    }
  };

  const removeColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const inputClass =
    "w-full bg-dark border border-dark-3 rounded-md px-3 py-2.5 text-cream focus:outline-none focus:border-gold transition-colors text-sm";
  const labelClass =
    "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6" style={trebuchetFont}>
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-dark-3 pb-4 gap-4">
        <h1 className="text-2xl md:text-3xl text-cream font-bold tracking-wide">
          Manage Products
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setView("list");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "list" ? "bg-gold text-dark" : "bg-dark-3 text-cream hover:bg-dark"}`}
          >
            View Products
          </button>
          <button
            onClick={() => {
              resetForm();
              setView("form");
              setSuccess("");
              setError("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "form" ? "bg-gold text-dark" : "bg-dark-3 text-cream hover:bg-dark"}`}
          >
            Add New
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-md text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* ---------------- FORM VIEW ---------------- */}
      {view === "form" && (
        <div className="bg-dark-2 border border-dark-3 rounded-xl p-5 md:p-8 mb-8 shadow-lg">
          <h2 className="text-lg text-gold font-semibold mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-gold rounded-full"></span>
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <div>
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    name: e.target.value,
                    slug: isEditing ? p.slug : generateSlug(e.target.value),
                  }))
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, slug: e.target.value }))
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Club *</label>
              <select
                value={formData.club}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, club: e.target.value }))
                }
                className={inputClass}
                required
              >
                <option value="">Select Club</option>
                {clubs.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Type *</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, type: e.target.value }))
                }
                className={inputClass}
              >
                {jerseyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Price (৳) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, price: e.target.value }))
                }
                className={inputClass}
                required
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>Old Price (৳)</label>
              <input
                type="number"
                value={formData.oldPrice}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, oldPrice: e.target.value }))
                }
                className={inputClass}
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>Season</label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, season: e.target.value }))
                }
                className={inputClass}
                placeholder="2025/26"
              />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, stock: e.target.value }))
                }
                className={inputClass}
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>Badge</label>
              <select
                value={formData.badge}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, badge: e.target.value }))
                }
                className={inputClass}
              >
                {badgeTypes.map((b) => (
                  <option key={b} value={b}>
                    {b || "None"}
                  </option>
                ))}
              </select>
            </div>

            {/* Sizes */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Sizes</label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-md text-sm border transition-colors ${formData.sizes.includes(size) ? "bg-gold text-dark border-gold font-medium" : "border-dark-3 text-cream hover:border-gold/50"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Colors</label>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="color"
                  value={formData.colorInput}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, colorInput: e.target.value }))
                  }
                  className="w-12 h-10 rounded border border-dark-3 cursor-pointer bg-dark p-1"
                />
                <input
                  type="text"
                  value={formData.colorInput}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, colorInput: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="#c9a84c"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2.5 bg-dark-3 text-cream rounded-md hover:bg-dark text-sm font-medium"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark rounded-md text-sm text-cream border border-dark-3"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-dark-3"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="text-red-400 hover:text-red-500 ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                className={`${inputClass} resize-none`}
                rows={4}
                required
              />
            </div>

            {/* Images */}
            <div className="sm:col-span-2 lg:col-span-3 relative z-10">
              <label className={labelClass}>Images (max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                 onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setImageFiles(Array.from(e.target.files || []))
                }
                className="w-full text-sm text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-dark file:bg-gold file:cursor-pointer hover:file:bg-gold-light cursor-pointer"
              />
              {imageFiles.length > 0 && (
                <p className="text-xs text-green-400 mt-2">
                  {imageFiles.length} file(s) selected
                </p>
              )}
            </div>

            {/* Checkboxes */}
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-4 mt-2">
              <label className="flex items-center gap-2 bg-dark p-3 rounded-md border border-dark-3 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, isFeatured: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-gold focus:ring-gold cursor-pointer"
                />
                <span className="text-sm text-cream">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 bg-dark p-3 rounded-md border border-dark-3 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, isActive: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-gold focus:ring-gold cursor-pointer"
                />
                <span className="text-sm text-cream">Is Active?</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gold text-dark font-bold rounded-md hover:bg-gold-light transition-colors uppercase tracking-wider text-sm shadow-md"
              >
                {isEditing ? "Update Product" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView("list");
                }}
                className="px-6 py-2.5 bg-dark-3 text-cream font-medium rounded-md hover:bg-dark border border-dark-3 transition-colors uppercase tracking-wider text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------- LIST VIEW ---------------- */}
      {view === "list" && (
        <div className="bg-dark-2 border border-dark-3 rounded-xl p-5 md:p-8 shadow-lg">
          <h2 className="text-lg text-gold font-semibold mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-gold rounded-full"></span>
            Products List ({products.length})
          </h2>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-2 border-dark-3 border-t-gold rounded-full animate-spin mx-auto"></div>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-dark-3 rounded-lg">
              <p className="text-text-muted">
                No products found. Add your first product!
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-dark border-b border-dark-3">
                    <tr>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Image
                      </th>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Name
                      </th>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Club
                      </th>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Type
                      </th>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Price
                      </th>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Badge
                      </th>
                      <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-dark-3 last:border-0 hover:bg-dark-3/30 transition-colors"
                      >
                        <td className="p-4">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-12 h-16 object-cover rounded-md bg-dark p-1"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-dark-3 rounded-md" />
                          )}
                        </td>
                        <td className="p-4 font-medium text-cream max-w-xs truncate">
                          {p.name}
                        </td>
                        <td className="p-4 text-text-muted text-sm">
                          {p.club?.name || "N/A"}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-dark rounded text-xs text-text-muted">
                            {p.type}
                          </span>
                        </td>
                        <td className="p-4 text-gold font-medium">
                          ৳{p.price?.toLocaleString()}
                        </td>
                        <td
                          className={`p-4 font-medium ${p.stock === 0 ? "text-red-400" : p.stock <= 5 ? "text-yellow-500" : "text-green-400"}`}
                        >
                          {p.stock}
                        </td>
                        <td className="p-4">
                          {p.badge ? (
                            <span className="px-2 py-1 bg-gold/20 text-gold rounded text-xs font-medium">
                              {p.badge}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-gold hover:bg-gold/10 rounded-md transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {currentProducts.map((p) => (
                  <div
                    key={p._id}
                    className="bg-dark border border-dark-3 rounded-lg p-4 flex flex-col gap-3"
                  >
                    <div className="flex gap-4">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-16 h-20 object-cover rounded-md bg-dark-2 p-1"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-dark-3 rounded-md" />
                      )}
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-medium text-cream truncate">
                          {p.name}
                        </h3>
                        <p className="text-xs text-text-muted">
                          {p.club?.name || "N/A"} - {p.type}
                        </p>
                        <p className="text-gold font-medium mt-1">
                          ৳{p.price?.toLocaleString()}{" "}
                          <span className="text-text-muted text-xs ml-1">
                            Stock: {p.stock}
                          </span>
                        </p>
                        {p.badge && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-gold/20 text-gold rounded text-xs font-medium">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-t border-dark-3 pt-3 mt-1">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex-1 py-2 text-gold bg-gold/10 hover:bg-gold/20 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="flex-1 py-2 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-dark-3 text-cream rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark border border-dark-3"
                  >
                    Prev
                  </button>
                  <span className="text-text-muted text-sm px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-dark-3 text-cream rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark border border-dark-3"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManage;
