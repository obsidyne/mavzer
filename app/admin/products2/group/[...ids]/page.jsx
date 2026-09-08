// PAGE: /admin/products2/group/[...ids]
// Catch-all for drilling into product groups.
// ids[0] is always a depth-0 group (layer 3 group)
// ids[1] (if present) is a depth-1 group (layer 4 group)
//
// Mirrors the behaviour of /admin/products/[sectorId]/[...ids] but:
//  - No sector/category context
//  - Breadcrumb roots back to /admin/products2
//  - Can go 2 levels deep (layer 4 and layer 5)
//  - "Add Product" creates sub-products using the normal parentId flow

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "../../../../components/admin/ProductCard";
import ProductGroupModal from "../../../../components/admin/ProductGroupModal";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Products2GroupPage() {
  const { ids } = useParams();
  const router = useRouter();

  // ids is the catch-all array — last item is the current group
  const currentId = ids[ids.length - 1];

  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      const crumbs = [{ label: "Products", href: "/admin/products2" }];

      // Resolve each id in the chain to build breadcrumbs
      for (let i = 0; i < ids.length; i++) {
        const res = await fetch(`${API}/api/products/${ids[i]}`, { credentials: "include" });
        const data = await res.json();
        const href = `/admin/products2/group/${ids.slice(0, i + 1).join("/")}`;
        crumbs.push({ label: data.name, href, id: ids[i], depth: data.depth });

        if (i === ids.length - 1) {
          setCurrentGroup(data);
        }
      }

      setBreadcrumbs(crumbs);

      // Fetch sub-products of the current group
      const subRes = await fetch(`${API}/api/products?parentId=${currentId}`, { credentials: "include" });
      const subData = await subRes.json();
      setProducts(Array.isArray(subData) ? subData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [ids.join(",")]);

  function handleClickProduct(product) {
    if (product.isGroup) {
      // Drill deeper — append this group's id to the URL
      router.push(`/admin/products2/group/${ids.join("/")}/${product.id}`);
    } else {
      router.push(`/admin/products2/product/${product.id}`);
    }
  }

  function handleEdit(product) {
    if (product.isGroup) {
      setEditingProduct(product);
      setGroupModalOpen(true);
    } else {
      router.push(`/admin/products2/product/${product.id}`);
    }
  }

  function handleAddSingle() {
    setAddMenuOpen(false);
    const depth = (currentGroup?.depth ?? 0) + 1;
    router.push(`/admin/products2/product/new?parentId=${currentId}&depth=${depth}`);
  }

  function handleAddGroup() {
    setAddMenuOpen(false);
    setEditingProduct(null);
    setGroupModalOpen(true);
  }

  async function handleDelete(id) {
    const product = products.find((p) => p.id === id);
    if (!confirm(`Delete "${product?.name}"? This will also delete all its sub-products.`)) return;
    try {
      await fetch(`${API}/api/products/${id}`, { method: "DELETE", credentials: "include" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
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

  // Current depth: depth of currentGroup + 1 = depth of its children
  const childDepth = (currentGroup?.depth ?? 0) + 1;
  // Can add a sub-group only if children would be depth 1 (layer 4 can be a group → its children are layer 5 leaves)
  const canAddGroup = childDepth <= 1;

  if (loading) return <div className="text-[var(--text-muted)] text-sm">Loading...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-faint)] mb-6 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>›</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="text-[var(--text-primary)]">{crumb.label}</span>
            ) : (
              <button onClick={() => router.push(crumb.href)} className="hover:text-[var(--text-primary)] transition-colors">
                {crumb.label}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[var(--text-primary)] text-2xl font-bold tracking-tight">
              {currentGroup?.name}
            </h1>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 font-medium">
              Layer {(currentGroup?.depth ?? 0) + 4}
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {childDepth === 1
              ? "Sub-products in this group (layer 4)"
              : "Sub-products in this group (layer 5 — deepest level)"
            }
          </p>
        </div>

        {/* Add dropdown */}
        <div className="relative">
          <button
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="bg-[var(--invert-bg)] text-[var(--invert-text)] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--invert-hover)] transition-colors flex items-center gap-2"
          >
            + Add Product <span className="text-xs opacity-60">▾</span>
          </button>

          {addMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={handleAddSingle}
                  className="w-full text-left px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <p className="font-medium">New Single Product</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">Leaf product with specs &amp; price</p>
                </button>
                {canAddGroup && (
                  <>
                    <div className="border-t border-[var(--border-subtle)]" />
                    <button
                      onClick={handleAddGroup}
                      className="w-full text-left px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <p className="font-medium">New Sub-Group</p>
                      <p className="text-[var(--text-muted)] text-xs mt-0.5">Group with layer-5 products inside</p>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[var(--border-default)] rounded-xl py-20">
          <p className="text-[var(--text-faint)] text-sm">No sub-products yet</p>
          <button
            onClick={() => setAddMenuOpen(true)}
            className="mt-4 text-[var(--text-primary)] text-sm border border-[var(--border-default)] px-4 py-2 rounded-lg hover:border-[var(--border-strong)] transition-colors"
          >
            Add first sub-product
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

      {/* Group modal (create / edit inline) */}
      {groupModalOpen && (
        <ProductGroupModal
          product={editingProduct}
          parentId={currentId}
          depth={childDepth}
          onClose={() => { setGroupModalOpen(false); setEditingProduct(null); }}
          onSaved={handleSavedGroup}
        />
      )}
    </div>
  );
}