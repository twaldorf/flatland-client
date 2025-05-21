import { useState } from "react";

interface adjusterProps {
  default?: number;
  value: number;
  step: number;
  frac?: boolean;
  width?: number;
  dir?:string;
  onChange?: (value:number) => void;
}

export const NumericAdjuster = (props:adjusterProps) => {

  // const [ currentValue, setValue ] = useState(props.default); // what is this for what was I doing

  const handleChange = (value: number) => {
    // setValue(value);
    if (props.onChange) props.onChange(value);
  }

  return (
    <input 
      type="number" 
      dir={props.dir ? props.dir : 'rtl'}
      defaultValue={props.default}
      value={props.value}
      min="0" 
      step={props.step}
      onChange={(e) => handleChange(parseFloat(e.target.value))} // TODO: Handle integer cases
      style={{width: props.width ? `${props.width}rem` : '3rem', textAlign: props.dir === 'ltr' ? 'left' : 'right'}}
    ></input>
  )
}