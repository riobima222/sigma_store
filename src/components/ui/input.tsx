interface InputProps {
  className?: string;
  id: string;
  type: string;
  name: string;
  placeholder?: string;
  pattern?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  onChange?: (e: any) => any;
  onClick?: (e:any) => any;
}
const Input = (props: InputProps) => {
  const {
    className,
    pattern,
    id,
    type,
    name,
    placeholder,
    defaultValue,
    value,
    defaultChecked,
    disabled,
    required,
    onChange,
    onClick,
  } = props;
  const style = `bg-slate-100 w-full px-2 py-1 focus:outline-none text-sm`;
  return (
    <input
      onChange={onChange}
      id={id}
      className={`${style} ${className}`}
      type={type}
      name={name}
      placeholder={placeholder}
      pattern={pattern}
      defaultValue={defaultValue}
      disabled={disabled}
      value={value}
      defaultChecked={defaultChecked}
      required={required}
      onClick={onClick}
    />
  );
};
export default Input;
