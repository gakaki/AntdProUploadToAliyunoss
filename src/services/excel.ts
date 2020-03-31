import request from '@/utils/request';
import { ExcelListParams } from '@/pages/ExcelDefine';

export const basePath = `http://test.data.wecare.medtreehealth.com`;
// const basePath = `http://127.0.0.1:3001`

export async function queryFiles(params?: ExcelListParams) {
  // eslint-disable-next-line no-param-reassign
  const res = await request(`${basePath}/files`, {
    method: 'get',
    headers: {
      userId: `${params?.userId || 0}`,
    },
  });
  // console.log(res)
  return {
    data: res,
    success: true,
    total: res.length,
  };
}

export async function saveFilesUploadResult(userId: number = 0, json: any): Promise<any> {
  return request(`${basePath}/file`, {
    method: 'post',
    headers: {
      userId: `${userId}`,
    },
    data: json,
  });
}
export async function login(userName: string, password: string): Promise<any> {
  return request(`${basePath}/login`, {
    data: {
      username: userName,
      password: password,
    },
  });
}

export async function getOSSSign(userId: number = 0): Promise<any> {
  return request(`${basePath}/OSSToken`, {
    method: 'get',
    headers: {
      userId: `${userId}`,
    },
  });
}
