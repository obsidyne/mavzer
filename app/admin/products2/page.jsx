// PAGE: /admin/products2
// Lists ALL layer-3 (depth=0) products — no sector/category context.
// Products created here start with no category; categories are linked later
// via drag-and-drop on the /admin/sector-management page.
//
// Clicking a product group → /admin/products2/group/[id]   (sub-products)
// Clicking a single product → /admin/products2/product/[id]  (edit form)
// + Add Product → dropdown: New Single Product | New Product Group

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../../components/admin/ProductCard";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Products2Page() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "single" | "group"
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const addBtnRef = useRef(null);

  async function fetchProducts(q = "") {
    setLoading(true);
    try {
      const url = `${API}/api/products/all${q ? `?q=${encodeURIComponent(q)}` : ""}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  function handleClickProduct(product) {
    if (product.isGroup) {
      router.push(`/admin/products2/group/${product.id}`);
    } else {
      router.push(`/admin/products2/product/${product.id}`);
    }
  }

  function handleEdit(product) {
    if (product.isGroup) {
      router.push(`/admin/products2/group/${product.id}`);
    } else {
      router.push(`/admin/products2/product/${product.id}`);
    }
  }

  async function handleDelete(id) {
    const product = products.find((p) => p.id === id);
    const catCount = product?.categories?.length ?? 0;

    if (catCount > 0) {
      setDeleteModal({ product, catCount });
      return;
    }

    if (!confirm(`Delete "${product?.name}"? This will also delete all its sub-products.`)) return;
    await doDelete(id);
  }

  async function doDelete(id) {
    try {
      await fetch(`${API}/api/products/${id}`, { method: "DELETE", credentials: "include" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = products.filter((p) => {
    if (filter === "single") return !p.isGroup;
    if (filter === "group") return p.isGroup;
    return true;
  });

  const totalSingle = products.filter((p) => !p.isGroup).length;
  const totalGroup = products.filter((p) => p.isGroup).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-[#555] text-sm mt-1">
            All products (layer 3+). Categories are assigned separately via drag-and-drop.
          </p>
        </div>

        {/* Add button */}
        <div className="relative">
          <button
            ref={addBtnRef}
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2 shrink-0"
          >
            + Add Product <span className="text-xs opacity-60">▾</span>
          </button>

          {addMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={() => { setAddMenuOpen(false); router.push("/admin/products2/product/new"); }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  <p className="font-medium">New Single Product</p>
                  <p className="text-[#555] text-xs mt-0.5">A leaf product with specs &amp; price</p>
                </button>
                <div className="border-t border-[#1f1f1f]" />
                <button
                  onClick={() => { setAddMenuOpen(false); router.push("/admin/products2/product/new?isGroup=1"); }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  <p className="font-medium">New Product Group</p>
                  <p className="text-[#555] text-xs mt-0.5">Has sub-products (layer 4 &amp; 5)</p>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats + filter bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {[
          { label: "All", value: products.length, key: "all" },
          { label: "Single", value: totalSingle, key: "single" },
          { label: "Groups", value: totalGroup, key: "group" },
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setFilter(stat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors
              ${filter === stat.key
                ? "bg-[#1a1a1a] border-[#333] text-white"
                : "bg-transparent border-[#1a1a1a] text-[#555] hover:border-[#2a2a2a] hover:text-[#888]"
              }`}
          >
            <span className="font-bold">{stat.value}</span>
            <span className="text-xs">{stat.label}</span>
          </button>
        ))}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto w-56 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-[#333] transition-colors placeholder:text-[#333]"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 bg-[#111] border border-[#1f1f1f] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        search || filter !== "all" ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl py-16">
            <p className="text-[#444] text-sm">No products match your filter</p>
            <button
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="mt-3 text-[#666] text-xs hover:text-white transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl py-20">
            <span className="text-[#222] text-4xl mb-4">▦</span>
            <p className="text-[#444] text-sm">No products yet</p>
            <p className="text-[#333] text-xs mt-1 mb-5">Create products here, then link them to categories</p>
            <button
              onClick={() => setAddMenuOpen(true)}
              className="text-white text-sm border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#444] transition-colors"
            >
              Add your first product
            </button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard2
              key={product.id}
              product={product}
              onClick={() => handleClickProduct(product)}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}

      {/* Delete warning when product is linked to categories */}
      {deleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-md p-7">
            <h3 className="text-white font-bold text-base mb-2">Delete Product</h3>
            <p className="text-[#555] text-sm mb-6 leading-relaxed">
              <span className="text-white">"{deleteModal.product.name}"</span> is linked to{" "}
              {deleteModal.catCount} {deleteModal.catCount === 1 ? "category" : "categories"}.
              Deleting it will remove it from all categories and delete all sub-products.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 text-sm text-[#666] border border-[#2a2a2a] rounded-lg py-2.5 hover:text-white hover:border-[#444] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { doDelete(deleteModal.product.id); setDeleteModal(null); }}
                className="flex-1 text-sm bg-red-600 text-white font-semibold rounded-lg py-2.5 hover:bg-red-500 transition-colors"
              >
                Delete Everywhere
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Extended ProductCard that also shows category tags
function ProductCard2({ product, onClick, onEdit, onDelete }) {
  const cats = product.categories ?? [];

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-colors">
      <div className="cursor-pointer" onClick={onClick}>
        <div className="w-full h-36 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#333] text-3xl">▦</span>
          )}
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-white text-sm font-semibold hover:underline">{product.name}</h3>
              <p className="text-[#444] text-xs mt-0.5">
                {product.isGroup
                  ? `${product._count?.subProducts ?? 0} sub-products`
                  : product.price ? `₹${product.price}` : "No price set"
                }
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {product.isGroup && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 font-medium">Group</span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                ${product.isActive ? "bg-green-950 text-green-400" : "bg-[#1a1a1a] text-[#555]"}`}>
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Category tags */}
          {cats.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-2 mb-1">
              {cats.slice(0, 2).map((c) => (
                <span key={c.categoryId} className="text-[10px] px-2 py-0.5 bg-[#1a1a1a] text-[#555] rounded-full border border-[#2a2a2a]">
                  {c.category?.name}
                </span>
              ))}
              {cats.length > 2 && (
                <span className="text-[10px] px-2 py-0.5 bg-[#1a1a1a] text-[#444] rounded-full border border-[#2a2a2a]">
                  +{cats.length - 2}
                </span>
              )}
            </div>
          ) : (
            <p className="text-[#333] text-[10px] mt-2 mb-1 italic">No category linked</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 border-t border-[#1a1a1a]">
        <button onClick={onEdit}
          className="flex-1 text-xs text-[#666] border border-[#1f1f1f] rounded-lg py-1.5 hover:text-white hover:border-[#333] transition-colors">
          Edit
        </button>
        <button onClick={onDelete}
          className="flex-1 text-xs text-[#666] border border-[#1f1f1f] rounded-lg py-1.5 hover:text-red-400 hover:border-red-900 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}