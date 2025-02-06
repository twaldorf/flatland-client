import { CiLocationArrow1 } from 'react-icons/ci'
import { ChangeToolCommand } from '../../../2D/commands/ChangeToolCommand'
import { pushCommand } from '../../../Command'

const handleClick = () => {
  pushCommand(new ChangeToolCommand("select"))
}

export const ToolIcon = () => {
  return (
    <li onClick={handleClick}>
      <CiLocationArrow1 />
    </li>
  )
}
