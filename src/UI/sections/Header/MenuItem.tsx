import { useState } from "react";

interface MenuItemProps {
  label: string;
  options: { name: string; action: () => void; }[];
}

const MenuItem = ({ label, options }: MenuItemProps) => {
  // TODO: Refactor to use store instead of local state
  const [open, setOpen] = useState(false);

  return (
    <div 
      className="relative bg-white py-1 px-2 cursor-pointer text-stone-800 hover:bg-blue-200"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {label}
      {open && (
        <ul className="absolute left-0 top-full bg-gray-800 text-white shadow-lg rounded w-40 z-50">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={option.action}
              className="px-4 py-2 hover:bg-blue-600 cursor-pointer"
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuItem;
