// // api/sendEmail.js
// import nodemailer from "nodemailer";

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { name, title, speciality, description, consent, dataRelevant, attachment } = req.body;

//       // Configure Nodemailer
//       const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: parseInt(process.env.SMTP_PORT),
//         secure: false,
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS,
//         },
//       });

//       const mailOptions = {
//         from: `"Surgeons for Surgeons" <surgeonsforsurgeons@gmail.com>`, // Gmail sender
//         to: "support@surgeonsforsurgeons.com", // Receiver (your support inbox)
//         subject: `New Case Uploaded: ${title}`,
//         html: `
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Title:</strong> ${title}</p>
//           <p><strong>Speciality:</strong> ${speciality}</p>
//           <p><strong>Description:</strong> ${description}</p>
//           <p><strong>Consent:</strong> ${consent}</p>
//           <p><strong>Data Relevant:</strong> ${dataRelevant}</p>
//         `,
//         attachments: attachment
//           ? [
//               {
//                 filename: attachment.filename,
//                 content: Buffer.from(attachment.content, "base64"),
//               },
//             ]
//           : [],
//       };

//       await transporter.sendMail(mailOptions);
//       return res.status(200).json({ message: "Email sent successfully" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Error sending email", error });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const {
      // Case form fields
      name,
      title,
      speciality,
      description,
      consent,
      dataRelevant,
      attachment,

      // Contact form fields
      fullName,
      email,
      phone,
      subject,
      message,
    } = req.body;

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

    let mailOptions;

    if (title) {
      // CASE FORM
      mailOptions = {
        from: `"Surgeons for Surgeons" <surgeonsforsurgeons@gmail.com>`,
        to: "support@surgeonsforsurgeons.com",
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
    } else {
      // CONTACT FORM
      mailOptions = {
        from: `"Website Contact" <jigishaadatiya21@gmail.com>`,
        to: "support@surgeonsforsurgeons.com",
        subject: subject || `New Contact Message from ${fullName}`,
        html: `
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      };
    }

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email", error: error.message });
  }
}

