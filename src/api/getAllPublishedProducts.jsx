import axios from "axios";

const getAllPublishedProducts = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/products/published"
    );
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default getAllPublishedProducts;
