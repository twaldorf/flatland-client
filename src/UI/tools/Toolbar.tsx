import { listStyleNone } from '../styles/common'
import { ToolIcon } from './toolbar/ToolIcon'

export const Toolbar = ({}) => {
  return (
    <div className="absolute m-4 my-auto h-50/100 bg-blue-400 p-4 rounded-xl white top-1/2 bottom-1/2">
      <ul style={listStyle}>
        <ToolIcon></ToolIcon>
      </ul>
    </div>
  )
}
const listStyle = {
  ...listStyleNone,
}
