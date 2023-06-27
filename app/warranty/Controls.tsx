import React from "react";
import { TextField } from "@mui/material";

interface InputProps {
  type: string;
  name: string;
  label: string;
  value: string;
  size: "small" | "medium";
  required: boolean;
  error?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  const { type, name, label, value, size, required, error = null, onChange } = props;

  return (
    <TextField
      type={type}
      label={label}
      name={name}
      value={value}
      size={size}
      onChange={onChange}
      required={required}
      {...(error && { error: true, helperText: error })}
    />
  );
}
