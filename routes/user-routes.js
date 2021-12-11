const UserModel = require("../models/user");
const asyncMiddleware = require("../utils/asyncMiddleware");
const status = require("../utils/statusCodes");
const express = require("express");
let path = require("path");
let ejs = require("ejs");
let nodemailer = require("nodemailer");

const initializeSMTP = () => {
  let smtpTransport = nodemailer.createTransport({
    host: "mail.softthree.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  return smtpTransport;
};

const router = express.Router();
const GeneralActions = {
  sendInvite: asyncMiddleware(async (req, res) => {
    let { email } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
      res.status(status.client.badRequest).json({
        message: "User Already Exits!",
        status: 200,
      });
    } else {
      let newUser = new UserModel({ ...req.body });
      let savedUser = await newUser.save();
      // Send verification email
      ejs.renderFile(
        path.join(__dirname, "../email-templates/invitation.ejs"),
        {
          email,
          // name: savedUser.firstName,
          link: `${req.get("origin")}/complete-checklist`,
        },
        async function (err, data) {
          if (err) {
            res.status(status.success.created).json({
              message: "Error occured while rendering email",
              status: 400,
            });
          } else {
            let mailOptions = {
              from: process.env.EMAIL,
              to: email,
              subject: "Invitation Link For Cloud Security Checklist.",
              html: data,
            };
            try {
              let smtpTransport = initializeSMTP();
              process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
              await smtpTransport.sendMail(mailOptions);
              res.status(status.success.created).json({
                message:
                  "Invitation email sent successfully. Check your inbox or spam.",
                cloudSecurityChecklist: true,
                status: 200,
              });
            } catch (e) {
              console.log(e);
              res.status(status.success.created).json({
                message: "Mail sending problem occured",
                status: 400,
              });
            }
          }
        }
      );
    }
  }),
};

router.post("/send-invite", GeneralActions.sendInvite);

module.exports = router;
