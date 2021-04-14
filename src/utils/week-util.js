/**
* 算出一年有多少个周，并返回每一同的开始和结束时间
*
*/
import moment from 'moment'

const mapWeeksOfyear = (year) => {
  const handleYear = year || new Date().getFullYear()
  // 一年的开始和结束时间
  const yearBegin = new Date(`${handleYear}/01/01 00:00:00`)
  const yearEnd = new Date(`${handleYear}/12/31 00:00:00`)
  const aDay = 24 * 60 * 60 * 1000
  const aWeek = aDay * 7

  const beginTime = handleDay(yearBegin, aDay)
  const arr = getWeek(beginTime, yearEnd.getTime(), aWeek)
  return arr
}

function getWeek(beginTime, endTime, aWeek) {
  const arr = []

  const now = (new Date()).valueOf()

  for (let i = beginTime; i <= endTime; i += aWeek) {
    const time = new Date(i)
    arr.push({
      startTime: i,
      startTimeFmt: moment(i).format('YYYY-MM-DD'),
      endTime: i + aWeek - 24 * 60 * 60 * 1000,
      endTimeFmt: moment(i + aWeek - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
      s: `${time.getFullYear()} ${time.getMonth() + 1} ${time.getDate()} 周 ${time.getDay() + 1} `
    })
  }

  let curWeek = ''
  const weekStr = ['', '一', '二', '三', '四', '五', '六', '日']
  arr.forEach((item, i) => {
    const index = i + 1
    item.week = index
    item.name = '第' + index + '周 (' + item.startTimeFmt + ' 至 ' + item.endTimeFmt + ')'
    const children = []
    for (let i = 0; i <= 6; i += 1) {
      const m = moment(item.startTime).add(i, 'days')
      children.push({
        week: '星期' + weekStr[m.isoWeekday()],
        date: m.format('YYYY-MM-DD')
      })
    }
    item.children = children

    if (now >= item.startTime && now <= item.endTime) {
      curWeek = i
    }
  })
  return { arr, curWeek }
}

/**
 * 当然，一年中第一周的周一那天不一定是在这1月1日，可能包函上一年的12月最后几天
 * 默认第一周为可能包括上一年12月最后几天
*/
function handleDay(yearBegin, aDay) {
  console.log('hhh', yearBegin, aDay)
  let time
  const day = yearBegin.getDay()
  console.log('bbb', day)
  switch (day) {
    case 0:
      time = 0
      break
    case 1:
      time = 1 * aDay
      break
    case 2:
      time = 2 * aDay
      break
    case 3:
      time = 3 * aDay
      break
    case 4:
      time = 4 * aDay
      break
    case 5:
      time = 5 * aDay
      break
    case 6:
      time = 6 * aDay
      break
    default:
      time = 0
      break
  }
  return yearBegin.getTime() - time + 24 * 60 * 60 * 1000
}

export default mapWeeksOfyear
