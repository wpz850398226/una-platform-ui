import { Message } from 'element-ui'

const CMessage = (options) => {
  const oldMsg = sessionStorage.getItem('el-msg')
  if (typeof options === 'string') {
    options = {
      message: options
    }
    if (oldMsg !== options.message) {
      sessionStorage.setItem('el-msg', options.message)
      setTimeout(() => {
        sessionStorage.removeItem('el-msg')
      }, 3000)
      return Message(options)
    }
  }
}

['success', 'warning', 'info', 'error'].forEach(type => {
  CMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    const oldMsg = sessionStorage.getItem('el-msg')
    if (oldMsg !== options.message) {
      sessionStorage.setItem('el-msg', options.message)
      setTimeout(() => {
        sessionStorage.removeItem('el-msg')
      }, 3000)
      return Message(options)
    }
  }
})

export default CMessage
