import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AUTH } from '../models/';

export const usePermission = (url: string, permission: 'canView' | 'canCreate' | 'canEdit') => {
  const [hasPermission, setHasPermission] = useState(false);
  const SIDEBAR = useSelector(({ auth }: { auth: AUTH }) => auth.data.menu);

  useEffect(() => {
    const newHasPermission = SIDEBAR?.flatMap((itemMenu) => itemMenu.categoryModule).find(
      (module) => module?.moduleUrl === `/${url}`,
    ).permission[0][permission];
    setHasPermission(newHasPermission);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SIDEBAR]);

  return hasPermission;
};
