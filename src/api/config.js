const isProd = import.meta.env.PROD;

const APIConfig = {
  baseUrl: !isProd ? "https://localhost:7253/api/" : "https://myapiurl/api/",
};

export default APIConfig;
