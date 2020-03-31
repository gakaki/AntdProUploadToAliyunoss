import React, { ChangeEvent, useEffect, useRef } from 'react';
import styles from './Excel.less';
import { Row, Col, Divider, Dropdown, Menu } from 'antd';
import { message, Button, Card } from 'antd';
import { useState } from 'react';
import OSS, { MultipartUploadOptions } from 'ali-oss';
import request from 'umi-request';
import { queryFiles, saveFilesUploadResult, login, getOSSSign } from '@/services/excel';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { TableListItem } from '@/pages/ListTableList/data';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table/interface';
import { queryRule } from '@/pages/ListTableList/service';

import { ExcelListItem } from '@/pages/ExcelDefine';

interface OSSData {
  dir?: string;
  expire?: string;
  host?: string;
  accessId?: string;
  policy?: string;
  signature?: string;
}

const UploadDir: React.FC<{}> = () => {
  const [ossOptions, setOssOptions] = useState<OSS.Options>();
  const [changeText, setChangeText] = useState<string>('');

  interface FileWithUrl extends File {
    fileUrl?: string;
  }
  const uploadList = new Set<FileWithUrl>();
  const completedList = new Set<FileWithUrl>();

  const uploadByOss = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      uploadList.add(files[i]);
    }

    // excel的上传路径 hisdata/userId/yyyyMMdd/filename
    // 图片的上传路径 hisdata/userId/yyyyMMdd/filename/picname
    function formatDate(date: Date) {
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 101).toString().substring(1);
      const day = (date.getDate() + 100).toString().substring(1);
      return `${year}${month}${day}`;
    }

    const userId = localStorage.getItem('userId');
    console.log('当前的userId是', userId);
    const yyyymmdd = `hisdata/${userId}/${formatDate(new Date())}`;

    const file_xlsx = [...uploadList].find((f) => f.name.indexOf('xls') > 0);
    const file_pics = [...uploadList].filter((f) => f.name.indexOf('xls') < 0);
    const file_name = `${yyyymmdd}/${file_xlsx?.name}`;
    file_xlsx!.fileUrl = file_name;

    const upload_object = {
      filename: file_xlsx?.name,
      filekey: file_xlsx?.fileUrl,
      pic: file_pics.map((f) => {
        // eslint-disable-next-line no-param-reassign
        f.fileUrl = `${file_name}/${f.name}`;
        return {
          picname: f.name,
          pickey: f.fileUrl,
        };
      }),
    };
    console.log(upload_object);

    if (ossOptions) {
      console.log('查看ossoptions ', ossOptions);

      const aliyunOssClient = new OSS(ossOptions);
      const fileList = [...uploadList];

      Promise.all(
        fileList.map(async (f) => {
          const uploadOptions: MultipartUploadOptions = {};
          const res = aliyunOssClient.multipartUpload(f.fileUrl!, f, uploadOptions);
          console.log('上传单个文件', res, f);
          if (res) {
            completedList.add(f);
            const data = {
              total: uploadList.size || 0,
              uploaded: completedList.size || 0,
              needUpload: uploadList.size - completedList.size || 0,
            };
            setChangeText(
              `需要上传的文件数量为${data.total}，已上传的文件数量${data.uploaded},需要上传${data.needUpload}`,
            );
          }
          return true;
        }),
      )
        .then((res: boolean[]) => {
          saveFilesUploadResult(userId, upload_object);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onChange = async function (e: ChangeEvent<HTMLInputElement>) {
    await uploadByOss(e.target.files as FileList);
  };

  const init = async () => {
    try {
      let osign = await getOSSSign(0);
      osign = Object.assign(osign, {
        bucket: 'wecare-data-import',
        rolesessionname: 'wecare',
        region: 'oss-cn-zhangjiakou',
      });
      setOssOptions(osign);
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="inputfile">
      <label>{changeText}</label>
      <input
        type="file"
        id="filepicker"
        name="files"
        directory=""
        webkitdirectory=""
        multiple
        onChange={onChange}
      />
    </div>
  );
};

const ExcelList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ExcelListItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      rules: [
        {
          required: false,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '文件名',
      dataIndex: 'name',
      rules: [
        {
          required: false,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: { text: '等待上传', status: 'Default' },
        1: { text: '上传中', status: 'Uploading' },
        2: { text: '已上线', status: '未知' },
        3: { text: '正常', status: 'Success' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => {}}>配置</a>
        </>
      ),
    },
  ];

  return (
    // <PageHeaderWrapper>
    <ProTable<ExcelListItem>
      headerTitle="上传历史"
      search={false}
      tableAlertRender={false}
      actionRef={actionRef}
      rowKey="id"
      onChange={(_, _filter, _sorter) => {
        const sorterResult = _sorter as SorterResult<ExcelListItem>;
        if (sorterResult.field) {
          setSorter(`${sorterResult.field}_${sorterResult.order}`);
        }
      }}
      params={{
        sorter,
      }}
      // toolBarRender={(action, { selectedRows }) => [
      //   <Button type="primary" onClick={() => handleModalVisible(true)}>
      //     <PlusOutlined /> 新建
      //   </Button>,
      //   selectedRows && selectedRows.length > 0 && (
      //     <Dropdown
      //       overlay={
      //         <Menu
      //           onClick={async (e) => {
      //             if (e.key === 'remove') {
      //               await handleRemove(selectedRows);
      //               action.reload();
      //             }
      //           }}
      //           selectedKeys={[]}
      //         >
      //           <Menu.Item key="remove">批量删除</Menu.Item>
      //           <Menu.Item key="approval">批量审批</Menu.Item>
      //         </Menu>
      //       }
      //     >
      //       <Button>
      //         批量操作 <DownOutlined />
      //       </Button>
      //     </Dropdown>
      //   ),
      // ]}
      // tableAlertRender={(selectedRowKeys, selectedRows) => (
      //   <div>
      //     已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
      //     <span>
      //       {/*服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万*/}
      //     </span>
      //   </div>
      // )}
      // request={(params) => queryRule(params)}
      request={(params) => queryFiles(params)}
      columns={columns}
      rowSelection={{}}
    />

    // </PageHeaderWrapper>
  );
};

export default (): React.ReactNode => {
  const init = async () => {};
  useEffect(() => {
    init();
  }, []);

  const clickThanDownload = () => {
    const url = `https://wecare-data-import.oss-cn-zhangjiakou.aliyuncs.com/template.xlsx?Expires=1585298110&OSSAccessKeyId=TMP.3KfUxU8DMHUeoEnscfEavMTtHrpeke7Zj2uCyvJKfoHWwt9dTDTmFSNTAC31iJjzjgQbyZgTHxnRsD9MFFeexspCHAzo2n&Signature=hGMlbd5HG44VH4QMngcR9SAaex4%3D`;
    window['location'] = url;
  };
  return (
    <>
      <Card>
        <Row gutter={12}>
          <Col span={12}>
            <h1>上传图片</h1>
            <UploadDir />
          </Col>
          <Col span={12}>
            <Button onClick={clickThanDownload}>下载模版</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={8}>
          <Col span={24}>
            {/*<h1>上传记录</h1>*/}
            <ExcelList />
          </Col>
        </Row>
      </Card>
    </>
  );
};
