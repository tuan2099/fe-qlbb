import { useMemo } from 'react';

interface Permission {
  id: number;
  code: string;
  name: string;
}

export function usePermission(userPermissions: any[], allPermissions: any[]) {
  // Tạo danh sách các quyền mà user có
  const userPermissionCodes = useMemo(() => {
    return allPermissions
      .filter((a) => userPermissions.some((b) => b.id === a.id))
      .map((item) => item.code);
  }, [userPermissions, allPermissions]);
  // console.log(userPermissionCodes);

  // console.log(userPermissions);
  // console.log(allPermissions);

  // Hàm kiểm tra user có quyền cụ thể không
  const hasPermission = (code: string) => userPermissionCodes.includes(code);

  return { hasPermission };
}
