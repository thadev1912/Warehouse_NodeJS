
const nodeMailer = require('nodemailer')
const adminEmail = 'tha.thach@rynantech.com'
const adminPassword = 'Khongcopass'
const mailHost = 'c22605.sgvps.net'
const mailPort = 587
const sendMail = (to, subject, htmlContent) => {
 
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, 
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })
  const options = {
    from: adminEmail, 
    to: to, 
    subject: subject, 
    html: htmlContent 
  }
  return transporter.sendMail(options)
}
module.exports = {
  sendMail: sendMail
}