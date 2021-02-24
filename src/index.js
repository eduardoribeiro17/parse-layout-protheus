'use strict'

const csv = require('csvtojson/v2')
const { writeFile } = require('fs')

const dataFile = 'data-file/01-2020.csv'
const file = 'export/01-2020-test.txt'

module.exports = (async function parse() {
  const rows = await csv({
    output: 'json',
    delimiter: ';',
  }).fromFile(dataFile)

  for (const row of rows) {
    let {
      linha,
      conta_debito,
      conta_credito,
      valor,
      historico,
      cc_debito,
      cc_credito,
    } = row

    linha = linha.substr(3, 6)

    conta_debito = fill(conta_debito, 8)
    conta_credito = fill(conta_credito, 8)
    valor = valor.replace(/[^\d]+/g, '')
    valor = fill(valor, 8)
    historico = fill(historico, 19)
    cc_debito = fill(cc_debito, 10)
    cc_credito = fill(cc_credito, 10)

    const line = `${linha} ${conta_debito} ${conta_credito} ${valor} ${historico} ${cc_debito} ${cc_credito}\n`

    console.warn(line, line.length)

    writeFile(file, line, { enconding: 'utf-8', flag: 'a' }, err => {
      if (err) throw err
    })
  }
})()

function fill(value, totalLength) {
  const valueLength = value.length
  const diff = totalLength - value.length

  if (valueLength < totalLength) {
    const blankSpace = ' '.repeat(diff)

    return `${value}${blankSpace}`
  }

  return value
}
