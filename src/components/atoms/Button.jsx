const Button = ({children, ...props}) => (
    <button {...props} className="btn btn-primary">{children}</button>
);
export default Button;