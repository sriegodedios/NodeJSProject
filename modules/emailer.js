var nodemailer = require('nodemailer');
class emailer{
    constructor()
    {
        this.email ="nodejsapplicationemail@gmail.com"
        this.password ="shaner26mhixon"

        //this.email = ""
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.email,
                pass: this.password
            }
        });
    
        this.mailOptions = {
            from: this.email,
            to: 'krishane@ksu.edu',
            subject: '',
            text: ''
    }
}

    sendEmail(name, email, subject, messege)
    {
        this.mailOptions["subject"] = name +' => '+ email + ': '+ subject;
        this.mailOptions["text"]= messege;

        this.transporter.sendMail(this.mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }
   
}

module.exports = emailer











