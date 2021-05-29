import axios from 'axios'
import { getToken, getTentId, getAppKey } from '@/utils/auth'
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
      url: process.env.VUE_APP_BASE_URL + `jyteam/sysFile/upload`,
      method: 'POST',
      headers: {
        'Authorization': getToken(),
        'tentId': getTentId(),
        'appKey': getAppKey()
      },
      data,
      withCredentials: true // true 为不允许带 token, false 为允许
    })

    // 方法返回数据格式： {default: "url"}
    return {
      default: process.env.VUE_APP_IMG_URL + res.data.data
    }
  }
}

export default MyUploadAdapter
