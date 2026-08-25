import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface AdminState {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  products: AdminProduct[];
  addProduct: (product: Omit<AdminProduct, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "glowup2026";

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,

      login: (user: string, pass: string) => {
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      products: [],

      addProduct: (product) => {
        const newProduct: AdminProduct = {
          ...product,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set({ products: [...get().products, newProduct] });
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },
    }),
    {
      name: "glowup-admin",
      partialize: (state) => ({
        products: state.products,
      }),
    }
  )
);
