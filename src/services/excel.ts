import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/login');
}

//获取上传历史记录
export async function listFiles(): Promise<any> {
  return request('/files');
}

//保存文件上传历史记录
export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}


//OSS sign API
export async function getOSSSign(userId:string): Promise<any> {
  return request('/OSSToken');
}

// /https://doc.rdc.aliyun.com/docs/ethviz00/sMscb9uLIoGm

/*
  name: aaa
  psw: 111

  name: bbb
  psw: 222
*/