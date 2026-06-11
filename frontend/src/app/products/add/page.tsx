"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL;
const MAX_SIZE = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/svg+xml"];

export default function AddProductPage() {
  const router = useRouter();
  const [name,       setName]       = useState("");
  const [price,      setPrice]      = useState("");
  const [images,     setImages]     = useState<(File | null)[]>([null, null, null, null]);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleImageSelect = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED.includes(file.type)) { setError("Only SVG, PNG, or JPG files allowed."); e.target.value = ""; return; }
    if (file.size > MAX_SIZE)          { setError(`Photo ${index + 1}: max size is 4MB.`);  e.target.value = ""; return; }
    setImages((prev) => { const n = [...prev]; n[index] = file; return n; });
  };

  const removeImage = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => { const n = [...prev]; n[index] = null; return n; });
    if (refs[index].current) refs[index].current!.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim())               return setError("Product name is required.");
    if (!price || Number(price) < 0) return setError("Enter a valid price.");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    (images.filter(Boolean) as File[]).forEach((f) => formData.append("images", f));

    setSubmitting(true);
    try {
      await axios.post(`${API}/products`, formData);
      router.push("/products");
    } catch (err: unknown) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to save." : "Failed to save.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h1>

      {/* One alert line */}
      {error && <p className="mb-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 items-start">

          {/* Product Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Product Information</h2>
            <p className="text-xs text-gray-400 mb-6">Fill Details of the product</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Input product name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter Price" min={0} step="0.01"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
          </div>

          {/* Image Product */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Image Product</h2>
            <p className="text-xs text-blue-500 mb-5"><span className="font-semibold">Note :</span> Format photos SVG, PNG, or JPG (Max size 4mb)</p>
            <div className="grid grid-cols-4 gap-3">
              {images.map((file, i) => {
                const preview = file ? URL.createObjectURL(file) : null;
                return (
                  <div key={i} onClick={() => refs[i].current?.click()}
                    className={`relative aspect-square rounded-xl border-2 border-dashed cursor-pointer overflow-hidden group transition-colors ${
                      file ? "border-blue-400/50" : "border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50"}`}>
                    <input ref={refs[i]} type="file" accept=".jpg,.jpeg,.png,.svg" className="hidden" onChange={handleImageSelect(i)} />
                    {preview ? (
                      <>
                        <Image src={preview} alt={`Photo ${i + 1}`} fill className="object-cover" />
                        <button onClick={removeImage(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="text-blue-400">
                          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-xs text-blue-400 font-medium">Photo {i + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" disabled={submitting}
            className="px-6 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-60">
            {submitting ? "Saving…" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
