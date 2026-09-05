import api from "../../lib/apiClient";

export async function fetchMe() {
  const { data } = await api.get("/me/");
  return data;
}