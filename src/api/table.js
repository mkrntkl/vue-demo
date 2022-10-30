import axios from "axios";
import APIConfig from "./config";

export async function getTables() {
  return axios.get(`${APIConfig.baseUrl}table/`);
}

export async function getTable(id) {
  return axios.get(`${APIConfig.baseUrl}table/${id}`);
}

export async function postTable(data) {
  return axios.post(`${APIConfig.baseUrl}table/`, data);
}
