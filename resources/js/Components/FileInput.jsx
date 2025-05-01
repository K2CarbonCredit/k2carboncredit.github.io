import React, { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function FileInput(
    { type = 'file', name, id, className, required, isFocused = false, onChange, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            type={type}
            name={name}
            id={id}
            className={
                `file-input file-input-bordered w-full ${className}`
            }
            ref={input}
            required={required}
            onChange={(e) => onChange(e)}
            {...props}
        />
    );
});
