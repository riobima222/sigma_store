const Label = ({
  className,
  htmlFor,
  children,
  onClick,
}: {
  className?: string;
  htmlFor: string;
  children?: string | React.ReactNode;
  onClick?: (e: any) => any;
}) => {
  const style = `block ps-2 text-lg`;
  return (
    <label
      onClick={onClick}
      tabIndex={0}
      className={`${style} ${className}`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};
export default Label;
