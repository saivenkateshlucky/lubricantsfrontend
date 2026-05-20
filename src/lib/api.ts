import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-attach JWT token if present
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- TS Interfaces ---

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Price {
  id: string;
  price: number;
  currency: string;
  effective_date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  spec_json?: any;
  image_url?: string | null;
  category_id: string;
  is_active: boolean;
  category?: Category;
  prices?: Price[];
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: "new" | "in_progress" | "closed";
  product_id?: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// --- API Functions ---

export const authAPI = {
  login: async (data: any): Promise<LoginResponse> => {
    const response = await apiInstance.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
};

export const productsAPI = {
  list: async (params?: { category?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Product>> => {
    const response = await apiInstance.get<PaginatedResponse<Product>>("/products", { params });
    return response.data;
  },
  getBySlug: async (slug: string): Promise<{ success: boolean; data: Product }> => {
    const response = await apiInstance.get<{ success: boolean; data: Product }>(`/products/${slug}`);
    return response.data;
  },
  create: async (data: any): Promise<{ success: boolean; data: Product }> => {
    const response = await apiInstance.post<{ success: boolean; data: Product }>("/admin/products", data);
    return response.data;
  },
  update: async (id: string, data: any): Promise<{ success: boolean; data: Product }> => {
    const response = await apiInstance.put<{ success: boolean; data: Product }>(`/admin/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<{ success: boolean; data: Product }> => {
    const response = await apiInstance.delete<{ success: boolean; data: Product }>(`/admin/products/${id}`);
    return response.data;
  },
};

export const pricesAPI = {
  create: async (data: { product_id: string; price: number; currency?: string; effective_date?: string }): Promise<{ success: boolean; data: Product }> => {
    const response = await apiInstance.post<{ success: boolean; data: Product }>("/admin/prices", data);
    return response.data;
  },
};

export const enquiriesAPI = {
  create: async (data: { name: string; email: string; phone?: string; message: string; product_id?: string }) => {
    const response = await apiInstance.post<{ success: boolean; data: Enquiry }>("/enquiries", data);
    return response.data;
  },
  list: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await apiInstance.get<PaginatedResponse<Enquiry>>("/admin/enquiries", { params });
    return response.data;
  },
  updateStatus: async (id: string, status: "new" | "in_progress" | "closed") => {
    const response = await apiInstance.put<{ success: boolean; data: Enquiry }>(`/admin/enquiries/${id}`, { status });
    return response.data;
  },
};

export const categoriesAPI = {
  list: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await apiInstance.get<{ success: boolean; data: Category[] }>("/categories");
    return response.data;
  },
};

export const uploadAPI = {
  getSign: async (data: { fileName: string; contentType: string }): Promise<{ success: boolean; data: { signedUrl: string; publicUrl: string; path: string } }> => {
    const response = await apiInstance.post<{ success: boolean; data: { signedUrl: string; publicUrl: string; path: string } }>("/admin/uploads/sign", data);
    return response.data;
  },
};
