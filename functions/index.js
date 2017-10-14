'use strict';
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);
// const functions = require('firebase-functions');
const APP_NAME = 'Biker Rescue';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
  const user = event.data; 
  const email = user.email; 

  return sendWelcomeEmail(email);
});

exports.sendAlertEmail = functions.database.ref('/rescueme/{timestamp}').onWrite(event => {
  
	console.log(event.data.val());
  const timestamp = event.params.timestamp; // Numeric timestamp
  const newData = event.data.val();
  const oldData = event.data.previous.val();
  const emailme = newData.email;
  const issues = newData.issues;
  console.log(emailme);
  console.log(timestamp.issues);
  const email = 'adisazizan@gmail.com'; 

  return sendAlertEmail(email, emailme, issues);
});

function sendWelcomeEmail(email) {

  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${email}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  });
}


function sendAlertEmail(email, emailme, issues) {

  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Alert, ${APP_NAME}!`;
  mailOptions.text = `Hey ${email}! There are some biker have problem with his bike.
  					  Details as below: 
  							Email: ${emailme}
  							Issues: ${issues}
  						We hope you will help him.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New alert email sent to:', email);
  });


}