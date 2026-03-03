const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendTeamInvitation = async (recipientEmail, teamName, inviteToken, eventName) => {
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite/${inviteToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `Team Invitation: ${teamName} - ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">EventNexus Team Invitation</h2>
        <p>You've been invited to join the team <strong>${teamName}</strong> for the event <strong>${eventName}</strong>!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Team:</strong> ${teamName}</p>
          <p style="margin: 10px 0 0 0;"><strong>Event:</strong> ${eventName}</p>
        </div>
        
        <p>Click the button below to accept the invitation:</p>
        
        <a href="${inviteLink}" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Accept Invitation
        </a>
        
        <p style="color: #666; font-size: 14px;">Or copy this link: <br><a href="${inviteLink}">${inviteLink}</a></p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you don't have an account, you'll be asked to register first.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

module.exports = { sendTeamInvitation };
