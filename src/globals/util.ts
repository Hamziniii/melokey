import Cookies from "js-cookie";

export const getEmail = () => {
  return JSON.parse(Cookies.get("user") || "{}").email;
}