import React from "react";
import { TextField } from "@mui/material";

interface InputProps {
  type: string;
  name: string;
  label: string;
  value: string;
  size: "small" | "medium";
  required: boolean;
  disabled?: boolean;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function Input(props: InputProps) {
  const {
    type,
    name,
    label,
    value,
    size,
    required,
    error = null,
    onChange,
    inputRef,
  } = props;

  return (
    <TextField
      type={type}
      label={label}
      name={name}
      value={value}
      size={size}
      onChange={onChange}
      required={required}
      inputRef={inputRef}
      {...(error && { error: true, helperText: error })}
    />
  );
}
