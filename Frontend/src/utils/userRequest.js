// import axios from "axios";
// import Cookies from "js-cookie";
// import baseUrl from "./config";

// // const token = Cookies.get("accessToken");

// function getToken() {
//     const token = Cookies.get("accessToken");
//     return token || ""; // Return an empty string if token is undefined
// }
// const userRequest = axios.create({
//     baseURL: baseUrl,
//     headers: {
//         Authorization: `Bearer ${getToken()}`,
//     },
// });



// export default userRequest;


import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "./config";

let token = Cookies.get("accessToken");

function getToken() {
    return token || "";
}

const userRequest = axios.create({
    baseURL: baseUrl,
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
});

// Function to update the access token and headers
export const updateAccessToken = (newToken) => {
    token = newToken;
    userRequest.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
}

// export { updateAccessToken };

export default userRequest;