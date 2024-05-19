import qs from "qs";

const baseURL = process.env["NEXT_PUBLIC_API_URL"];

export const customInstance = async <T>({
  url,
  method,
  params,
  data,
  headers,
  signal,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: any;
  data?: any;
  headers?: HeadersInit;
  signal?: AbortSignal;
}): Promise<T> => {
  const searchParams = params ? `?${qs.stringify(params, {})}` : "";

  const next: NextFetchRequestConfig = {
    revalidate: url.includes("deployments") ? 0 : 60,
  };

  const response = await fetch(`${baseURL}${url}${searchParams}`, {
    method,
    headers,
    signal,
    ...(data ? { body: JSON.stringify(data) } : {}),
    next,
  });

  return response.json();
};

export default customInstance;
