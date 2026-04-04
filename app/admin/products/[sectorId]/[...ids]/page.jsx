// PAGE: Products/Groups Grid — /admin/products/[sectorId]/[...ids]
// The [...ids] catch-all handles any depth:
//   - last id is a categoryId → shows root products of that category
//   - last id is a productGroupId → shows sub-products of that group
// Breadcrumbs are built from the ids array for backtracking
// Click a product group → goes deeper (appends its id to URL)
// Click a single product → goes to /admin/products/product/[productId]
// Add Product → "New Product" or "Add Existing Product"

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "../../../../components/admin/ProductCard";
import ProductGroupModal from "../../../../components/admin/ProductGroupModal";
import AddExistingProductModal from "../../../../components/admin/AddExistingProductModal";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsGridPage() {
  const { sectorId, ids } = useParams();
  const router = useRouter();

  // last id in the chain is the current context (category or group)
  const currentId = ids[ids.length - 1];

  const [sector, setSector] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentNode, setCurrentNode] = useState(null); // { type: "category"|"group", data: {} }
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [existingModalOpen, setExistingModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      // fetch sector
      const sectorRes = await fetch(`${API}/api/sectors/${sectorId}`, { credentials: "include" });
      const sectorData = await sectorRes.json();
      setSector(sectorData);

      // resolve all ids in the chain for breadcrumbs
      const crumbs = [
        { label: "Products", href: "/admin/products" },
        { label: sectorData.name, href: `/admin/products/${sectorId}` },
      ];

      for (let i = 0; i < ids.length; i++) {
        const res = await fetch(`${API}/api/products/resolve/${ids[i]}`, { credentials: "include" });
        const resolved = await res.json();
        const href = `/admin/products/${sectorId}/${ids.slice(0, i + 1).join("/")}`;
        crumbs.push({ label: resolved.data?.name, href, id: ids[i], type: resolved.type });

        if (i === ids.length - 1) {
          setCurrentNode(resolved);
        }
      }

      setBreadcrumbs(crumbs);

      // fetch products based on current node type
      const lastResolved = await fetch(`${API}/api/products/resolve/${currentId}`, { credentials: "include" });
      const node = await lastResolved.json();

      let productsUrl = "";
      if (node.type === "category") {
        productsUrl = `${API}/api/products?categoryId=${currentId}`;
      } else {
        productsUrl = `${API}/api/products?parentId=${currentId}`;
      }

      const productsRes = await fetch(productsUrl, { credentials: "include" });
      setProducts(await productsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [ids.join(",")]);

  function handleClickProduct(product) {
    if (product.isGroup) {
      // go deeper — append this product's id to the url
      router.push(`/admin/products/${sectorId}/${ids.join("/")}/${product.id}`);
    } else {
      // go to edit form
      router.push(`/admin/products/product/${product.id}`);
    }
  }

  function handleAddNew() {
    setAddMenuOpen(false);
    const isCategory = currentNode?.type === "category";
    const query = isCategory
      ? `categoryId=${currentId}&sectorId=${sectorId}&depth=0`
      : `parentId=${currentId}&sectorId=${sectorId}&depth=${(currentNode?.data?.depth ?? 0) + 1}`;
    router.push(`/admin/products/product/new?${query}`);
  }

  function handleAddGroup() {
    setAddMenuOpen(false);
    setEditingProduct(null);
    setGroupModalOpen(true);
  }

  function handleAddExisting() {
    setAddMenuOpen(false);
    setExistingModalOpen(true);
  }

  function handleEdit(product) {
    if (product.isGroup) {
      setEditingProduct(product);
      setGroupModalOpen(true);
    } else {
      router.push(`/admin/products/product/${product.id}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product? This will also delete all its sub-products.")) return;
    await fetch(`${API}/api/products/${id}`, { method: "DELETE", credentials: "include" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleSavedGroup(product) {
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => p.id === product.id ? product : p));
    } else {
      setProducts((prev) => [...prev, product]);
    }
    setGroupModalOpen(false);
    setEditingProduct(null);
  }

  function handleLinkedExisting(product) {
    setProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
    setExistingModalOpen(false);
  }

  const isCategory = currentNode?.type === "category";
  const currentDepth = isCategory ? 0 : (currentNode?.data?.depth ?? 0) + 1;
  const canAddGroup = currentDepth < 2;

  if (loading) return <div className="text-[#555] text-sm">Loading...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#444] mb-6 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>›</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-white">{crumb.label}</span>
            ) : (
              <button onClick={() => router.push(crumb.href)} className="hover:text-white transition-colors">
                {crumb.label}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            {breadcrumbs[breadcrumbs.length - 1]?.label}
          </h1>
          <p className="text-[#555] text-sm mt-1">
            {isCategory ? "Products in this category" : "Sub-products in this group"}
          </p>
        </div>

        {/* Add button */}
        <div className="relative">
          <button
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            + Add Product <span className="text-xs">▾</span>
          </button>

          {addMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <button
                  onClick={handleAddNew}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  <p className="font-medium">New Single Product</p>
                  <p className="text-[#555] text-xs mt-0.5">Create with full details</p>
                </button>
                <div className="border-t border-[#1f1f1f]" />
                {canAddGroup && (
                  <>
                    <button
                      onClick={handleAddGroup}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      <p className="font-medium">New Product Group</p>
                      <p className="text-[#555] text-xs mt-0.5">Has sub-products</p>
                    </button>
                    <div className="border-t border-[#1f1f1f]" />
                  </>
                )}
                <button
                  onClick={handleAddExisting}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  <p className="font-medium">Add Existing Product</p>
                  <p className="text-[#555] text-xs mt-0.5">Link a product from another category</p>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#2a2a2a] rounded-xl py-20">
          <p className="text-[#444] text-sm">No products yet</p>
          <button
            onClick={() => setAddMenuOpen(true)}
            className="mt-4 text-white text-sm border border-[#2a2a2a] px-4 py-2 rounded-lg hover:border-[#444] transition-colors"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleClickProduct(product)}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}

      {groupModalOpen && (
        <ProductGroupModal
          product={editingProduct}
          categoryId={isCategory ? currentId : null}
          parentId={isCategory ? null : currentId}
          depth={currentDepth}
          onClose={() => { setGroupModalOpen(false); setEditingProduct(null); }}
          onSaved={handleSavedGroup}
        />
      )}

      {existingModalOpen && (
        <AddExistingProductModal
          categoryId={isCategory ? currentId : null}
          parentId={isCategory ? null : currentId}
          existingIds={products.map((p) => p.id)}
          onClose={() => setExistingModalOpen(false)}
          onLinked={handleLinkedExisting}
        />
      )}
    </div>
  );
}