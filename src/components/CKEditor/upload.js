import axios from 'axios'
import { getToken } from '@/utils/auth'
// import { parseImg } from '@/api/index'

/**
 * 自定义上传图片插件
 */
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  async upload() {
    const data = new FormData()
    data.append('file', await this.loader.file)

    const res = await axios({
      url: `/api/sys/file/saveByEditor`,
      method: 'POST',
      headers: {
        'Authorization': getToken()
        // 'tentId': getTentId(),
        // 'appKey': getAppKey()
      },
      data,
      withCredentials: true // true 为不允许带 token, false 为允许
    })

    console.log(res, '文件返回')

    // 方法返回数据格式： {default: "url"}
    return {
      default: res.data
    }
  }
}

export default MyUploadAdapter
