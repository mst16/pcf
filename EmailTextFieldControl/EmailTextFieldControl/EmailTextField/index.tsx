import React from "react";
import { IInputs } from "../generated/ManifestTypes";

export interface EmailTextFieldProps {
    context: ComponentFramework.Context<IInputs>;
    value?: string;
    onChange: (newValue?: string) => void;
    onClick?: (value?: string) => void;
    additionalClass?: string;
}

export const EmailTextField: React.SFC<EmailTextFieldProps> = (props): JSX.Element => {
    const [value, setValue] = React.useState(props.value);
    const onChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = ev.target.value;
            setValue(newValue);
            if (props.onChange) {
                props.onChange(newValue);
            }
        },
        [value]
    );
    const onClick = React.useCallback(
        (ev: React.MouseEvent<HTMLSpanElement>) => {
            if (props.onClick) {
                props.onClick(value);
            }
        },
        [value]
    );

    return (
        <div className={"EmailTextField " + props.additionalClass}>
            <input type="email" value={value} onChange={onChange} />
            <span aria-label={"Send new email to provided address " + value} role="button" tabIndex={0} className="symbolFont NewEmail-symbol" onClick={onClick} />
        </div>
    );
};

export default EmailTextField;