import { useCallback } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";

export const validateUsername = (username) =>
  username.trim() !== "" && !username.includes("@");
export const validateEmail = (email) =>
  email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (password) => password.length >= 6;
export const validateConfirm = (confirmPassword, password) =>
  confirmPassword !== "" && confirmPassword === password;

const REGISTER_FIELDS = ["username", "email", "password", "confirmPassword"];

export function useRegisterValidation(formRef, { setHasSubmitted, setServerError } = {}) {
  const resetFormErrors = useCallback(() => {
    setHasSubmitted?.(false);
    setServerError?.("");
  }, [setHasSubmitted, setServerError]);

  return useFormValidation(formRef, REGISTER_FIELDS, resetFormErrors);
}
