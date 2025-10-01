// api/sendEmail.js
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, title, speciality, description, consent, dataRelevant, attachment } = req.body;

      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"Surgeons for Surgeons" <surgeonsforsurgeons@gmail.com>`, // Gmail sender
        to: "jigishaadatiya21@gmail.com", // Receiver (your support inbox)
        subject: `New Case Uploaded: ${title}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Speciality:</strong> ${speciality}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Consent:</strong> ${consent}</p>
          <p><strong>Data Relevant:</strong> ${dataRelevant}</p>
        `,
        attachments: attachment
          ? [
              {
                filename: attachment.filename,
                content: Buffer.from(attachment.content, "base64"),
              },
            ]
          : [],
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error sending email", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
