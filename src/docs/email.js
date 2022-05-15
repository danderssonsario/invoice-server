/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-param */

/**
 * Html body of email.
 *
 * @param {object} param0 - Invoice data.
 * @returns {string} - String representation of email.
 */
export const generateEmailFromTemplate = function ({ businessName, customer, body, footerItems }) {
  return `
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Faktura från ${businessName}</a>
    </div>
    <p>Hej ${customer.name}, tack för din order.</p>
    <br>
    ${body}
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      ${footerItems.map((item) => `<p>${item}</p>`).join('')}
    </div>
  </div>
</div>
`
}
