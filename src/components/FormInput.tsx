import React from "react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  type?: string;
  pattern?: string;
  required?: boolean;
}

function FormInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "",
  maxLength,
  minLength,
  type = "text",
  pattern,
  required,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        required={required}
      />
    </div>
  );
}

export default FormInput;
