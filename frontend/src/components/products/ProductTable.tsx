"use client";
import Image from "next/image";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: string;
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

function TrashIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ProductTable({ products, loading, onDelete }: ProductTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleAll = () => {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p._id)));
    }
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📦</p>
        <p className="text-sm">No products found</p>
      </div>
    );
  }

  const allChecked = selected.size === products.length && products.length > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600"
              />
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Product</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Price</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Date</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => {
            const { date, time } = formatDate(product.createdAt);
            return (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selected.has(product._id)}
                    onChange={() => toggle(product._id)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"
                  />
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📷</div>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">{product.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-700">${product.price.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-gray-500">
                  <p>{date}</p>
                  <p className="text-xs text-gray-400">at {time}</p>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete product"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
