var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/json");
editor.renderer.setShowGutter(false);
editor.container.style.background="#22272D"


const az = [
  {
    "$group": {
      "_id": "$price",
      "count": { "$sum": 1 }
    }
  },
  {
    "$match": {
      "count": {
        "$gte": 1
      }
    }
  },
  {
	    "$sort": {
	        "count": -1
	    }
	},
  {
		"$limit": 200
	},
  {
    "$project": {
      "_id": 0,
			"_price": "$_id",
			"_count": "$count"
		}
	},
  {
    "$project": {
			"price": "$_price",
			"count": "$_count"
		}
	}
]
const aa = JSON.stringify(az, null, '\t')
editor.setValue(aa, 1)

const chartOptions = {
    title: {
        text: ''
    },
    xAxis: {
        title: {
            text: ''
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    }
}

function rowHtml(data) {
  return data.reduce((acc, cell) => {
      acc += `<div class="table-cell">${cell}</div>`
      return acc;
  }, '')
}


async function getData (type) {
  const filters = editor.getSession().getValue()
  const rawProperties = await fetch(`${window.location.href}q?filters=${filters}`)
  const properties = await rawProperties.json()

  if(type == 'chart') {
    drawChart(properties)
  } else if (type == 'table') {
    drawTable(properties)
  }
}


function drawTable (data) {
  if(data.length == 0) { return }

  const headers = Object.keys(data[0]);
  const table = document.getElementById('table')
  table.innerHTML = ''

  const row = `<div class="table-header">${rowHtml(headers)}</div>`
  table.insertAdjacentHTML('beforeend', row)

  data.forEach((content) => {
    const values = Object.values(content)
    const row = `<div class="table-row">${rowHtml(values)}</div>`
    table.insertAdjacentHTML('beforeend', row)
  })
}

function Comparator(a, b) {
   if (a[0] < b[0]) return -1;
   if (a[0] > b[0]) return 1;
   return 0;
 }

function groupData(succ, xOption) {
  const sorted = succ.sort(Comparator)

  // const grouped = succ
  // console.log(grouped)
  let grouped = []
  if (!xOption || xOption == 0) {

    const temp = succ.reduce((acc, val)=>{
      acc[val[0]] = val[1] + (acc[val[0]] || 0)
      return acc
    }, {})

    grouped = Object.entries(temp)
  } else {
    const firstX = sorted[0][0]
    const lastX = sorted.pop()[0]
    const interval = (lastX - firstX) / xOption

    for(let i = 0; i < xOption; i++) {
      const xValue = !grouped[i-1] ? firstX : (grouped[i-1][0] + interval)
      const count = succ.filter((x) => {
        return x[0] > xValue && x[0] < (xValue + interval)
      }).length

      grouped.push([xValue, count])
    }
  }

  return grouped
}

function cleanData (data, x, y) {
  return data.map((prop)=>{
    const date = new Date(prop[x])

    if(date == 'Invalid Date') {
      return [ prop[x], prop[y]]
    } else {
      return [ date.getTime(), prop[y]]
    }
  })
}


function drawChart(data) {
  const x = document.getElementById('x').value
  const xOption = document.getElementById('xOption').value
  const y = document.getElementById('y').value
  const yOption = document.getElementById('yOption').value


  const cleaned = cleanData(data, x, y)

  // const grouped = groupData(cleaned, xOption)

  // const test = new Date(grouped[0][0])
  // if(test !== 'Invalid Date') {
  //   console.log('fucccc', test !== 'Invalid Date', test, 'Invalid Date')
  //   chartOptions.xAxis.type = 'datetime'
  // }

  // console.log(grouped, chartOptions)
  chartOptions.series = [{
      name: x,
      type: 'column',
      data: cleaned
  }]

  Highcharts.chart('table', chartOptions);
}
