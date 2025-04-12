export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `label ` +
                className
            }
        >
            {value ? <span className={`label-text text-base-content`}>{value}</span> : children}
        </label>
    );
}
