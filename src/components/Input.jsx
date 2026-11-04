// src/components/Input.jsx
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon = null,
  error = null,
  required = false,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 ${
            icon ? 'pl-12' : ''
          } bg-white border-2 ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-base`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}