import { QueryClient } from "@tanstack/react-query";
import Axios from "axios";

export const baseURL = process.env["NEXT_PUBLIC_API_URL"];

Axios.defaults.baseURL = baseURL;
Axios.defaults.headers["x-api-key"] = process.env["SUPERBRIDGE_API_KEY"]!;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
