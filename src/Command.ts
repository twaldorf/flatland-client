// The Command interface and class is responsible for managing incoming user commands that affect state, with some exception (camera position)
// The Command Queue is a list of all incoming commands yet to be executed
// The command History is a list of all previously executed commands
// the command Future is a list of all commands that have been Undone, i.e., taken from History. Future is not yet implemented

export interface Command {
  do(): void;
  undo(): void;
}

export const pushCommand = (command:Command) => {
  queue.add(command);
}

export function executeCommands() {
  while (queue.__size > 0) {
    const cmd = queue.pop();
    if (cmd) {
      cmd.do();
      queue.addHistory(cmd);
    }
  }
}

export function undoCommands() {
  const cmd = queue.popHistory();
  if (cmd) {
    cmd.undo();
  }
}

// Invoker function for storing and invoking commands
// Not used, and not really needed, a bit too elaborate
// export const Invoker = () => {
//   const __queue = new CQueue();
//   const __list:Command[] = [];
//   var __index:number = 0;

//   return {
//     addCommandToQueue: __queue.add,
//     invokeNextCommand: function ()  {
//       const cmd = __queue.pop();

//       if (cmd) {
//         cmd.do();
//         __list.push(cmd);
//         __index++;
//       }
//     }
//   }
// }


// Queue structure for holding Commands
class CQueue {
  private __items:Array<Command>;
  public __size:number;
  private __index:number;

  private __history:Command[];
  private __hsize:number;
  private __hindex:number;

  public length:number;

  // TODO: Implement Redo (as Future and fsize and findex)

  constructor() {
    this.__items = [];
    this.__size = 0;
    this.__index = 0;
    this.__history = [];
    this.__hsize = 0;
    this.__hindex = 0;
  }

  // Not currently used, not currently needed
  private resize(index) {
    const newArr:Array<Command> = [];
    for (let i = index; i < this.__size; ++i) {
      newArr.push(this.__items[i])
    }
    this.__items = newArr;
    this.__size = newArr.length;
    this.__index = 0;
  }

  public add(item:Command): void {
    this.__items.push(item);
    this.__size++;
  }

  public pop(): false | Command {
    if (this.__size < 1) {
      return false;
    }

    this.__size--;

    const index = this.__index;
    this.__index++;

    return this.__items[index];
  }

  public addHistory(item:Command): void {
    this.__history.push(item);
    this.__hsize++;
  }

  public popHistory(): false | Command {
    const cmd = this.__history.pop();
    this.__hsize--;

    if (cmd) {
      return cmd;
    } else return false;
    
  }

}

const queue = new CQueue();
