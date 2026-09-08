"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoryCard from "../../../components/admin/CategoryCard";
import CategoryModal from "../../../components/admin/CategoryModal";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CategoriesPage() {
  const { sectorId } = useParams();
  const router = useRouter();

  const [sector, setSector] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  async function fetchData() {
    try {
      const [sectorRes, categoriesRes] = await Promise.all([
        fetch(`${API}/api/sectors/${sectorId}`, { credentials: "include" }),
        fetch(`${API}/api/categories?sectorId=${sectorId}`, { credentials: "include" }),
      ]);
      const sectorData = await sectorRes.json();
      const categoriesData = await categoriesRes.json();
      setSector(sectorData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [sectorId]);

  function handleAdd() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function handleEdit(category) {
    setEditingCategory(category);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category? This will also delete all its products.")) return;
    try {
      await fetch(`${API}/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  function handleSaved(category) {
    if (editingCategory) {
      setCategories((prev) => prev.map((c) => c.id === category.id ? category : c));
    } else {
      setCategories((prev) => [...prev, category]);
    }
    setModalOpen(false);
  }

  if (loading) return <div className="text-[var(--text-muted)] text-sm">Loading...</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-faint)] mb-6">
        <button onClick={() => router.push("/admin/products")} className="hover:text-[var(--text-primary)] transition-colors">
          Products
        </button>
        <span>›</span>
        <span className="text-[var(--text-primary)]">{sector?.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[var(--text-primary)] text-2xl font-bold tracking-tight">{sector?.name}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage categories in this sector</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[var(--invert-bg)] text-[var(--invert-text)] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[var(--invert-hover)] transition-colors"
        >
          + Add Category
        </button>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[var(--border-default)] rounded-xl py-20">
          <p className="text-[var(--text-faint)] text-sm">No categories yet</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-[var(--text-primary)] text-sm border border-[var(--border-default)] px-4 py-2 rounded-lg hover:border-[var(--border-strong)] transition-colors"
          >
            Add your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              sectorId={sectorId}
              onEdit={() => handleEdit(category)}
              onDelete={() => handleDelete(category.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          sectorId={sectorId}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}