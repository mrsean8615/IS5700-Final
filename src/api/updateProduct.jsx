import axios from "axios";

const updateProduct = async (productId, updatedProduct) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/products/${productId}`,
      {
        product: updatedProduct,
      }
    );
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update product",
    };
  }
};

export default updateProduct;
