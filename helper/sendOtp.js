import nodemailer from 'nodemailer'

export default function sendOTP(email ,otp){
    let transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port : 465,
        secure: true,
        auth: {
            user : process.env.email,
            pass : process.env.password
        }
    })
    var mailOption={
        from: process.env.email,
        to:email,
        subject:"AUDIO email verification",
        html: `
        <h1> Verify Your account</h1>
        <h3>use this code to verify you email</h3>
        <h2>${otp}</h2>`
    }
    transporter.sendMail(mailOption, (error, info) => {
        if(error){
            console.log(error)
        }
        else{
            resolve({success:true, message:"Otp send Successfull"})
        }
    })
}