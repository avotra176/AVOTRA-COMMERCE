import axios from "axios";

export const API_URL = "http://10.24.118.152:3000";
const api = axios.create({ baseURL: API_URL, headers: { "Content-Type": "application/json", } })

export default api;