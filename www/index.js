const fake = [
  {
    id: 1,
    price: 1.1
  },
  {
    id: 2,
    price: 1.2
  }
]

function rowHtml(data) {
  return data.reduce((acc, cell) => {
      acc += `<div class="table-cell">${cell}</div>`
      return acc;
  }, '')
}

function pretty (data) {
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


async function getData () {
  const filters = document.getElementById('input').value
  const rawProperties = await fetch(`${window.location.href}q?filters=${filters}`)
  const properties = await rawProperties.json()

  pretty(properties)
}


pretty(fake)
