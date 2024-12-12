import axios from "axios";

const getAllProducts = async () => {
  return axios
    .get("http://localhost:3000/api/products")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export default getAllProducts;
