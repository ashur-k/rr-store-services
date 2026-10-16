import { isAxiosError } from "axios";

const statusMessages: Record<number, string> = {
  400: "The request contains invalid data.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested user could not be found.",
  409: "This action conflicts with the current state of the user.",
  429: "Too many requests. Please try again shortly.",
  500: "A server error occurred. Please try again later.",
  502: "The server received an invalid response from a dependent service.",
  503: "A required service is temporarily unavailable.",
  504: "A required service took too long to respond.",
};

export function getApiErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return "An unexpected error occurred. Please try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Check your connection and try again.";
  }

  const data = error.response.data as
    { detail?: unknown; message?: unknown } | undefined;

  // Prefer the meaningful message returned by the backend.
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return (
    statusMessages[error.response.status] ??
    "Something went wrong. Please try again."
  );
}
