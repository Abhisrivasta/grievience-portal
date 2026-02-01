const Button = ({ children, loading, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
    >
      {loading ? "Submitting..." : children}
    </button>
  );
};

export default Button;
