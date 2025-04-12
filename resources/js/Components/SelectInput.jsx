import React from 'react';

export default function SelectInput({ className = '', ...props }) {
    return (
        <select
            {...props}
            className={
                'select select-bordered w-full ' +
                className
            }
        >
            {props.children}
        </select>
    );
}
