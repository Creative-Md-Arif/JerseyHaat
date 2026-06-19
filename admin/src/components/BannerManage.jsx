import React, { useState, useEffect } from "react";
import {
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../services/adminApi";

const BannerManage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // View State: 'list' বা 'form'
  const [view, setView] = useState("list");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    isActive: true,
    order: "0",
  });

  const trebuchetFont = {
    fontFamily:
      '"Trebuchet MS", "TrebuchetMS", "TrebuchetMS-Bold", "Trebuchet MS Bold", "TrebuchetMS-Italic", sans-serif',
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getAllBannersAdmin();
      // ডাটা ফেচিং সমস্যার সমাধান
      setBanners(response.data?.data || response.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      isActive: true,
      order: "0",
    });
    setImageFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title) {
      setError("Banner title is required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("buttonText", formData.buttonText);
      data.append("buttonLink", formData.buttonLink);
      // FormData তে Boolean স্ট্রিং হিসেবে পাঠানো হচ্ছে
      data.append("isActive", formData.isActive.toString());
      data.append("order", formData.order);

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (isEditing && editingId) {
        await updateBanner(editingId, data);
        setSuccess("Banner updated successfully!");
      } else {
        await createBanner(data);
        setSuccess("Banner created successfully!");
      }

      resetForm();
      fetchBanners();
      setView("list"); // সাবমিট করার পর লিস্ট পেজে চলে যাবে
    } catch (err) {
      setError(err.message || "Failed to save banner");
    }
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      buttonText: banner.buttonText || "Shop Now",
      buttonLink: banner.buttonLink || "/shop",
      isActive: banner.isActive,
      order: banner.order?.toString() || "0",
    });
    setIsEditing(true);
    setEditingId(banner._id);
    setView("form"); // এডিট করার সময় ফর্ম পেজে চলে যাবে
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id);
      setSuccess("Banner deleted successfully!");
      fetchBanners();
    } catch (err) {
      setError(err.message || "Failed to delete banner");
    }
  };

  const inputClass =
    "w-full bg-dark border border-dark-3 rounded-md px-3 py-2.5 text-cream focus:outline-none focus:border-gold transition-colors text-sm";
  const labelClass =
    "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6" style={trebuchetFont}>
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-dark-3 pb-4 gap-4">
        <h1 className="text-2xl md:text-3xl text-cream font-bold tracking-wide">
          Manage Banners
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setView("list");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === "list" ? "bg-gold text-dark" : "bg-dark-3 text-cream hover:bg-dark"}`}
          >
            View Banners
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
            {isEditing ? "Edit Banner" : "Add New Banner"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div className="sm:col-span-2">
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                className={inputClass}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, subtitle: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Button Text</label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, buttonText: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Button Link</label>
              <input
                type="text"
                value={formData.buttonLink}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, buttonLink: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, order: e.target.value }))
                }
                className={inputClass}
                min="0"
              />
            </div>

            {/* Custom File Input to avoid Z-index issues */}
            <div className="sm:col-span-2 relative z-50">
              <label className={labelClass}>Banner Image</label>
              <div
                onClick={() => document.getElementById("banner-upload").click()}
                className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dark-3 border-dashed rounded-md cursor-pointer hover:border-gold transition-colors"
              >
                <svg
                  className="w-8 h-8 text-text-muted mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gold font-medium">
                  {imageFile ? imageFile.name : "Click to upload image"}
                </p>
                <p className="text-xs text-text-muted mt-1">PNG, JPG, WEBP</p>
              </div>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            <div
              className="sm:col-span-2 flex items-center gap-3 mt-2 bg-dark p-3 rounded-md border border-dark-3 cursor-pointer"
              onClick={() =>
                setFormData((p) => ({ ...p, isActive: !p.isActive }))
              }
            >
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isActive: e.target.checked }))
                }
                className="w-4 h-4 rounded text-gold focus:ring-gold cursor-pointer"
              />
              <span className="text-sm text-cream">
                Is Active? (Show on website)
              </span>
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gold text-dark font-bold rounded-md hover:bg-gold-light transition-colors uppercase tracking-wider text-sm shadow-md"
              >
                {isEditing ? "Update Banner" : "Create Banner"}
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
            Banners List ({banners.length})
          </h2>

          {/* Custom Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-dark-3 border-t-gold rounded-full animate-spin mb-4"></div>
              <p className="text-text-muted text-sm tracking-wide">
                Loading banners...
              </p>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-dark-3 rounded-lg">
              <p className="text-text-muted">
                No banners found. Add your first banner!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className="bg-dark border border-dark-3 rounded-lg overflow-hidden flex flex-col group hover:border-gold/30 transition-colors"
                >
                  <div className="aspect-video w-full overflow-hidden bg-dark-3 relative">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${banner.isActive ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-medium text-cream mb-1">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-text-muted mb-4 flex-1">
                      {banner.subtitle || "No subtitle"}
                    </p>
                    <div className="flex items-center justify-between border-t border-dark-3 pt-3 mt-auto">
                      <span className="text-xs text-text-muted">
                        Order: {banner.order}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
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
                          onClick={() => handleDelete(banner._id)}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BannerManage;
