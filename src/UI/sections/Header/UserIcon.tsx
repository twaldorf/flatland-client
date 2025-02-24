import { useState } from "react";

interface User {
  name: string;
  avatarUrl: string;
}

interface UserIconProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const UserIcon = ({ user, onLogin, onLogout }: UserIconProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      {user ? (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={user.avatarUrl}
            alt="User avatar"
            className="w-8 h-8 border border-gray-500"
          />
          <span className="text-white font-medium">{user.name}</span>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
        >
          Log In
        </button>
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && user && (
        <ul className="absolute right-0 mt-2 bg-gray-800 text-white shadow-lg w-32 z-50">
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
            Profile
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
            Settings
          </li>
          <li
            className="px-4 py-2 hover:bg-red-600 cursor-pointer"
            onClick={onLogout}
          >
            Log Out
          </li>
        </ul>
      )}
    </div>
  );
};
