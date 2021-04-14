export default function randomStr(num = 6) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let randStr = ''
  for (let i = 0; i < num; i++) {
    const rand = Math.floor(Math.random() * 62)
    randStr += str[rand]
  }
  return randStr
}
