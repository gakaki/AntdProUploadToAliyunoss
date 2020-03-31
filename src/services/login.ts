import request from '@/utils/request';
import { ExcelListParams } from '@/pages/ExcelDefine';
import { basePath } from '@/services/excel';

export interface LoginParamsType {
  userName: string;
  username: string; // server
  password: string;
  mobile: string;
  captcha: string;
}

export async function realAccountLogin(params: LoginParamsType) {
  // eslint-disable-next-line no-param-reassign
  params.username = params.userName;

  return request(`${basePath}/login`, {
    method: 'POST',
    data: params,
  });
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
