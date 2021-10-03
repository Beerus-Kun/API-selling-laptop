var nodemailer = require('nodemailer');

const mailer = {};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'samab1541@gmail.com',
    pass: '1234567qety'
  }
});

mailer.sendVerification = (userEmail, verification)=>{
  var mailOptions = {
      from: 'samab1541@gmail.com',
      to: userEmail,
      subject: 'Lấy lại mật khẩu',
      text: 'Mã xác nhận của bạn là: ' + verification,
  };
  transporter.sendMail(mailOptions);
}

module.exports = mailer;

