import { CiLocationArrow1, CiPen, CiRuler } from 'react-icons/ci'
import { ChangeToolCommand } from '../../../2D/commands/ChangeToolCommand'
import { pushCommand } from '../../../Command'

const handleClick = () => {
  pushCommand(new ChangeToolCommand("measure"))
}

export const MeasureIcon = ( { active } ) => {
  return (
    <li
      onClick={handleClick}
      className={`p-2 rounded text-3xl ${ active ? 'bg-blue-700 text-white' : 'text-white'}`}
    >
      <CiRuler  strokeWidth={ active ? 1 : 0 } />
    </li>
  )
}
