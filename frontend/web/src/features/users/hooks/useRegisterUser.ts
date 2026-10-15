
import { useMutation } from "@tanstack/react-query";

import { registerUser } from "../api/registerUser";
import { useAuth } from "../../auth/useAuth";

export function useRegisterUser() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      await login();
    },
  });
}
