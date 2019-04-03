var nodemailer = require('nodemailer');
var mysql = require('mysql')
var fs = require('fs');
let rawdata = fs.readFileSync(__dirname+'/../../credentials.json','utf8');  
let credentials = JSON.parse(rawdata)

class emailer{
    constructor()
    {
        this.email = credentials["credentials"]["email"]["account"];
        this.password = credentials["credentials"]["email"]["password"];
        this.email1 = credentials["credentials"]["email1"]["account"];
        this.password1 = credentials["credentials"]["email1"]["password"];

        //this.email = ""
        this.transporter = nodemailer.createTransport({
            host: 'mail.sriegodedios.com',
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized:false
             },
            auth: {
                user: this.email,
                pass: this.password
            }
        });

        this.transporter1 = nodemailer.createTransport({
            host: 'mail.sriegodedios.com',
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized:false
             },
            auth: {
                user: this.email1,
                pass: this.password1
            }
        });
    
        this.mailOptions = {
            from: this.email,
            to: 'krishane@ksu.edu',
            subject: '',
            text: '',
            html: '',
    }
}

    sendEmail(name, email, subject, messege)
    {
        this.mailOptions["from"] = this.email;
        this.mailOptions["to"] = "krishane@ksu.edu";
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

    sendEmailR(email, messege)
    {
        console.log(messege);
        this.mailOptions["from"] = this.email1;
        this.mailOptions["to"] = email;
        this.mailOptions["subject"] = "Registration";
        this.mailOptions["html"] = messege;


        this.transporter1.sendMail(this.mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }
   
}

module.exports = emailer











