import axios from "axios";

const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/products/${productId}`
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete product",
    };
  }
};

export default deleteProduct;
