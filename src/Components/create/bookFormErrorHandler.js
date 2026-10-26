import { useCallback, useRef, useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";

const BOOK_FIELDS = ["title", "author", "description", "imageUrl"];

function isValidImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function useBookFormErrorHandler({ formData, imageUrl, useCustomUrl }) {
  const formRef = useRef(null);
  const [serverError, setServerError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const resetErrors = useCallback(() => {
    setHasSubmitted(false);
    setServerError("");
  }, []);

  const { touched, setTouched, handleBlur, getInputStyle } =
    useFormValidation(formRef, BOOK_FIELDS, resetErrors);

  const fieldErrors = {
    title: formData.title.trim() ? "" : "Book title is required!",
    author: formData.author.trim() ? "" : "Author is required!",
    description: formData.description.trim() ? "" : "Description is required!",
    imageUrl: !useCustomUrl
      ? ""
      : !imageUrl.trim()
        ? "Image URL is required!"
        : isValidImageUrl(imageUrl.trim())
          ? ""
          : "Please enter a valid image URL!",
  };

  const validateForm = () => {
    setServerError("");
    setHasSubmitted(true);
    setTouched(Object.fromEntries(BOOK_FIELDS.map((field) => [field, true])));

    if (Object.values(fieldErrors).some(Boolean)) {
      setServerError("Please correct the highlighted fields.");
      return false;
    }

    return true;
  };

  const isFieldVisible = (field) => touched[field] || hasSubmitted;
  const clearServerError = () => setServerError("");

  return {
    formRef,
    serverError,
    setServerError,
    hasSubmitted,
    fieldErrors,
    isFieldVisible,
    handleBlur,
    getInputStyle,
    validateForm,
    clearServerError,
  };
}
