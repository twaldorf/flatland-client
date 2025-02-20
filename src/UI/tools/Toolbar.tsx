import { useAppState } from '../store';
import { listStyleNone } from '../styles/common'
import { PathIcon } from './toolbar/Pathicon'
import { ToolIcon } from './toolbar/ToolIcon'

export const Toolbar = ({}) => {

  const selectedTool = useAppState((state) => state.selectedTool);

  return (
    <div className="bg-blue-400 p-2 rounded-md white flex flex-row">
      <ul style={listStyle} className='flex-row flex'>
        <ToolIcon active={ selectedTool == 'select' ? true : false }></ToolIcon>
        <PathIcon active={ selectedTool == 'path' ? true : false }></PathIcon>
      </ul>
    </div>
  )
}
const listStyle = {
  ...listStyleNone,
}
