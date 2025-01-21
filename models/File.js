const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

//post middleware

fileSchema.post("save", async function (doc) {
    try {
        console.log("Doc", doc);

        //transporter
        //Todo: create a nodemailer transporter /config
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },

        });

        //send mail
        let info = await transporter.sendMail({
            from: `hemanta - gudu`,
            to: doc.email,
            subject: "File uploaded",
            html: `<h2>Hello jee</h2> <p>File uploaded</p> View here: <a href="${doc.imageUrl}">View Your Image Here</a>`

        })

        console.log("info", info);

    }
    catch (err) {
        console.error(error);
    }
})

module.exports = mongoose.model('File', fileSchema);