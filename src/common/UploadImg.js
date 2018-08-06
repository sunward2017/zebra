import React from 'react';

import { Upload, Button, Icon, message } from 'antd';

function beforeUpload(file, id) {
    if (!id) {
        message.error('该记录未保存或保存img地址丢失')
        return false;
    }
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('只能上传jpg格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片不能大于2MB!');
    }

    return isJPG && isLt2M;
}

const UplaodImg = (props) => {
    const { imgUuid, title,getImg } = props;
    const prop = {
        action: "/UploadImg",
        name: "img",
        beforeUpload: (file) => (beforeUpload(file, imgUuid)),
        data: { fuuid: imgUuid },
        onChange(info) {
            if (info.file.status === 'done') {
                const { response } = info.file;
                if (response.result === 200) {
                    getImg();
                    message.success(`${info.file.name}文件上传成功`);
                } else {
                    message.error(`${info.file.name} 上传失败`);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传状态失败`);
            }
        },
    }
    return <div>
        <Upload
            {...prop}
        >
            <Button>
                <Icon type="upload" />{title}
            </Button>
        </Upload>
    </div >
}

export default UplaodImg;
