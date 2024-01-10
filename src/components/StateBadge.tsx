export const StateBadge = ({ state, label }: any) => {
  const colorState = (state: any) => {
    switch (state) {
      case "success":
        return " bg-green-100 text-green-800";

      case "danger":
        return " bg-red-100 text-red-800";

      case "warning":
        return " bg-yellow-100 text-yellow-800";

      case "info":
        return " bg-blue-100 text-blue-800";

      default:
        return "";
    }
  };
  return (
    <>
      <span
        className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorState(
          state
        )}`}
      >
        {label}
      </span>
    </>
  );
};
