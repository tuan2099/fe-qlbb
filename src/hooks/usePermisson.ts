import { useMemo } from 'react';

interface Permission {
  id: number;
  code: string;
  name: string;
}

export function usePermission(userPermissions: number[], allPermissions: Permission[]) {
  // Tạo danh sách các quyền mà user có
  const userPermissionCodes = useMemo(() => {
    return allPermissions
      .filter((perm) => userPermissions.includes(perm.id)) // Lọc các quyền user có
      .map((perm) => perm.code); // Chỉ lấy code của quyền
  }, [userPermissions, allPermissions]);

  // Hàm kiểm tra user có quyền cụ thể không
  const hasPermission = (code: string) => userPermissionCodes.includes(code);

  return { hasPermission };
}
