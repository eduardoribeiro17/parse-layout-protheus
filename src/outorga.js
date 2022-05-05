'use strict'

const csv = require('csvtojson/v2')
const { writeFile } = require('fs')

const dataFile =
  'C:/Users/eduardo/Documents/dev/lab/parse-layout-protheus/data-file/02-2022.csv'
const file = 'C:/ct2/022022.txt'

module.exports = (async function parse() {
  const rows = await csv({
    output: 'json',
    delimiter: ';',
  }).fromFile(dataFile)

  let i = 1
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
    // console.log(row)

    linha = '003'

    conta_debito = fill(conta_debito, 8)
    conta_credito = fill(conta_credito, 8)
    valor = valor.replace(/[^\d]+/g, '')
    valor = fill(valor, 8)
    historico = fill(historico, 20)
    cc_debito = fill(cc_debito, 12)
    cc_credito = fill(cc_credito, 12)

    const line = `${linha} ${conta_debito} ${conta_credito} ${valor} ${historico} ${cc_debito} ${cc_credito}\r\n`
    // 79 + 1 considerando caracter de final de linha
    if (line.length > 79)
      console.warn(
        line,
        `-> Linha ${i}: ${line.length} 
        | CT Debito: ${conta_debito.length} 
        | CT Crédito: ${conta_credito.length} 
        | Valor: ${valor.length} 
        | Historico: ${historico.length} 
        | CC Debito: ${cc_debito.length} 
        | CC Credito: ${cc_credito.length}`
      )

    writeFile(file, line, { enconding: 'utf-8', flag: 'a' }, err => {
      if (err) throw err
    })

    i++
  }

  console.log(`FILE PARSE FINISHED! Lines: ${i}`)
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
