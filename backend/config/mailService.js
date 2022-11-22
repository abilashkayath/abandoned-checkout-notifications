const nodemailer = require("nodemailer");
const dayjs = require("dayjs");
const { sendMessage } = require("../controllers/messageController");

function sendMail(data) {
  const { id, email, abandoned_checkout_url, customer } = data;
  const { first_name, last_name } = customer || {};
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      // use generated app password for gmail
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });

  // setting credentials
  let mailDetails = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Still thinking about it?",
    text: `$${abandoned_checkout_url}`,
  };

  // sending email
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("error occurred", err.message);
    } else {
      sendMessage({
        checkout_id: id,
        email,
        name: `${first_name} ${last_name}`,
      });
    }
  });
}

function generateJobId(id, variable) {
  return `${id}+${variable}`;
}

function generateCronDate(value, description) {
  const date = dayjs().add(value, description);

  const schedulerString = `${date.minute()} ${date.hour()} ${date.date()} ${date.month()} *`;
  return schedulerString;
}

module.exports = { sendMail, generateJobId, generateCronDate };
