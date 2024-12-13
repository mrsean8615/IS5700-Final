import axios from "axios";
const loginAdmin = async (username, password) => {
  const response = await axios.get("http://localhost:3000/admin");
  const result = response.data;

  for (const admin of Object.values(result)) {
    if (admin.username === username && admin.password === password) {
      return true;
    } else {
      return false;
    }
  }
};

export { loginAdmin };
