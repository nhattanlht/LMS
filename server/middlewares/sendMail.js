import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - E-Learning Website</title>
    <style>
        /* Root variables for easy color management */
        :root {
            --primary-color: #5a2d82;
            --secondary-color: #333;
            --text-color: #666;
            --bg-color: #f4f4f4;
            --white-color: #fff;
            --shadow-color: rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            background-color: var(--white-color);
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 8px var(--shadow-color);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }

        h1 {
            color: var(--secondary-color);
            margin-bottom: 20px;
            font-size: 24px;
        }

        p {
            margin-bottom: 20px;
            color: var(--text-color);
            line-height: 1.6;
        }

        .otp {
            font-size: 36px;
            color: var(--primary-color);
            margin-bottom: 30px;
            font-weight: bold;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: var(--text-color);
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: var(--white-color);
            background-color: var(--primary-color);
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
            transition: background-color 0.3s;
        }

        .button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <h1>E-Learning Website</h1>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>
        <p class="otp">${data.otp}</p>
        <a href="#" class="button" aria-label="Verify OTP">Verify Now</a>
        <footer class="footer">
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Thank you,</p>
            <p>LMS - Group 03 - Intro2SE CSC13002 CQ2022/1</p>
        </footer>
    </div>
</body>
</html>

  `;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

export const sendForgotMail = async (subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    /* CSS Variables for better maintainability */
    :root {
      --primary-color: #5a2d82;
      --text-color: #666666;
      --bg-color: #f3f3f3;
      --white-color: #ffffff;
      --shadow-color: rgba(0, 0, 0, 0.1);
      --footer-text-color: #999999;
      --font-family: Arial, sans-serif;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--bg-color);
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      background-color: var(--white-color);
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 8px var(--shadow-color);
      max-width: 600px;
      width: 100%;
      text-align: center;
    }

    h1 {
      color: var(--primary-color);
      margin-bottom: 20px;
      font-size: 24px;
    }

    p {
      color: var(--text-color);
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .button {
      display: inline-block;
      padding: 15px 30px;
      background-color: var(--primary-color);
      color: var(--white-color);
      text-decoration: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #482064;
    }

    .footer {
      margin-top: 30px;
      color: var(--footer-text-color);
      font-size: 14px;
      text-align: center;
    }

    .footer a {
      color: var(--primary-color);
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <main class="container">
    <h1>Reset Your Password</h1>
    <p>Hello,</p>
    <p>You have requested to reset your password. Please click the button below to proceed with resetting your password.</p>
    <a href="${process.env.frontendurl}/reset-password/${data.token}" class="button" aria-label="Reset your password">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <footer class="footer">
      <p>Thank you,<br>LMS - Group 03 - Intro2SE CSC13002 CQ2022/1</p>
      <p><a href="https://yourwebsite.com">yourwebsite.com</a></p>
    </footer>
  </main>
</body>
</html>

`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: data.email,
    subject,
    html,
  });
};

export const sendNotificationMail = async (subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        background-color: #ffffff;
        padding: 20px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 600px;
      }
      h1 {
        color: #333;
      }
      p {
        color: #666;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: #007BFF;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 16px;
      }
      .footer {
        margin-top: 20px;
        color: #999;
        text-align: center;
        font-size: 14px;
      }
      .footer a {
        color: #007BFF;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${subject}</h1>
      <p>Dear ${data.recipientName || 'Leaner'},</p>
      <p>${data.message}</p>
    </div>
  </body>
  </html>
  `;
  
    await transport.sendMail({
      from: data.sender,
      to: data.recipients,
      subject,
      html,
      ...(data.file && {
        attachments: [
          {
            filename: data.file.filename,
            path: data.file.path,
          },
        ],
      }),
    });
  };