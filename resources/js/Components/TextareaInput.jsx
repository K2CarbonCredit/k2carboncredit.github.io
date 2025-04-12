import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextareaInput(
    { className = '', isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'textarea textarea-bordered w-full ' +
                className
            }
            ref={input}
        ></textarea>
    );
});
