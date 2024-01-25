import { QueryClient } from "@tanstack/react-query";
import Axios from "axios";

export const baseURL = process.env["NEXT_PUBLIC_API_URL"];

Axios.defaults.baseURL = baseURL;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
