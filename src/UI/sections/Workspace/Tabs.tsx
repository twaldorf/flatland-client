
import { useAppState } from "../../store";
import { MouseEventHandler } from "react";
import { CiEdit } from "react-icons/ci";

export const Tabs = () => {

  const tabs = useAppState(s => s.openProjectTitles);
  const activeTab = useAppState(s => s.activeProjectTitle);
  const showModal = useAppState(s => s.showModal);

  function newDocument() {
    useAppState(state => state.showModal)("New Project");
  };

  function onTabClick() {
    showModal("Edit Project Info");
  };

  console.log(tabs)

  return (
    <section className="flex m-0  px-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 flex flex-row items-center justify-between ${
            activeTab === tab ? "border-b-2 border-blue-500 font-bold bg-white " : "text-gray-500 bg-stone-200"
          }`}
          onClick={onTabClick}
        >
          {tab}
          <CiEdit></CiEdit>
        </button>
      ))}
      {/* <button
          className={`px-4 py-2 bg-amber-400 text-white`}
          // onClick={ newDocument }
        >
          <CiSquarePlus strokeWidth="1.5"/>
        </button> */}
    </section>
  );
};
