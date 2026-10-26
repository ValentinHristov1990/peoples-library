import { useEffect, useState } from "react";

export function useFormValidation(formRef, fieldNames, onOutsideClick) {
  const [touched, setTouched] = useState(() =>
    Object.fromEntries(fieldNames.map((field) => [field, false])),
  );
  useEffect(() => {
    const resetValidation = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setTouched(Object.fromEntries(fieldNames.map((field) => [field, false])));
        onOutsideClick?.();
      }
    };

    document.addEventListener("mousedown", resetValidation);
    return () => document.removeEventListener("mousedown", resetValidation);
  }, [formRef, fieldNames, onOutsideClick]);

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const getInputStyle = (isValid, field, hasSubmitted) => {
    if (!touched[field] && !hasSubmitted) return {};

    return {
      borderColor: isValid ? "#4caf50" : "#e53935",
      boxShadow: isValid
        ? "0 0 5px rgba(76, 175, 80, 0.3)"
        : "0 0 5px rgba(229, 57, 53, 0.3)",
    };
  };

  return { touched, setTouched, handleBlur, getInputStyle };
}
