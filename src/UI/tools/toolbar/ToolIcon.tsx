import { CiLocationArrow1 } from 'react-icons/ci'
import { ChangeToolCommand } from '../../../2D/commands/ChangeToolCommand'
import { pushCommand } from '../../../Command'

const handleClick = () => {
  pushCommand(new ChangeToolCommand("select"))
}

export const ToolIcon = ( { active } ) => {
  return (
    <li
      onClick={handleClick}
      className={`p-2 rounded text-3xl ${active ? 'bg-blue-700 text-white' : 'text-white'}`}
    >
      <CiLocationArrow1 strokeWidth={ active ? 1.5 : 0 } />
    </li>
  )
}
