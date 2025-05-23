type PropsComponent = {
  toggleVisibility: () => void;
  isPasswordVisible: boolean;
};
export default function ShowHidePassword({
  toggleVisibility,
  isPasswordVisible,
}: PropsComponent) {
  
  return (
    <div
      onClick={toggleVisibility}
      className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-teal-500 focus:outline-none cursor-pointer"
      aria-label="Toggle Password Visibility"
    >
      {isPasswordVisible ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223a11.043 11.043 0 00-.916 1.014C2.279 10.268 2.279 13.732 3.064 15.762c1.274 4.057 5.065 7 9.542 7s8.268-2.943 9.542-7a11.038 11.038 0 00-.916-1.014M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.67 6.67l10.66 10.66"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.99 3.057-4.782 7-9.542 7-4.478 0-8.269-3.943-9.542-7z"
          />
        </svg>
      )}
    </div>
  );
}
