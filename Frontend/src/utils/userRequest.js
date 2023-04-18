import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "./config";

const token = Cookies.get("userToken");
const newRequest = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default newRequest;