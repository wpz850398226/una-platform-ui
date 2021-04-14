const bgColor = '#fff'
const color = ['#3AA0FF', '#36CBCB', '#4ECB74', '#FAD337', '#F2637B', '#975FE4']
const echartData = [{
  name: 'A类',
  value: '3720'
},
{
  name: 'B类',
  value: '2920'
},
{
  name: 'C类',
  value: '2200'
},
{
  name: 'D类',
  value: '1420'
}
]

const option = {
  backgroundColor: bgColor,
  color,
  title: {
    text: '',
    left: 'center',
    textStyle: {
      fontSize: '25'
    }
  },
  tooltip: {
    formatter: '{b0}<br /><div style="text-align: center;">{c0}</div>'
  },
  series: [{
    type: 'pie',
    radius: ['45%', '60%'],
    center: ['50%', '50%'],
    data: echartData,
    hoverAnimation: true,
    itemStyle: {
      normal: {
        borderColor: bgColor,
        borderWidth: 2
      }
    },
    label: {
      normal: {
        padding: [0, 0, 0, 0],
        fontSize: 18,
        rich: {
          icon: {
            fontSize: 22
          },
          name: {
            fontSize: 22,
            padding: [0, 0, 0, 0],
            color: '#000000'
          },
          value: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#000000'
          }
        }
        // formatter: '{b0}：{c0}',
      }
    },
    labelLine: {
      normal: {
        length: 20,
        length2: 10,
        lineStyle: {
          color: '#e6e6e6'
        }
      }
    }
  }]
}

export default option
