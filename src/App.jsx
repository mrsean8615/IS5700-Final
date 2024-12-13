import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeProvider, useTheme } from "./context/ThemeProvider";
import ProductPage from "./pages/ProductPage";
import AdminProductPage from "./pages/AdminProductPage";
import Login from "./pages/Login";
import { Button } from "@mui/material";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/AuthProvider";
import CreateProduct from "./pages/CreateProduct";
import EditDiscount from "./pages/EditDiscount";
import { DiscountProvider } from "./context/DiscountProvider";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isLoginPage = location.pathname === "/login";
  return (
    <div className="App">
      {!user ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(isLoginPage ? "/" : "/login")}
        >
          {isLoginPage ? "Go to Product Page" : "Go to Admin Login"}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/adminProduct")}
        >
          Admin Product Page
        </Button>
      )}
      <ThemeToggleButton />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/adminProduct" element={<AdminProductPage />} />
        <Route path="/editDiscount" element={<EditDiscount />} />
        <Route path="/create-product" element={<CreateProduct />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

function ThemeToggleButton() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <IconButton onClick={toggleTheme}>
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DiscountProvider>
            <App />
          </DiscountProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
