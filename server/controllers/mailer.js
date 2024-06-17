import nodemailer from 'nodemailer'
import MailGen from 'mailgen'

import ENV from '../config.js'

let nodeConfig={
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD

    }
}

let transporter = nodemailer.createTransport(nodeConfig);



let MailGenerator = new MailGen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:'https://mailgen.js/'
    }
})



export const registerMail=async(req,res)=>{
    const { username,userEmail,text,subject }=req.body;
    // body of the email
    var email ={
        body:{
            name:username,
            intro: text || 'Welcome to the Connect Nepal! we are very proud and excited to have you',
            outro: 'Need help,or have questions ? Just reply to this email,we would love to help '
        }
    }

    var emailBody=MailGenerator.generate(email);

    let message = {
        from :ENV.EMAIL,
        to: userEmail,
        subject:subject || "SignUP successfull !",
        html:emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(()=>{
            return res.status(200).send({msg:"You have received email from us."})
        })
        .catch(error=> res.status(500).send({ error }))

}