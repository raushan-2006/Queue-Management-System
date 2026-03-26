import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export default API;