
export const HtmlforOtp = (name: string, otp: string, body: string) => {
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
  </head>
  <body style="margin:0; padding:0; font-family:'Poppins', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background-color:#ffffff; padding:30px 0;">
      <tr>
        <td align="center">
          <!-- Card Container -->
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e3ebff; box-shadow:0 3px 10px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding:30px; text-align:center;">

              
                <!-- Logo -->
                <img src="https://res.cloudinary.com/dbo7vvi5z/image/upload/v1762883987/keyboard_9654987_1_usrhdc.png" 
                  alt="TypeGrid Logo" 
                  width="90" 
                  style="display:block; margin:0 auto 10px;"
                />

                <!-- Greeting -->
                <h2 style="color:#8A796A; font-size:22px; margin:10px 0;">Hello ${name}! 👋</h2>
                <p style="color:#4b5563; font-size:15px; margin:8px 0 20px;">
                  Welcome to <b style="color:#8A796A;">TypeGrid</b> — where typing is fun and fast!<br/>
                  Please use the One-Time Password (OTP) below to verify your account:
                </p>

                <!-- OTP Box -->
                <div style="
                  text-align:center;
                  background-color:#8A796A;
                  color:#ffffff;
                  font-size:26px;
                  font-weight:700;
                  padding:14px 0;
                  letter-spacing:4px;
                  border-radius:10px;
                  width:220px;
                  margin:20px auto;
                ">
                  ${otp}
                </div>

                <!-- Optional Body -->
                ${
                  body
                    ? `<p style="color:#8A796A; font-size:14px; margin:20px auto 10px; max-width:400px; line-height:1.5;">
                        ${body}
                      </p>`
                    : ""
                }

                <!-- Divider -->
                <hr style="border:none; border-top:1px solid #e0e7ff; margin:25px 0;">

                <!-- Footer -->
                <p style="color:#9ca3af; font-size:13px; margin:0;">
                  If you didn’t request this OTP, you can safely ignore this email.<br>
                  <strong style="color:#8A796A;">© ${new Date().getFullYear()} TypeGrid</strong> — Keep Typing. Keep Winning! ⌨️🏆
                </p>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
