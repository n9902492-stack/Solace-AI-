const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function authRequest<T>(path: string, body?: object, token?: string, method = body ? "POST" : "GET"): Promise<T> {
  if (!baseUrl) throw new Error("Set EXPO_PUBLIC_API_URL to connect to Solace.");
  const response = await fetch(baseUrl + path, {
    method,
    headers: {
      ...(body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new ApiError(data.error ?? "Please try again.", response.status);
  return data;
}
