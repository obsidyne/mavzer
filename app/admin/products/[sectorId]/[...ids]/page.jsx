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
  const [deleteModal, setDeleteModal] = useState(null); // { product, categoryCount, currentCategoryId }
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
    // fetch full product to check category count
    const res = await fetch(`${API}/api/products/${id}`, { credentials: "include" });
    const data = await res.json();
    const categoryCount = data.categories?.length ?? 0;

    // resolve current node fresh to get its type and id
    const nodeRes = await fetch(`${API}/api/products/resolve/${currentId}`, { credentials: "include" });
    const node = await nodeRes.json();
    const currentCategoryId = node.type === "category" ? currentId : null;

    console.log("[DELETE DEBUG]", { categoryCount, categories: data.categories, nodeType: node.type, currentCategoryId });

    if (categoryCount > 1 && currentCategoryId) {
      setDeleteModal({ product: data, categoryCount, currentCategoryId });
    } else {
      if (!confirm(`Delete this product? (debug: categoryCount=${categoryCount}, currentCategoryId=${currentCategoryId})\nThis will also delete all its sub-products.`)) return;
      await fetch(`${API}/api/products/${id}`, { method: "DELETE", credentials: "include" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function handleDeleteHere() {
    const { product, currentCategoryId } = deleteModal;
    setDeleteModal(null);
    await fetch(`${API}/api/products/unlink`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId: product.id, categoryId: currentCategoryId }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  async function handleDeleteEverywhere() {
    const { product } = deleteModal;
    setDeleteModal(null);
    await fetch(`${API}/api/products/${product.id}`, { method: "DELETE", credentials: "include" });
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
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
                {isCategory && (
                  <button
                    onClick={handleAddExisting}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    <p className="font-medium">Add Existing Product</p>
                    <p className="text-[#555] text-xs mt-0.5">Link a product from another category</p>
                  </button>
                )}
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

      {/* ── Smart Delete Modal ── */}
      {deleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#071e3d]">Delete Product</h3>
                <p className="text-[12px] text-[#9aa3af]">This product exists in {deleteModal.categoryCount} categories</p>
              </div>
            </div>

            <p className="text-[13px] text-[#4a5568] mb-6 leading-relaxed">
              <span className="font-semibold text-[#071e3d]">&quot;{deleteModal.product.name}&quot;</span> is linked to {deleteModal.categoryCount} categories. How would you like to remove it?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteHere}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#dde4ef] hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" width="15" height="15">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#071e3d]">Remove from this category only</p>
                  <p className="text-[11px] text-[#9aa3af]">Product stays in other categories</p>
                </div>
              </button>

              <button
                onClick={handleDeleteEverywhere}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#dde4ef] hover:border-red-300 hover:bg-red-50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" width="15" height="15">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#071e3d]">Delete from everywhere</p>
                  <p className="text-[11px] text-[#9aa3af]">Permanently removes the product and all sub-products</p>
                </div>
              </button>

              <button
                onClick={() => setDeleteModal(null)}
                className="w-full px-4 py-2.5 text-[12px] text-[#9aa3af] hover:text-[#071e3d] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}