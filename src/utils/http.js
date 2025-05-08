import axios from "axios";

const axiosParams = {
  // Set different base URL based on the environment
  baseURL:
    process.env.NODE_ENV === "development" ? "http://10.7.0.4:8808" : "/",
};

// Create axios instance with default params
const axiosInstance = axios.create(axiosParams);

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Bearer token to Authorization header if available
    const user = JSON.parse(localStorage.getItem("user") || null); // Add fallback to prevent errors
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user?.token}`;
    }
    // Add CORS headers if needed
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle response data
    console.log("Response Interceptor:", response);
    return response.data;
  },
  (error) => {
    // Handle response error
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export const didAbort = (error) => axios.isCancel(error) && { aborted: true };

const getCancelSource = () => axios.CancelToken.source();

export const isApiError = (error) => axios.isAxiosError(error);

const withAbort = (fn) => {
  const executor = async (...args) => {
    const originalConfig = args[args.length - 1];
    const { abort, ...config } = originalConfig;

    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn(url, body, config);
      } else {
        const [url] = args;
        return await fn(url, config);
      }
    } catch (error) {
      console.log("api error", error);

      if (didAbort(error)) {
        error.aborted = true;
      }

      throw error;
    }
  };

  return executor;
};

const withLogger = async (promise) =>
  promise.catch((error) => {
    /*
     *Always log errors in dev environment
     *if (process.env.NODE_ENV !== 'development') throw error
     */

    // Log error only if REACT_APP_DEBUG_API env is set to true
    if (!process.env.REACT_APP_DEBUG_API) throw error;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
    throw error;
  });

const http = (axios) => {
  return {
    get: (url, config = {}) => withLogger(withAbort(axios.get)(url, config)),
    delete: (url, config = {}) =>
      withLogger(withAbort(axios.delete)(url, config)),
    post: (url, body, config = {}) =>
      withLogger(withAbort(axios.post)(url, body, config)),
    patch: (url, body, config = {}) =>
      withLogger(withAbort(axios.patch)(url, body, config)),
    put: (url, body, config = {}) =>
      withLogger(withAbort(axios.put)(url, body, config)),
  };
};

export default http(axiosInstance);