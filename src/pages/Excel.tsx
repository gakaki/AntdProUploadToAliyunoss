import React, { useEffect } from 'react'
import styles from './Excel.less'
import { Row, Col } from 'antd'
import { message, Button,Card } from 'antd'
import Upload ,{ UploadProps, UploadListProps, UploadChangeParam, RcFile  }from 'antd/es/upload'
import { useState } from 'react'
import { UploadFile } from 'antd/lib/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
import OSS, { MultipartUploadOptions } from 'ali-oss'
import request from 'umi-request'

interface OSSData {
    dir?: string,
    expire?:string,
    host?: string,
    accessId?: string,
    policy?: string,
    signature?: string,
}
const AliyunOSSUpload: React.FC<{}> = () => {
    const [ossOptions,setOssOptions] = useState<OSS.Options>()

    const init = async () => {
        try {
            let options = await request.get('http://localhost:9000/mock')
            setOssOptions(options)
            console.log("uploadbyoss",ossOptions)
        } catch (error) {
          message.error(error);
        }
    };
    useEffect(() => {
        init()
    }, []);

    const onChange =  async (info: UploadChangeParam) => {
        console.log('Aliyun OSS:', info);
        await uploadByOss(info.fileList);
    };

    const uploadByOss = async( files:Array<UploadFile> ) =>{
        if(ossOptions){
            const aliyunOssClient = new OSS(ossOptions)
            for(let file of files){
                console.log(file)
                const uploadOptions : MultipartUploadOptions =  {}
                aliyunOssClient.multipartUpload(file.name,file.originFileObj,uploadOptions).then((res)=>{
                    console.log("上传结果",res)
                })
            }
        }
    }

//   const onRemove = file:UploadFile => {

//     const files = value.filter(v => v.url !== file.url);

//     if (onChange) {
//       onChange(files);
//     }
//   };
//   const transformFile = (file:any) => {
//     const suffix = file.name.slice(file.name.lastIndexOf('.'));
//     const filename = Date.now() + suffix;
//     file.url = od.dir + filename;
//     console.log(file)
//     return file;
//   };

//    const getExtraData = file => {
//         return {
//             key: file.url,
//             OSSAccessKeyId: OSSData.accessId,
//             policy: OSSData.policy,
//             Signature: OSSData.signature,
//         };
//     };

    // const beforeUpload = async () => {
    //     const expire = OSSData.expire * 1000;
    //     if (expire < Date.now()) {
    //         await init();
    //     }
    //     return true;
    // }

   
    return (
      <Upload
        name={'file'} 
        // fileList={value}
        onChange={onChange}
        directory={true}
        showUploadList={false}
        // onRemove={onRemove}
        // transformFile={transformFile}
        // data={getExtraData}
        // beforeUpload={beforeUpload}
         >
        <Button>                   
          <UploadOutlined /> Click to Upload1
        </Button>
      </Upload>
    );
}

const UploadDir: React.FC<{ }> = ({  }) => {
    const onChange = (e:any) => {
        console.log(e)
    }
    useEffect(() => {
        
    }, []);
    return (
        <div className="inputfile" >
            <input type="file" id="filepicker" name="files" directory=""   multiple onChange={onChange} />
        </div>
    )
}

export default (): React.ReactNode => (
        <Card>
            <Row gutter={8}>
                <Col span={8}>
                    <h1>上传图片</h1>
                    <UploadDir/>
                 </Col>
                <Col span={16}>
                    <h1>列表查看</h1>
                </Col>
            </Row>
        </Card>

);
