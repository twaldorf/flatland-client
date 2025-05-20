interface adjusterProps {
  default: number;
  step: number;
  frac?: boolean;
  width?: number;
  dir?:string;
}

export const NumericAdjuster = (props:adjusterProps) => {
  return (
    <input type="number" dir={props.dir ? props.dir : 'rtl'} defaultValue={props.default} min="0" step={props.step} style={{width: props.width ? `${props.width}rem` : '3rem', textAlign: props.dir === 'ltr' ? 'left' : 'right'}}></input>
  )
}