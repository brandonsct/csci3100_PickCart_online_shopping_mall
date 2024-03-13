 
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const sendMail = (receiver)=>{
    const transporter = nodemailer.createTransport({ 
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { 
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PW
        },
        tls: {
            rejectUnauthorized: false
          }
    }); 
      
    // const token = jwt.sign({ 
    //         data: 'Token Data' 
    //     }, 'ourSecretKey', { expiresIn: '10m' }   
    // );     
    const token = Math.floor(100000 + Math.random() * 900000)
      
    const mailConfigurations = { 
      
        // It should be a string of sender/server email 
        from: process.env.EMAIL_USERNAME, 
      
        to: receiver, 
      
        // Subject of Email 
        subject: 'Email Verification', 
          
        // This would be the text of email body 
        text: `Hi! There, You have recently visited  
               our website and entered your email. 
               Your OTP is ${token}
               Thanks` 
          
    }; 
      
    transporter.sendMail(mailConfigurations, function(error, info){ 
        if (error) throw Error(error); 
        console.log('Email Sent Successfully'); 
        console.log(info); 
    }); 
    return token
}

module.exports = sendMail;
