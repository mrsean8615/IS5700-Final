import React, { useState } from "react";
import { createNewProduct } from "../api/createNewProduct";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function CreateProduct() {
  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    product_type: "",
    image: "https://fakestoreapi.com/img/placeholder.jpg", // Default image
    inventory: "",
    published: true,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      published: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createNewProduct(product);
    if (result.success) {
      //   console.log("Product created successfully");
      navigate("/adminProduct");
    } else {
      console.error(result.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            required
            margin="normal"
            value={product.title}
            onChange={handleChange}
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            required
            margin="normal"
            value={product.price}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            required
            margin="normal"
            value={product.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Product Type</InputLabel>
            <Select
              name="product_type"
              value={product.product_type}
              label="Product Type"
              onChange={handleChange}
              required
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="men's clothing">Men's Clothing</MenuItem>
              <MenuItem value="women's clothing">Women's Clothing</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="image"
            label="Image URL"
            fullWidth
            margin="normal"
            value={product.image}
            onChange={handleChange}
          />
          <TextField
            name="inventory"
            label="Inventory"
            type="number"
            fullWidth
            required
            margin="normal"
            value={product.inventory}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={product.published}
                onChange={handleSwitchChange}
                name="published"
              />
            }
            label="Published"
            sx={{ mt: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Create Product
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
