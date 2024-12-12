import axios from "axios";

const getAllProducts = async () => {
  try {
    const response = await axios.get("http://localhost:3000/products/all");
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default getAllProducts;
