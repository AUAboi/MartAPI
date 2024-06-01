import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
// import { email } from "../views/email.js";

export const sendEmail = async (
  subject,
  sendTo,
  sendFrom,
  replyTo,
  template,
  name,
  link,
  p1,
  p2,
  btn_text
  // const subject = "Reset password request";
  // const sendTo = email;
  // const sendFrom = process.env.EMAIL_USERNAME;
  // const replyTo = "noreply@noreply.com";
  // const template = "forgotPassword";
  // const name = user.name;
  // const link = resetUrl;
  // const p1 = "This it to notify that your account password has changed";
  // const p2 =
  //   "if you did not initiate this, kindly reset your password immediately";
  // const btn_text = "Reset password";
) => {























  const handleBarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    partialsDir: path.resolve("./views"),
    extName: ".handlebars",
  };

  // Transporter for nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    // port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  // transporter.use("compile",hbs(handleBarOptions))

  //   options for nodemailer to send email
  const mailOptions = {
    from: sendFrom,
    to: sendTo,
    replyTo: replyTo,
    subject: subject,
    html: `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password change</title>
    </head>
    <body style="background-color: rgb(240, 240, 240); padding: 24px">
      <div>
        <div>
          <div
            style="
              display: flex;
              align-items: center;
              background-color: rgb(30, 30, 255);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
            "
          >
            <p
              style="
                font-weight: bold;
                font-size: 22px;
                display: flex;
                align-items: center;
              "
            >
              EazyMart: <span style="font-size: 22px;
            ">Your shopping place</span>
            </p>
          </div>
          <div style="padding: 4px 8px">
            <p style="font-size: 24px">
              Hello <span style="color: rgb(254, 56, 56)">${name}</span>
            </p>
            <p>${p1}</p>
            <p>${p2}</p>
            <a href=${link}>
              <button
                style="
                  background-color: rgb(254, 56, 56);
                  color: white;
                  padding: 12px 16px;
                  border-radius: 4px;
                  border: 0;
                  cursor: pointer;
                "
              >
                ${btn_text}
              </button>
            </a>
          </div>
          <div style="padding: 8px 16px">
            <h4>Regards</h4>
            <h5>Team Dreamers</h5>
          </div>
        </div>
      </div>
    </body>
  </html>`,
    subject: subject,
    // template:"forgotPassword",
    // context: {
    //   name:name,
    //   link:link
    // },
  };

  // Sending email function
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
      console.log(name, btn_text, p1, p2)
    }
  });
};