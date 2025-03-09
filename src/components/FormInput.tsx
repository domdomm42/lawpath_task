import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  type?: string;
  pattern?: string;
  required?: boolean;
  options?: Option[];
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
  options = [],
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>

      {type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required={required}
        >
          <option value="">Select a {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
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
      )}
    </div>
  );
}

export default FormInput;
