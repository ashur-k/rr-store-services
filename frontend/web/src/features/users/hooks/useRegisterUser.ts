import { useMutation } from "@tanstack/react-query";

import { useAuth } from "../../auth/useAuth";
import { registerUser } from "../api/registerUser";

export function useRegisterUser() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      await login();
    },
  });
}
