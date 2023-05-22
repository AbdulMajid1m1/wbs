import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "./config";

// const token = Cookies.get("accessToken");

function getToken() {
    const token = Cookies.get("accessToken");
    return token || ""; // Return an empty string if token is undefined
}
const userRequest = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
});



export default userRequest;