import nodemailer from 'nodemailer';

export function renderTemplate(token) {
    return  `
    <div>
        <h1> LOL Project PassWord Change Form </h1>
        <h3>아래 링크를 통해 비밀번호를 새로 입력해주세요.</h3>
        <br/>
        <a href='http://localhost:3000/reset/${token}'>링크</a>
    </div>
`
}

export function sendMail(email, title, body) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_AUTH_EMAIL,
      pass: process.env.NODEMAILER_AUTH_PASSWORD,
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_AUTH_EMAIL,
    to: email,
    subject: title,
    html: body
  };
    
  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('이메일 전송 실패');
    }
    else {
      console.log('이메일 전송 완료')
    }
  })
}
