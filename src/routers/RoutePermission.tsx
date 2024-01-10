import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Forbidden } from "../screens/Forbidden/Forbidden";
import { AUTH } from "../models/";

export const RoutePermission = ({ path, element }: any) => {
  const SIDEBAR = useSelector(({ auth }: { auth: AUTH }) => auth.data.menu);
  /**
   *
   *
   * @param {*} path of component route to render
   * @return {*} Boolean
   */
  const getPermission = (path: any) => {
    return SIDEBAR?.flatMap((itemMenu) => itemMenu.categoryModule).find(
      (module) => module.moduleUrl === path
    )?.permission[0]["canView"];
  };

  return (
    <Routes>
      {getPermission(path) ? (
        <Route path={path} element={element} />
      ) : (
        <Route path={path} element={<Forbidden />} />
      )}
    </Routes>
  );
};
