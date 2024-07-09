interface Props {
  type: "submit" | "button";
  disabled?: boolean;
  className?: string;
  children: any;
  onClick?: () => void;
}

const Button = (props: Props) => {
  const { type, disabled, className, children, onClick = () => {} } = props;
  const style = `h-12 w-full bg-black text-white rounded-md mt-3`;
  return (
    <button
      className={`${style} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default Button;
