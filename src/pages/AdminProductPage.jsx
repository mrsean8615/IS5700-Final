import { useState, useEffect } from "react";
import getAllProducts from "../api/getAllProducts";
import getProductByType from "../api/getProductByType";
import getProductBySearch from "../api/getProductBySearch";
import { useAuth } from "../context/AuthProvider";
import deleteProduct from "../api/deleteProduct";
import { Link, useNavigate } from "react-router-dom";
import updateProduct from "../api/updateProduct";

import {
  Container,
  Typography,
  Grid,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  DialogContentText,
} from "@mui/material";
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data.products.undefined || data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    // console.log("searching for", event.target.value);
    getProductBySearch(event.target.value)
      .then((data) => {
        setProducts(data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    if (event.target.value === "all") {
      getAllProducts().then((data) => {
        setProducts(data.products);
      });
    } else {
      getProductByType(event.target.value.toLowerCase()).then((data) => {
        setProducts(data.products || []);
      });
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
  };

  const handleSave = async () => {
    try {
      //   console.log("save", editProduct);
      const result = await updateProduct(editProduct.id, editProduct);

      if (result.success) {
        if (category === "all") {
          const data = await getAllProducts();
          setProducts(data.products);
        } else {
          const data = await getProductByType(category.toLowerCase());
          setProducts(data.products || []);
        }
        setEditProduct(null);
      } else {
        console.error("Failed to update product:", result.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const handleCancel = () => {
    setEditProduct(null);
  };

  const handleDelete = async () => {
    try {
      const result = await deleteProduct(editProduct.id);
      if (result.success) {
        if (category === "all") {
          const data = await getAllProducts();
          setProducts(data.products);
        } else {
          const data = await getProductByType(category.toLowerCase());
          setProducts(data.products || []);
        }
        setDeleteConfirmOpen(false);
        setEditProduct(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <IconButton
        color="primary"
        onClick={toggleDrawer}
        sx={{ position: "fixed", top: 20, right: 20 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Admin Tools
          </Typography>
          <ListItem component={Link} to="/" sx={{ cursor: "pointer" }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="View Customer Page" />
          </ListItem>
          <ListItem
            component={Link}
            to="/editDiscount"
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Discount" />
          </ListItem>
          <ListItem
            component={Link}
            to="/create-product"
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              Doesn't Work :(
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Create Product" />
          </ListItem>
          <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container>
          <Typography variant="h1" component="h2" gutterBottom>
            Admin Viewed Products
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            {`Welcome Admin ${user?.username}` || ""}
          </Typography>
          <TextField
            fullWidth
            label="Search products"
            variant="outlined"
            value={search}
            onChange={handleSearch}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="men's clothing">Men's Clothing</MenuItem>
              <MenuItem value="women's clothing">Women's Clothing</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {product.published ? "Published" : "Unpublished"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(product)}
                      fullWidth
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {editProduct && (
            <Dialog open={true} onClose={handleCancel}>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogContent>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={editProduct.title}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, title: e.target.value })
                  }
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editProduct.published}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          published: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={editProduct.published ? "Published" : "Unpublished"}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDeleteConfirmOpen(true)}
                  color="error"
                >
                  Delete
                </Button>
                <Button onClick={handleCancel} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <Dialog
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this product?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}
