// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  permissions?: any[]; // hoặc RoleType[] nếu bạn có định nghĩa sẵn
  userRole?: any;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  method: 'jwt';
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  permissions?: any[]; // hoặc RoleType[] nếu bạn có định nghĩa sẵn
  userRole?: any;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
  initialize: () => void;
};
