import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = ({ size = "medium", color = "blue" }) => {
  // Size classes
  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl"
  };

  // Color classes
  const colorClasses = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600"
  };

  return (
    <div className="flex justify-center items-center">
      <FaSpinner 
        className={`text-gray-300 animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;