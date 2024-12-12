import { useState, useEffect } from "react";
import getAllProducts from "../common/getAllProducts";
import getProductByType from "../common/getProductByType";
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
  Button,
} from "@mui/material";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    if (event.target.value === "all") {
      getAllProducts().then((data) => {
        setProducts(data.products);
      });
    } else {
      getProductByType(event.target.value.toLowerCase()).then((data) => {
        setProducts(data.products);
      });
    }
  };

  const filteredProducts =
    category === "all"
      ? Object.values(products)
      : Object.values(products).filter(
          (product) => product.category === category
        );

  return (
    <Container>
      <Typography variant="h1" component="h2" gutterBottom>
        Products
      </Typography>
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
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4} key="product-grid">
          {Array.isArray(filteredProducts) &&
            filteredProducts.map((product) => {
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
                      <Button size="small" color="primary">
                        Add to Cart
                      </Button>
                      <Button size="small" color="primary">
                        View Details
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
