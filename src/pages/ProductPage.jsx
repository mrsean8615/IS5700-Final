import { useState, useEffect } from "react";
import getAllProducts from "../common/getAllProducts";
import getProductByType from "../common/getProductByType";
import getProductBySearch from "../common/getProductBySearch";
import {
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Drawer,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Box,
  Avatar,
} from "@mui/material";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

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

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCartItems = (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + 1,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (itemId, change) => {
    setCartItems((prevItems) => {
      return (
        prevItems
          .map((item) => {
            if (item.id === itemId) {
              const newQuantity = (item.quantity || 1) + change;

              if (newQuantity > item.inventory) {
                alert("Not enough inventory to add more items");
                return item;
              }
              return newQuantity > 0
                ? { ...item, quantity: newQuantity }
                : null;
            }
            return item;
          })
          // if the quanity is 0, remove the item
          .filter(Boolean)
      );
    });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    console.log("searching for", event.target.value);
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

  const handlePurchase = () => {
    alert("Thank you for your purchase!");
    clearCart();
  };

  const getCartTotals = () => {
    const baseTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    var hasdis = false;

    if (baseTotal >= 200) {
      hasdis = true;
      return {
        baseTotal: (baseTotal * (1 - 0.2)).toFixed(2),
        hasdis: hasdis,
      };
    } else {
      return {
        baseTotal: baseTotal.toFixed(2),
        hasdis: hasdis,
      };
    }
  };

  return (
    <Container>
      {/* // Cart Drawer */}
      <IconButton
        color="primary"
        onClick={toggleCart}
        sx={{ position: "fixed", top: 20, right: 20 }}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          Cart
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <List sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Shopping Cart
          </Typography>
          <Typography>
            {cartItems.length === 0
              ? "Add something to the cart to get started!"
              : ""}
          </Typography>
          {cartItems.map((item) => (
            <ListItem
              key={item.id}
              alignItems="flex-start"
              secondaryAction={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                  >
                    <Typography>-</Typography>
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                  >
                    <Typography>+</Typography>
                  </IconButton>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={item.title}
                  src={item.image}
                  variant="square"
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.title}
                secondary={`$${(item.price * item.quantity).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: 350,
            p: 2,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={clearCart}
            fullWidth
            sx={{ mb: 2 }}
          >
            Clear Cart
          </Button>
          {cartItems.length !== 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePurchase}
              fullWidth
              sx={{ mb: 2 }}
            >
              Purchase
            </Button>
          ) : null}
          <Typography variant="h6">
            {getCartTotals().hasdis ? "20% discount applied!" : ""}
          </Typography>
          <Typography variant="h6">
            Total: ${getCartTotals().baseTotal}
          </Typography>
        </Box>
      </Drawer>
      {/* // Products header */}
      <Typography variant="h1" component="h2" gutterBottom>
        Products
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
      {/* // Products grid */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4} key="product-grid">
          {Array.isArray(products) &&
            products.map((product) => {
              if (!product || !product.id) {
                console.warn("product is missing id", product);
                return null;
              }

              return (
                <Grid item key={`product-${product.id}`} xs={12} sm={6} md={4}>
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
                        {product.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.description}
                      </Typography>
                      <Typography variant="h6" color="textPrimary">
                        ${product.price}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleCartItems(product)}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      )}
    </Container>
  );
}
