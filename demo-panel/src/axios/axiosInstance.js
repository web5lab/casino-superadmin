import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5004",
});

export const paymentInstance = axios.create({
  baseURL: "http://localhost:5004",
});

axiosInstance.interceptors.response.use(
  function (config) {
    successMessage(config);
    return config;
  },
  (err) => errorFunction(err)
);

const successMessage = function (config) {
  const data = config?.data;
  const msg = data?.message;
  if (msg && data?.success) {
    console.log(msg);
  }
};

const errorFunction = function (error) {
  const message = error?.response?.data?.message;
  if (message) {
    console.log(message);
  }
  throw error;
};

export default axiosInstance;
