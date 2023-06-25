import React from 'react'
import { TextField } from '@mui/material';

export default function Input(props: any) {

    const { name, label, value, error=null, onChange } = props;
    return (
        <TextField
            label={label}
            name={name}
            value={value}
            size="small"
            onChange={onChange}
            {...(error && {error:true,helperText:error})}
        />
    )
}