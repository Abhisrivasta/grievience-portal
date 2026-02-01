const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
};

export default Input;
