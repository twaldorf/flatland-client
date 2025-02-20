import { CiSquarePlus } from "react-icons/ci";


export interface TabsProps {
  activeTab: string;
  tabs: string[];
  onTabChange: (tab: string) => void;
}

export const Tabs = ({ activeTab, tabs, onTabChange }: TabsProps) => {
  return (
    <section className="flex m-0  px-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2  ${
            activeTab === tab ? "border-b-2 border-blue-500 font-bold bg-white " : "text-gray-500 bg-stone-200"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
      <button
          className={`px-4 py-2 bg-amber-400 text-white`}
          onClick={() => newDocument }
        >
          <CiSquarePlus strokeWidth="1.5"/>
        </button>
    </section>
  );
};
