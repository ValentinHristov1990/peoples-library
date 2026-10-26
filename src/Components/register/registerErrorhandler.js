import { useCallback, useRef, useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";

const REGISTER_FIELDS = ["username", "email", "password", "confirmPassword"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useRegisterValidation() {
  const formRef = useRef(null);
  const [serverError, setServerError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const resetFormErrors = useCallback(() => {
    setHasSubmitted(false);
    setServerError("");
  }, []);

  const { touched, setTouched, handleBlur, getInputStyle } = useFormValidation(
    formRef,
    REGISTER_FIELDS,
    resetFormErrors,
  );

  const validateUsername = (username) =>
    username.trim() !== "" && !username.includes("@");
  const validateEmail = (email) =>
    email.trim() !== "" && EMAIL_PATTERN.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateConfirm = (confirmPassword, password) =>
    confirmPassword !== "" && confirmPassword === password;

  const validateForm = ({ username, email, password, confirmPassword }) => {
    setServerError("");
    setHasSubmitted(true);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setServerError("All fields are required.");
      return false;
    }

    if (username.includes("@")) {
      setServerError('Username cannot contain "@"!');
      return false;
    }

    if (!validateEmail(email)) {
      setServerError("Please enter a valid email address!");
      return false;
    }

    if (!validatePassword(password)) {
      setServerError("Password must be at least 6 characters!");
      return false;
    }

    if (!validateConfirm(confirmPassword, password)) {
      setServerError("Passwords do not match!");
      return false;
    }

    return true;
  };

  return {
    formRef,
    touched,
    hasSubmitted,
    serverError,
    setServerError,
    handleBlur,
    getInputStyle,
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirm,
    validateForm,
  };
}
