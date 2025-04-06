const DashboardBox = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        p-6
        flex
        flex-col
        h-full
        min-h-[300px]
        shadow-sm
        border
        border-gray-200/50
        transition-all
        duration-200
        ease-in-out
        hover:-translate-y-0.5
        hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default DashboardBox;
