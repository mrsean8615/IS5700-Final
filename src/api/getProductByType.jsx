import axios from "axios";

const getProductByType = async (type) => {
  try {
    //groupby type kept giving me an error so I had to use a different approach
    const response = await axios.get(
      `http://localhost:3000/products/published`
    );

    const products = response.data.products || [];

    const data = products.filter(
      (product) => product.product_type?.toLowerCase() === type.toLowerCase()
    );

    return { products: data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [] };
  }
};

export default getProductByType;
