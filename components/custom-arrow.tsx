export function CustomArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="28"
      height="24"
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Long line */}
      <path
        d="M4 12 L18 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Arrow head with subtle curve */}
      <path
        d="M18 12 L22 8 M18 12 L22 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Circular container around arrow head */}
      <circle
        cx="20"
        cy="12"
        r="5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
