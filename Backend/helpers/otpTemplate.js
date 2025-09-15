const otpTemplate = (name, otp) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background: #4f46e5; padding: 20px; text-align: center; color: #fff;">
        <h2 style="margin: 0;">🔐 Verification Code</h2>
      </div>
  
      <!-- Body -->
      <div style="padding: 25px; color: #333;">
        <p style="font-size: 16px;">Hello <b>${name}</b>,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          We received a request to verify your email. Please use the OTP below to complete your process:
        </p>
  
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 24px; letter-spacing: 5px; font-weight: bold; background: #f3f4f6; display: inline-block; padding: 10px 20px; border-radius: 6px; border: 1px dashed #4f46e5;">
            ${otp}
          </p>
        </div>
  
        <p style="font-size: 14px; color: #555;">
          ⚠️ This OTP is valid for <b>10 minutes</b>. Do not share it with anyone for your account’s security.
        </p>
      </div>
  
      <!-- Footer -->
      <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} YourApp. All rights reserved.
      </div>
    </div>
    `;
  };
  
  export default otpTemplate;
  