import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../../hooks/useCategories";
import {
  Loader2,
  IndianRupee,
  Clock,
  AlignLeft,
  MapPin,
  Phone,
  AlertCircle,
  ImageIcon,
} from "lucide-react";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/30 focus:bg-white";
const iconInputClass = inputClass.replace("px-4", "pl-11 pr-4");

// One image link per line -> list of links (max 5)
const parseImageUrls = (text = "") =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5);

// Used by both "Create Service" and "Edit Service"
const ServiceForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel, askForPhone = false }) => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const previews = parseImageUrls(watch("imageUrls"));

  const submit = (data) => {
    setPhoneError("");

    if (askForPhone && phoneNumber.trim().length < 8) {
      setPhoneError("A valid mobile number is required so customers can contact you.");
      return;
    }

    onSubmit({
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      duration: Number(data.duration),
      category: data.category,
      address: data.address.trim(),
      images: parseImageUrls(data.imageUrls),
      ...(askForPhone && { phoneNumber: phoneNumber.trim() }),
    });
  };

  // Wait for categories so the category dropdown can show the saved value
  if (loadingCategories) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

        {/* Images (links) */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
          <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon size={16} /> Image Links (optional)
          </label>
          <textarea
            {...register("imageUrls")}
            rows={5}
            placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
            className={`${inputClass} resize-y text-sm`}
          />
          <p className="text-xs text-gray-500">
            Paste a link to each photo, one per line (up to 5). If you leave this empty, a default picture is shown.
          </p>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {previews.map((src, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Service Title</label>
            <input
              {...register("name", { required: "Title is required", minLength: { value: 3, message: "At least 3 characters" } })}
              type="text"
              placeholder="e.g. Homemade Maharashtrian Tiffin"
              className={inputClass}
            />
            {errors.name && <span className="text-red-500 text-xs font-medium">{errors.name.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <span className="text-red-500 text-xs font-medium">{errors.category.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Price (₹)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("price", { required: "Price is required", min: { value: 1, message: "Must be at least 1" } })}
                  type="number"
                  placeholder="999"
                  className={iconInputClass}
                />
              </div>
              {errors.price && <span className="text-red-500 text-xs font-medium">{errors.price.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">Duration (mins)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("duration", { required: "Duration is required", min: { value: 1, message: "Must be at least 1" } })}
                  type="number"
                  placeholder="60"
                  className={iconInputClass}
                />
              </div>
              {errors.duration && <span className="text-red-500 text-xs font-medium">{errors.duration.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Service Location</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("address", { required: "Address is required" })}
                type="text"
                placeholder="e.g. Shivaji Nagar, Pune"
                className={iconInputClass}
              />
            </div>
            {errors.address && <span className="text-red-500 text-xs font-medium">{errors.address.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">Description</label>
            <div className="relative">
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={6}
                placeholder="Describe what is included, materials or ingredients used, and any details customers should know..."
                className={`${inputClass} resize-y`}
              />
              <AlignLeft className="absolute top-4 right-4 h-5 w-5 text-gray-300 pointer-events-none" />
            </div>
            {errors.description && <span className="text-red-500 text-xs font-medium">{errors.description.message}</span>}
          </div>

          {askForPhone && (
            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl space-y-3">
              <div className="flex items-start gap-2 text-blue-800">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">
                  Entrepreneur Contact Required: We need your mobile number so customers can call you after booking.
                </p>
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-blue-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                />
              </div>
              {phoneError && <p className="text-red-500 text-xs font-bold">{phoneError}</p>}
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/services")}
              className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" /> Saving...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
};

export default ServiceForm;
