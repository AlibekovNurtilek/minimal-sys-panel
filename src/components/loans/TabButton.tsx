const TabButton: React.FC<{ title: string; active: boolean; onClick: () => void }> = ({ title, active, onClick }) => (
  <button
    className={`px-6 py-2 text-lg font-medium ${active ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-600 hover:text-blue-500"}`}
    onClick={onClick}
  >
    {title}
  </button>
);

export default TabButton