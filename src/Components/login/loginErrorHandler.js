import { useCallback, useRef, useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";

const LOGIN_FIELDS = ["email", "password"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLoginErrorHandler() {
  const formRef = useRef(null);
  const [serverError, setServerError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const resetErrors = useCallback(() => {
    setHasSubmitted(false);
    setServerError("");
  }, []);

  const { touched, setTouched, handleBlur, getInputStyle } =
    useFormValidation(formRef, LOGIN_FIELDS, resetErrors);

  const emailIsValid = (email) => EMAIL_PATTERN.test(email.trim());
  const passwordIsValid = (password) => password.trim() !== "";

  const validateCredentials = (email, password) => {
    setServerError("");
    setHasSubmitted(true);
    setTouched({ email: true, password: true });

    if (!emailIsValid(email) || !passwordIsValid(password)) {
      setServerError("Please correct the highlighted fields.");
      return false;
    }

    return true;
  };

  const clearServerError = () => setServerError("");

  return {
    formRef,
    touched,
    hasSubmitted,
    serverError,
    setServerError,
    handleBlur,
    getInputStyle,
    emailIsValid,
    passwordIsValid,
    validateCredentials,
    clearServerError,
  };
}
