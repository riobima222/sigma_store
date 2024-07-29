const Alert = ({
  alert,
  alertMessage,
}: {
  alert: boolean;
  alertMessage: string;
}) => {
  return (
    <div
      role="alert"
      className={`${
        alert ? "block" : "hidden"
      } alert alert-success bg-slate-300 border-none fixed bottom-2 right-0 h-[2.7em] flex items-center px-3 max-w-[40em]`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{alertMessage}</span>
    </div>
  );
};
export default Alert;
