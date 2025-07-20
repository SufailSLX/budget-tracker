const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendOTP(email, fullName, otp) {
    const mailOptions = {
      from: {
        name: 'Credit Tracker',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🔐 Your Credit Tracker Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              text-align: center;
              background: #f8f9ff;
              padding: 20px;
              border-radius: 8px;
              letter-spacing: 8px;
              margin: 30px 0;
              border: 2px dashed #667eea;
            }
            .message {
              text-align: center;
              margin-bottom: 30px;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Credit Tracker</div>
              <p>Secure. Simple. Smart.</p>
            </div>
            
            <div class="message">
              <h2>Hello ${fullName}! 👋</h2>
              <p>Welcome to Credit Tracker! We're excited to have you on board.</p>
              <p>To complete your registration, please use the verification code below:</p>
            </div>
            
            <div class="otp-code">${otp}</div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This code expires in <strong>10 minutes</strong></li>
                <li>Never share this code with anyone</li>
                <li>Our team will never ask for this code</li>
              </ul>
            </div>
            
            <div class="message">
              <p>If you didn't request this code, please ignore this email or contact our support team.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent from Credit Tracker</p>
              <p>© ${new Date().getFullYear()} Credit Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email, fullName) {
    const mailOptions = {
      from: {
        name: 'Credit Tracker',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🎉 Welcome to Credit Tracker!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Credit Tracker</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .celebration {
              font-size: 48px;
              text-align: center;
              margin: 20px 0;
            }
            .features {
              background: #f8f9ff;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .feature-item {
              display: flex;
              align-items: center;
              margin: 15px 0;
            }
            .feature-icon {
              font-size: 20px;
              margin-right: 15px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Credit Tracker</div>
              <div class="celebration">🎉</div>
              <h1>Welcome aboard, ${fullName}!</h1>
              <p>Your financial journey starts here</p>
            </div>
            
            <div class="features">
              <h3>What you can do now:</h3>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>Track your income and expenses effortlessly</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">💰</span>
                <span>Set up personalized savings goals</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📈</span>
                <span>Get insights with beautiful charts and analytics</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔔</span>
                <span>Receive smart budget alerts and reminders</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}" class="cta-button">
                Start Tracking Now →
              </a>
            </div>
            
            <div class="footer">
              <p>Need help? We're here for you!</p>
              <p>© ${new Date().getFullYear()} Credit Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't throw error for welcome email as it's not critical
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();