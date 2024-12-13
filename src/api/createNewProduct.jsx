import axios from "axios";

const createNewProduct = async (productData) => {
  try {
    // console.log("Sending product data:", productData);

    const response = await axios.post("http://localhost:3000/products", {
      product: {
        title: productData.title,
        description: productData.description,
        price: parseFloat(productData.price),
        product_type: productData.product_type,
        image:
          productData.image || "https://fakestoreapi.com/img/placeholder.jpg",
        inventory: parseInt(productData.inventory),
        published: productData.published,
      },
    });

    // console.log("Server response:", response.data);

    return {
      success: true,
      message: response.data.message,
      product: response.data.product,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create product",
      product: null,
    };
  }
};

export { createNewProduct };
