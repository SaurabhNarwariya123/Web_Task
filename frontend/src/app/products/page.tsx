"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import ProductTable from "@/components/products/ProductTable";

const API = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 10;

const SORT_OPTIONS = [
  { value: "createdAt|desc", label: "Newest First" },
  { value: "createdAt|asc",  label: "Oldest First" },
  { value: "name|asc",       label: "Name: A → Z" },
  { value: "name|desc",      label: "Name: Z → A" },
  { value: "price|asc",      label: "Price: Low → High" },
  { value: "price|desc",     label: "Price: High → Low" },
];

interface Product { _id: string; name: string; price: number; images: string[]; createdAt: string; }
interface Pagination { total: number; page: number; totalPages: number; from: number; to: number; }

export default function ProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [showSort,   setShowSort]   = useState(false);
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");
  const [minPrice,   setMinPrice]   = useState("");
  const [maxPrice,   setMaxPrice]   = useState("");
  const [sort,       setSort]       = useState("createdAt|desc");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    const [sortBy, sortOrder] = sort.split("|");
    try {
      const { data } = await axios.get(`${API}/products`, {
        params: { page, limit: LIMIT,
          search:    search    || undefined,
          startDate: startDate || undefined,
          endDate:   endDate   || undefined,
          minPrice:  minPrice  || undefined,
          maxPrice:  maxPrice  || undefined,
          sortBy, sortOrder },
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err: unknown) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to load" : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, search, startDate, endDate, minPrice, maxPrice, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      setSuccess("Product deleted");
      fetchProducts();
    } catch (err: unknown) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Delete failed" : "Delete failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Product</h1>
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <span>Dashboard</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-300"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span>Product</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-300"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="text-blue-500 font-medium">Sneakers</span>
      </div>

      {/* One alert line for error/success */}
      {error   && <p className="mb-4 text-sm text-red-500   bg-red-50   border border-red-200   rounded-xl px-4 py-2.5">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">{success}</p>}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search product"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <button onClick={() => setShowSort(!showSort)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border rounded-xl transition-colors ${showSort ? "bg-blue-50 text-blue-600 border-blue-200" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
            Filter
          </button>
          <Link href="/products/add"
            className="flex items-center gap-2 px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            New Product
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </Link>
        </div>

        {/* Sort — toggle on Filter click */}
        {showSort && (
          <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100 overflow-x-auto">
            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap mr-1">Sort By</span>
            {SORT_OPTIONS.map((o) => (
              <button key={o.value} onClick={() => { setSort(o.value); setPage(1); setShowSort(false); }}
                className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-lg border transition-colors ${sort === o.value ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"}`}>
                {o.label}
              </button>
            ))}
          </div>
        )}

        {/* Date Range + Price — always visible */}
        <div className="px-4 py-3 flex items-end gap-4 border-b border-gray-100 overflow-x-auto">
          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Date Range</p>
            <div className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-36 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-36 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>
          <div className="flex-shrink-0">
            <p className="text-xs font-semibold text-gray-600 mb-1.5">Price</p>
            <div className="flex items-center gap-2">
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price" min={0}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price" min={0}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-2 ml-auto flex-shrink-0 self-end">
            <button onClick={() => { setStartDate(""); setEndDate(""); setMinPrice(""); setMaxPrice(""); setPage(1); }}
              className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Reset</button>
            <button onClick={() => setPage(1)}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">Apply</button>
          </div>
        </div>

        {/* Table */}
        <ProductTable products={products} loading={loading} onDelete={handleDelete} />

        {/* Pagination — inline, backend drives the numbers */}
        {pagination && pagination.total > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">{pagination.from} - {pagination.to} of {pagination.total} Pages</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">The page on</span>
              <select value={page} onChange={(e) => setPage(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 focus:outline-none cursor-pointer">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
