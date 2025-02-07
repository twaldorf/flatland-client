import { useAppState } from '../store';
import { listStyleNone } from '../styles/common'
import { PathIcon } from './toolbar/Pathicon'
import { ToolIcon } from './toolbar/ToolIcon'

export const Toolbar = ({}) => {

  const selectedTool = useAppState((state) => state.selectedTool);

  return (
    <div className="absolute m-4 my-auto h-50/100 bg-blue-400 p-2 rounded-md white top-1/2 bottom-1/2">
      <ul style={listStyle}>
        <ToolIcon active={ selectedTool == 'select' ? true : false }></ToolIcon>
        <PathIcon active={ selectedTool == 'path' ? true : false }></PathIcon>
      </ul>
    </div>
  )
}
const listStyle = {
  ...listStyleNone,
}
