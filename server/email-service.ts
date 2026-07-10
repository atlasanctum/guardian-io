import nodemailer from "nodemailer";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface WeeklyDigestData {
  userName: string;
  userEmail: string;
  reportsSubmitted: number;
  incidentsReported: number;
  productsScanned: number;
  pointsEarned: number;
  newAchievements: Array<{
    name: string;
    icon: string;
  }>;
  communityRank: number;
  communitySize: number;
  impactMetrics: {
    workersProtected: number;
    speciesProtected: number;
    forestPreserved: string;
  };
}

export interface AchievementNotificationData {
  userName: string;
  userEmail: string;
  achievementName: string;
  achievementIcon: string;
  pointsEarned: number;
  unlockedAt: string;
}

export interface ReportEscalationData {
  userName: string;
  userEmail: string;
  reportId: string;
  reportType: string;
  escalationLevel: string;
  escalatedTo: string;
  timestamp: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private smtpHost: string = process.env.SMTP_HOST || "smtp.gmail.com",
    private smtpPort: number = parseInt(process.env.SMTP_PORT || "587"),
    private smtpUser: string = process.env.SMTP_USER || "",
    private smtpPassword: string = process.env.SMTP_PASSWORD || "",
    private fromEmail: string = process.env.FROM_EMAIL || "noreply@guardian-io.com",
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: this.smtpHost,
        port: this.smtpPort,
        secure: this.smtpPort === 465,
        auth: {
          user: this.smtpUser,
          pass: this.smtpPassword,
        },
      });

      console.log("Email service initialized");
    } catch (error) {
      console.error("Failed to initialize email service:", error);
    }
  }

  async sendWeeklyDigest(data: WeeklyDigestData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.warn("Email transporter not initialized");
        return false;
      }

      const template = this.generateWeeklyDigestTemplate(data);

      await this.transporter.sendMail({
        from: this.fromEmail,
        to: data.userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log(`Weekly digest sent to ${data.userEmail}`);
      return true;
    } catch (error) {
      console.error("Failed to send weekly digest:", error);
      return false;
    }
  }

  async sendAchievementNotification(data: AchievementNotificationData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.warn("Email transporter not initialized");
        return false;
      }

      const template = this.generateAchievementTemplate(data);

      await this.transporter.sendMail({
        from: this.fromEmail,
        to: data.userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log(`Achievement notification sent to ${data.userEmail}`);
      return true;
    } catch (error) {
      console.error("Failed to send achievement notification:", error);
      return false;
    }
  }

  async sendReportEscalationNotification(data: ReportEscalationData): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.warn("Email transporter not initialized");
        return false;
      }

      const template = this.generateReportEscalationTemplate(data);

      await this.transporter.sendMail({
        from: this.fromEmail,
        to: data.userEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.log(`Report escalation notification sent to ${data.userEmail}`);
      return true;
    } catch (error) {
      console.error("Failed to send report escalation notification:", error);
      return false;
    }
  }

  private generateWeeklyDigestTemplate(data: WeeklyDigestData): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
            .metric { display: inline-block; margin: 10px 15px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
            .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
            .achievement { display: inline-block; margin: 10px; text-align: center; }
            .achievement-icon { font-size: 32px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Guardian-IO Weekly Digest</h1>
              <p>Your weekly impact summary</p>
            </div>

            <div class="section">
              <h2>Hello ${data.userName}! 👋</h2>
              <p>Here's what you accomplished this week:</p>
            </div>

            <div class="section">
              <div class="metric">
                <div class="metric-value">${data.reportsSubmitted}</div>
                <div class="metric-label">Reports</div>
              </div>
              <div class="metric">
                <div class="metric-value">${data.incidentsReported}</div>
                <div class="metric-label">Incidents</div>
              </div>
              <div class="metric">
                <div class="metric-value">${data.productsScanned}</div>
                <div class="metric-label">Scans</div>
              </div>
              <div class="metric">
                <div class="metric-value">${data.pointsEarned}</div>
                <div class="metric-label">Points</div>
              </div>
            </div>

            ${
              data.newAchievements.length > 0
                ? `
              <div class="section">
                <h3>New Achievements Unlocked! 🎉</h3>
                ${data.newAchievements.map((a) => `<div class="achievement"><div class="achievement-icon">${a.icon}</div><p>${a.name}</p></div>`).join("")}
              </div>
            `
                : ""
            }

            <div class="section">
              <h3>Your Impact</h3>
              <p>Together with the community, you've helped:</p>
              <ul>
                <li>Protect ${data.impactMetrics.workersProtected.toLocaleString()} workers</li>
                <li>Protect ${data.impactMetrics.speciesProtected} endangered species</li>
                <li>Preserve ${data.impactMetrics.forestPreserved} of forest</li>
              </ul>
              <p>You're ranked #${data.communityRank} out of ${data.communitySize.toLocaleString()} community members!</p>
            </div>

            <div class="footer">
              <p>Guardian-IO • Transparent. Resilient. Regenerative.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Guardian-IO Weekly Digest

Hello ${data.userName}!

This week you:
- Submitted ${data.reportsSubmitted} reports
- Reported ${data.incidentsReported} incidents
- Scanned ${data.productsScanned} products
- Earned ${data.pointsEarned} points

Your Impact:
- Protected ${data.impactMetrics.workersProtected.toLocaleString()} workers
- Protected ${data.impactMetrics.speciesProtected} endangered species
- Preserved ${data.impactMetrics.forestPreserved} of forest

Community Rank: #${data.communityRank} of ${data.communitySize.toLocaleString()}

Guardian-IO • Transparent. Resilient. Regenerative.
    `;

    return {
      subject: `Your Guardian-IO Weekly Digest - ${new Date().toLocaleDateString()}`,
      html,
      text,
    };
  }

  private generateAchievementTemplate(data: AchievementNotificationData): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px; border-radius: 8px; text-align: center; }
            .achievement-badge { font-size: 80px; margin: 20px 0; }
            .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Achievement Unlocked! 🎉</h1>
              <div class="achievement-badge">${data.achievementIcon}</div>
              <h2>${data.achievementName}</h2>
              <p>+${data.pointsEarned} points earned</p>
            </div>

            <div class="section">
              <p>Congratulations ${data.userName}!</p>
              <p>You've unlocked the <strong>${data.achievementName}</strong> achievement on ${data.unlockedAt}.</p>
              <p>Keep up the amazing work protecting workers, wildlife, and the environment!</p>
            </div>

            <div class="footer">
              <p>Guardian-IO • Transparent. Resilient. Regenerative.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Achievement Unlocked! 🎉

${data.achievementIcon} ${data.achievementName}

Congratulations ${data.userName}!

You've unlocked the ${data.achievementName} achievement on ${data.unlockedAt}.
+${data.pointsEarned} points earned

Keep up the amazing work!

Guardian-IO • Transparent. Resilient. Regenerative.
    `;

    return {
      subject: `🎉 Achievement Unlocked: ${data.achievementName}`,
      html,
      text,
    };
  }

  private generateReportEscalationTemplate(data: ReportEscalationData): EmailTemplate {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Report Escalation Update</h1>
            </div>

            <div class="alert">
              <h3>Your report has been escalated! 📢</h3>
              <p>Report ID: <strong>${data.reportId}</strong></p>
            </div>

            <div class="section">
              <h3>Escalation Details</h3>
              <ul>
                <li><strong>Report Type:</strong> ${data.reportType}</li>
                <li><strong>Escalation Level:</strong> ${data.escalationLevel}</li>
                <li><strong>Escalated To:</strong> ${data.escalatedTo}</li>
                <li><strong>Date:</strong> ${data.timestamp}</li>
              </ul>
            </div>

            <div class="section">
              <p>Thank you for your courage in reporting this issue. Your anonymous report is helping create positive change.</p>
              <p>You can track the status of your report using your unique Report ID in the Guardian-IO app.</p>
            </div>

            <div class="footer">
              <p>Guardian-IO • Transparent. Resilient. Regenerative.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Report Escalation Update

Your report has been escalated!

Report ID: ${data.reportId}

Escalation Details:
- Report Type: ${data.reportType}
- Escalation Level: ${data.escalationLevel}
- Escalated To: ${data.escalatedTo}
- Date: ${data.timestamp}

Thank you for your courage in reporting this issue. Your anonymous report is helping create positive change.

You can track the status of your report using your unique Report ID in the Guardian-IO app.

Guardian-IO • Transparent. Resilient. Regenerative.
    `;

    return {
      subject: `Report Escalation Update - ID: ${data.reportId}`,
      html,
      text,
    };
  }
}

// Singleton instance
let emailService: EmailService | null = null;

export function initializeEmailService(): EmailService {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
}

export function getEmailService(): EmailService {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
}
