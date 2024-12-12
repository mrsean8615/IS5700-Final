import axios from "axios";

const getProductByType = async (type) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/products/all?groupBy=${type}`
    );
    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default getProductByType;
