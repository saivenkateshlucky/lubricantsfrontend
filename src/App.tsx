import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Imports
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPrices from "./pages/admin/AdminPrices";
import AdminEnquiries from "./pages/admin/AdminEnquiries";

function App() {
  return (
    <Routes>
      {/* Public Client-Facing Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Admin Login (Public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/prices" element={<AdminPrices />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
