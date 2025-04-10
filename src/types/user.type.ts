export type responseType = {};

export type UserType = {
  id: string | number;
  code: string;
  name: string;
  email: string;
  birthday: string;
  gender: string;
  avatar: any;
  phone: string;
  position: string;
  creator_id: string | number;
  created_at: string;
  updated_at: string;
  roles: any;
  created_by: any;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
