import nodemailer from "nodemailer";

async function Mail({ To, subject, text }) {
  console.log(To);
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      //YOUR EMAIL HERE user: "",
      pass: "uclknphfgfufdnux",
    },
  });

  const mailOptions = {
    //YOUR EMAIL HERE from: "",
    to: To,
    subject: subject,
    text: text,
  };

  try {
    const mailVerify = await transport.sendMail(mailOptions);
    return mailVerify;
  } catch (error) {
    console.log(error);
    return "error";
  }
}

export { Mail };
