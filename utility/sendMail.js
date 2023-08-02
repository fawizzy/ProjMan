const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'oduolafawaz@gmail.com',
        pass: "glegameiauyiigmk"
    }
})




const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (err, info) =>{
        if (err){
            console.log(err)
        } else {
            console.log(info.response)
        }
    })
}

module.exports = sendMail
