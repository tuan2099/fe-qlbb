import { createContext, useEffect, useReducer, useCallback } from 'react';
import axios from '../utils/axios';
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
    userRole: any;
    permissions: any[];
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  userRole: null,
  permissions: [],
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  switch (action.type) {
    case Types.INITIAL:
      return {
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        userRole: action.payload.userRole,
        permissions: action.payload.permissions,
      };
    case Types.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case Types.REGISTER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case Types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userRole: null,
        permissions: [],
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchAllPermissions = async (): Promise<any[]> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];
    let allData: any[] = [];
    let hasNext = true;
    let page = '';
    while (hasNext) {
      const response = await axios.get('/permission', {
        params: {
          page,
          limit: 100,
        },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(response);

      const data = response.data?.response.data || [];
      allData = [...allData, ...data];
      // console.log('allData', allData);
      if (data.length < 100) {
        hasNext = false;
      } else {
      }
    }

    return allData;
  };

  const initialize = useCallback(async () => {
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
      const expiresTime = typeof window !== 'undefined' ? localStorage.getItem('expiresTime') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken, expiresTime);

        const profileRes = await axios.get('/auth/profile');
        const user = profileRes.data.response[0];
        console.log(user.roles[0].id);

        const [userRoleRes, permissions] = await Promise.all([
          axios.get(`/role/${user.roles[0].id}`),
          fetchAllPermissions(),
        ]);

        // console.log('userRoleRes', userRoleRes);
        // console.log('permissions', permissions);

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user,
            userRole: userRoleRes.data.response[0].permissions,
            permissions,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
            userRole: null,
            permissions: [],
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
          userRole: null,
          permissions: [],
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });
    const { access_token, user, expires_at } = response.data.response[0];

    setSession(access_token, expires_at);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  };

  // REGISTER
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.REGISTER,
      payload: {
        user,
      },
    });
  };

  // LOGOUT
  const logout = async () => {
    setSession(null, null);
    dispatch({
      type: Types.LOGOUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        loginWithGoogle: () => { },
        loginWithGithub: () => { },
        loginWithTwitter: () => { },
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
