const Label = ({
  className,
  htmlFor,
  children,
}: {
  className?: string;
  htmlFor: string;
  children?: string | React.ReactNode;
}) => {
  const style = `block ps-2 text-lg`;
  return (
    <label className={`${style} ${className}`} htmlFor={htmlFor}>
      {children}
    </label>
  );
};
export default Label;
