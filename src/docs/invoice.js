/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-param */
import moment from 'moment'
import 'moment/locale/sv.js'
moment.locale('sv')

/**
 * Html body of Invoice-pdf.
 *
 * @param {object} param0 - Invoice data.
 * @returns {string} - String representation of the pdf.
 */
export const generatePdfFromTemplate = function ({
  dueDate,
  date,
  orderID,
  items,
  tax,
  total,
  shipping,
  subTotal,
  issuer,
  customer,
  payment
}) {
  return `
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lora:400,700|Montserrat:300,400,700">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.3.1/css/foundation-flex.min.css">
<link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
<style>
body {
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  color: #322d28;
}
.header p {
  font-size: 14px;
  font-weight: 600;
}
header.top-bar h1 {
  font-family: 'Montserrat', sans-serif;
}
main {
  margin-top: 4rem;
  min-height: calc(100vh - 107px);
}
main .inner-container {
  max-width: 100vw;
  margin: 0 auto;
}
table.invoice {
  background: #fff;
}
table.invoice .num {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.8em;
}
table.invoice tr, table.invoice td {
  background: #fff;
  text-align: left;
  font-weight: 400;
  color: #322d28;
}
table.invoice tr.header td h2 {
  text-align: right;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 2rem;
  color: #1779ba;
}
table.invoice tr.intro td:nth-child(1) {
  text-align: left;
}
table.invoice tr.intro td:nth-child(1) p {
  margin: 0;
}
table.invoice tr.details > td {
  padding-top: 1rem;
  padding-bottom: 0;
}
table.invoice tr.details td.id, table.invoice tr.details th.id, table.invoice tr.details td.qty, table.invoice tr.details th.qty, table.invoice tr.details td.per, table.invoice tr.details th.per, table.invoice tr.details td.amt, table.invoice tr.details th.amt {
  text-align: right;
}
table.invoice tr.details td:last-child, table.invoice tr.details th:last-child {
  text-align: right;
}
table.invoice tr.details table thead, table.invoice tr.details table tbody {
  position: relative;
}
table.invoice tr.details table thead:after, table.invoice tr.details table tbody:after {
  content: '';
  height: 1px;
  position: absolute;
  width: 100%;
  left: 0;
  margin-top: -1px;
  background: #c8c3be;
}
table.invoice tr.totals td {
  padding-top: 0;
}
table.invoice tr.totals table tr td {
  padding-top: 0;
  padding-bottom: 0;
}
table.invoice tr.totals table tr td:nth-child(1) {
  font-weight: 500;
  font-size: 0.8em;
}
table.invoice tr.totals table tr td:nth-child(2) {
  text-align: right;
  font-weight: 200;
}
table.invoice tr.totals table tr:nth-last-child(2) td {
  padding-bottom: 0.5em;
}
table.invoice tr.totals table tr:nth-last-child(2) td:last-child {
  position: relative;
}
table.invoice tr.totals table tr:nth-last-child(2) td:last-child:after {
  content: '';
  height: 4px;
  width: 110%;
  border-bottom: 2px solid #322d28;
  position: relative;
  right: 0;
  bottom: -0.575rem;
  display: block;
}
table.invoice tr.totals table tr.total td {
  font-size: 1.1em;
  padding-top: 0.5em;
  font-weight: 700;
}
table.invoice tr.totals table tr.total td:last-child {
  font-weight: 700;
}
.item {
  font-size: 1em;
}
.additional-info {
  border-top: 2px solid #322d28;
  padding-top: 15px;
  width: 100%;
  text-align: left;
}
.additional-info h5 {
  font-size: 0.8em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #1779ba;
}
.additional-info p {
  font-size: 0.8em;
  margin: 0;
}
.additional-info .row .columns {
  margin: 10px auto;
}
 
</style>
</head>
<body>
<div class="row expanded">
  <main class="columns">
    <div class="inner-container">
        <section class="row">
      <div class="callout large invoice-container">
        <table class="invoice">
          <tr class="header">
            <td class="">
              <h1>${issuer.businessName}</h1>
              <p>${issuer.orgNr}</p>
            </td>
            <td class="align-right">
              <h2>Faktura</h2>
            </td>
          </tr>
          <tr class="intro">            
            <td class="text-right">
              <span class="num">Order-ID: ${orderID}</span><br>
              <p>Fakturadatum: ${moment(date).format('L')}</p>
              <p>Förfallodatum: ${moment(dueDate).format('L')}</p>
            </td>
          </tr>
          <tr class="details">
            <td colspan="2">
              <table>
                <thead>
                  <tr>
                    <th class="desc">Beskrivning</th>
                    <th class="id">Art.nr</th>
                    <th class="qty">Antal</th>
                    <th class="per">á pris</th>
                    <th class="amt">Belopp</th>
                  </tr>
                </thead>
                <tbody>
                ${items
                  .map((item) => {
                    return `
                  <tr class='item'>
                    <td class='desc'>${item.desc}</td>
                    <td class='id num'>${item.itemID}</td>
                    <td class='qty'>${item.quant}</td>
                    <td class='per'>${item.pricePer} kr</td>
                    <td class='amt'>${item.priceTotal} kr</td>
                  </tr>
                  `
                  })
                  .join('')}
                </tbody>
              </table>
            </td> 
          </tr>
          <tr class="totals">
            <td></td>
            <td>
              <table>
                <tr class="subtotal">
                  <td class="num">Summa</td>
                  <td class="num">${subTotal} kr</td>
                </tr>
                <tr class="fees">
                  <td class="num">Frakt</td>
                  <td class="num">${shipping} kr</td>
                </tr>
                <tr class="tax">
                  <td class="num">Moms (${tax.percent}%)</td>
                  <td class="num">${tax.sum} kr</td>
                </tr>
                <tr class="total">
                  <td>Totalpris</td>
                  <td>${total} kr</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <section class="additional-info">
        <div class="row">
          <div class="columns">
            <h5>Kontaktinformation</h5>
            <p>${issuer.email}</p>
            <p>${issuer.phone}</p>
            <p>${issuer.adress}</p>
            <a href="${issuer.website}">${issuer.website}</a>
          </div>
          <div class="columns">
            <h5>Mottagare</h5>
            <p>${customer.name}</p>
            <p>${customer.email}</p>
            <p>${customer.phone}</p>
            <p>${customer.adress}</p>
          </div>
          <div class="columns">
            <h5>Betalningsinformation</h5>
            <p>Plusgiro: ${payment.pg}</p>
            <p>Bankgiro: ${payment.bg}</p>
            <p>IBAN: ${payment.iban}</p>
            <p>SWIFT/BIC: ${payment.bic}</p>
          </div>
        </div>
        </section>
      </div>
    </section>
    </div>
  </main>
</div>
</body>
</html>
`
}
