import axios from "axios";
const getProductBySearch = async (search) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/products/published`
    );

    const products = response.data.products || [];

    const data = products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );

    return { products: data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [] };
  }
};

export default getProductBySearch;
