var express = require('express');
var http = require('http');
var path = require('path');
var nodemailer = require('nodemailer');

var app = express();
var server = http.server(app);
var port = 500;

app.set("port", port);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(_dirname, "index.html")));

// Routing

app.get("/", function(req, response){
    response.sendFile(path.join(_dirname, "index.html"))
})

app.post("/send_email", function(req, response){
    var name = req.body.name;
    var company = req.body.company;
    var email = req.body.email;
    var message = req.body.message;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nsaylock@gmail.com',
            pass: 'jlvi sidr zqmi wwwn'
        }
    });

    var mailOptions = {
        from: email,
        to: user,
        subject: company,
        text: message
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
        } else {
            console.log("Email Send: " + info.response)
        }
        response.redirect("/")
    })

})

// initialize web server
server.listen(port, function(){
    console.log("Starting Server on port: ", + port)
})