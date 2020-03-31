import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin, realAccountLogin } from '@/services/login';
import { setAuthority, setUserNameId } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(realAccountLogin, payload);

      const responseObj = {
        userName: '',
        userId: '',
        currentAuthority: 'admin',
        status: 'ok',
        type: 'account',
      };
      // debugger
      if (response.status === 400 || response.status === 'error') {
        responseObj.currentAuthority = 'guest';
        responseObj.status = 'error';
      } else {
        responseObj.currentAuthority = 'admin';
        responseObj.status = 'ok';
        responseObj.userId = response.userId;
        responseObj.userName = response.userName;
      }

      yield put({
        type: 'changeLoginStatus',
        payload: responseObj,
      });
      // Login successfully
      if (responseObj.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // debugger
      setAuthority(payload.currentAuthority);
      if (payload.userName) {
        setUserNameId(payload.userName, payload.userId);
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
