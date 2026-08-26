import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchProductsGitHub, saveProductsGitHub } from "@/lib/github-products";

export interface AdminProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: string;
  available: boolean;
  featured: boolean;
  buyLink: string;
  createdAt: number;
}

export interface Banner {
  id: string;
  image: string;
  link: string;
  createdAt: number;
}

interface AdminState {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  products: AdminProduct[];
  loading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<AdminProduct, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, product: Partial<AdminProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "glowup2026";

async function syncToGitHub(products: AdminProduct[]) {
  try {
    await saveProductsGitHub(products);
  } catch (err) {
    console.error("Erro ao salvar no GitHub:", err);
  }
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loading: false,

      login: (user: string, pass: string) => {
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      products: [],

      loadProducts: async () => {
        set({ loading: true });
        try {
          const products = await fetchProductsGitHub();
          set({ products, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      addProduct: async (product) => {
        const newProduct: AdminProduct = {
          ...product,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        const updated = [...get().products, newProduct];
        set({ products: updated });
        await syncToGitHub(updated);
      },

      updateProduct: async (id, updates) => {
        const updated = get().products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );
        set({ products: updated });
        await syncToGitHub(updated);
      },

      deleteProduct: async (id) => {
        const updated = get().products.filter((p) => p.id !== id);
        set({ products: updated });
        await syncToGitHub(updated);
      },
    }),
    {
      name: "glowup-admin",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        products: state.products,
      }),
    }
  )
);
