const isProd = import.meta.env.PROD;

const APIConfig = {
  baseUrl: !isProd
    ? "https://localhost:7253/api/"
    : "https://vue-demo-api.azurewebsites.net/api/",
};

export default APIConfig;
