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

export const DEFAULT_PRODUCTS: AdminProduct[] = [
  {
    id: "default-1",
    title: "Protetor Solar Facial FPS 70",
    description: "Protetor solar facial de alta protecao com toque seco. Protege contra raios UVA e UVB sem deixar a pele oleosa. Indicado para uso diario.",
    price: "59.90",
    image: "",
    category: "cuidados",
    available: true,
    featured: true,
    buyLink: "",
    createdAt: 0,
  },
  {
    id: "default-2",
    title: "Creme Pentear Sem Enxague",
    description: "Creme para pentear que desembaraça, hidrata e reduz o frizz. Deixa o cabelo macio, brilhante e facil de modelar. Para todos os tipos de cabelo.",
    price: "34.90",
    image: "",
    category: "cabelo",
    available: true,
    featured: true,
    buyLink: "",
    createdAt: 0,
  },
  {
    id: "default-3",
    title: "Base Matte Longa Duracao",
    description: "Base de alta cobertura com acabamento matte. Dura ate 24 horas sem transferir. Disponivel em varias tonalidades para todos os tons de pele.",
    price: "49.90",
    image: "",
    category: "maquiagem",
    available: true,
    featured: false,
    buyLink: "",
    createdAt: 0,
  },
  {
    id: "default-4",
    title: "Shampoo Nutritivo com Queratina",
    description: "Shampoo enriquecido com queratina que reconstrui e fortalece os fios. Indicado para cabelos danificados e quimicamente tratados.",
    price: "29.90",
    image: "",
    category: "cabelo",
    available: true,
    featured: false,
    buyLink: "",
    createdAt: 0,
  },
  {
    id: "default-5",
    title: "Kit Rotina Skincare Completa",
    description: "Kit com limpe, tonico, serum de vitamina C e hidratante facial. Rotina completa para cuidar da pele todos os dias com resultados visiveis.",
    price: "129.90",
    image: "",
    category: "saude",
    available: true,
    featured: true,
    buyLink: "",
    createdAt: 0,
  },
  {
    id: "default-6",
    title: "Batom Matte Transfer Free",
    description: "Batom de alta pigmentacao com acabamento matte. Fixacao intensa que dura horas sem borrar. Cores vibrantes para todos os estilos.",
    price: "24.90",
    image: "",
    category: "maquiagem",
    available: true,
    featured: false,
    buyLink: "",
    createdAt: 0,
  },
  {
    id: "default-7",
    title: "Oleo Capilar Reparador",
    description: "Oleo capilar leve que hidrata, sela as pontas e dá brilho intenso sem engordar. Com azeite de argan e vitamina E para cabelos extras secos.",
    price: "39.90",
    image: "",
    category: "cabelo",
    available: true,
    featured: false,
    buyLink: "",
    createdAt: 0,
  },
  {
    id: "default-8",
    title: "Mascara Facial de Argila",
    description: "Mascara purificante com argila verde que limpa os poros, controla oleosidade e renova a pele. Uso semanal para uma pele fresca e radiante.",
    price: "44.90",
    image: "",
    category: "cuidados",
    available: true,
    featured: false,
    buyLink: "",
    createdAt: 0,
  },
];

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
