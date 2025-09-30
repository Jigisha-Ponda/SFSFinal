import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }, // disable default JSON parser
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: err.message });

      try {
        const { name, title, speciality, description, consent, dataRelevant } = fields;
        const attachmentFile = files.attachment;

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
          from: `"${name}" <${process.env.SMTP_USER}>`,
          to: "jigishaadatiya21@gmail.com",
          subject: `New Case Uploaded: ${title}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Speciality:</strong> ${speciality}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Consent:</strong> ${consent}</p>
            <p><strong>Data Relevant:</strong> ${dataRelevant}</p>
          `,
          attachments: [
            {
              filename: attachmentFile.originalFilename,
              path: attachmentFile.filepath, // temp file path
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending email", error });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
