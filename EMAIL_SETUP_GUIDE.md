# Email System Setup Guide

## Overview
The email management system has been set up with three email addresses:
- **admin@ypilo.com** - Administrative correspondence
- **support@ypilo.com** - Customer support inquiries
- **order@ypilo.com** - Custom project orders

## Current Implementation
Currently, the system provides:
1. Admin panel at `/admin228/emails` to view and manage emails
2. Database storage for email records
3. Interface to read emails and reply to them
4. Email filtering by mailbox

## Setting Up Real Email Integration

To connect real email accounts, you need to:

### 1. Set up Email Hosting
You can use:
- **Google Workspace** (professional email on your domain)
- **Microsoft 365**
- **Cloudflare Email Routing** (free forwarding)
- **Zoho Mail** (free for up to 5 users)
- Any IMAP/SMTP provider

### 2. Install Required Packages
```bash
cd /srv/COMPANY
npm install nodemailer imap-simple mailparser
```

### 3. Add Environment Variables
Add to your `.env` file:
```
# SMTP Settings (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@ypilo.com
SMTP_PASSWORD=your-app-password

# IMAP Settings (for receiving emails)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@ypilo.com
IMAP_PASSWORD=your-app-password
IMAP_TLS=true
```

### 4. Create Email Sync Service
Create a background service that periodically checks for new emails and stores them in the database.

File: `src/lib/email-sync.ts`
```typescript
import Imap from imap-simple
import { simpleParser } from mailparser
import { prisma } from ./prisma

export async function syncEmails() {
  const config = {
    imap: {
      user: process.env.IMAP_USER!,
      password: process.env.IMAP_PASSWORD!,
      host: process.env.IMAP_HOST!,
      port: parseInt(process.env.IMAP_PORT!),
      tls: process.env.IMAP_TLS === true,
      authTimeout: 10000
    }
  }

  try {
    const connection = await Imap.connect(config)
    await connection.openBox(INBOX)
    
    const searchCriteria = [UNSEEN]
    const fetchOptions = {
      bodies: [],
      markSeen: false
    }
    
    const messages = await connection.search(searchCriteria, fetchOptions)
    
    for (const message of messages) {
      const all = message.parts.find(part => part.which === )
      const parsed = await simpleParser(all.body)
      
      await prisma.email.create({
        data: {
          from: parsed.from?.text || ,
          to: parsed.to?.text || ,
          subject: parsed.subject || ,
          body: parsed.text || parsed.html || 
        }
      })
    }
    
    connection.end()
  } catch (error) {
    console.error(Email sync error:, error)
  }
}
```

### 5. Create Email Sending Service
File: `src/lib/email-sender.ts`
```typescript
import nodemailer from nodemailer

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!
  }
})

export async function sendEmail(to: string, subject: string, body: string, replyTo?: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER!,
      to,
      subject,
      text: body,
      replyTo
    })
    return true
  } catch (error) {
    console.error(Send email error:, error)
    return false
  }
}
```

### 6. Set up Cron Job for Email Sync
Add to `ecosystem.config.js`:
```javascript
{
  name: email-sync,
  script: node,
  args: -e require("./dist/lib/email-sync").syncEmails(),
  cron_restart: */5 add_reactions_endpoints.js add_rules_endpoints.js add_team_chat_endpoints.js cache config File fix_ai_chat_default.js fix_user_ids.js glibc-2.28 glibc-2.28.tar.gz lonestar-chat npm-debug.log snap update_css.py vscode_1.85.deb add_reactions_endpoints.js add_rules_endpoints.js add_team_chat_endpoints.js cache config File fix_ai_chat_default.js fix_user_ids.js glibc-2.28 glibc-2.28.tar.gz lonestar-chat npm-debug.log snap update_css.py vscode_1.85.deb add_reactions_endpoints.js add_rules_endpoints.js add_team_chat_endpoints.js cache config File fix_ai_chat_default.js fix_user_ids.js glibc-2.28 glibc-2.28.tar.gz lonestar-chat npm-debug.log snap update_css.py vscode_1.85.deb *, // Every 5 minutes
  autorestart: false
}
```

### 7. Update Email Reply API
Modify `/src/app/api/emails/[id]/route.ts` to actually send emails when replying.

## Recommended: Cloudflare Email Routing (Free)
1. Go to Cloudflare Dashboard
2. Select your domain (ypilo.com)
3. Go to Email → Email Routing
4. Enable Email Routing
5. Add destination addresses
6. Create routing rules for admin@, support@, and order@ypilo.com

## Alternative: Using Webhooks
Instead of IMAP polling, you can use:
- **SendGrid Inbound Parse** - Webhook for incoming emails
- **Mailgun Routes** - Forward emails to your API endpoint
- **Postmark Inbound** - Webhook integration

## Testing
1. Send a test email to order@ypilo.com
2. Log in as admin to `/admin228/emails`
3. Check if the email appears in the inbox
4. Try replying to the email

## Security Notes
- Store email passwords securely in environment variables
- Use app-specific passwords (not your main account password)
- Enable 2FA on email accounts
- Regularly rotate credentials
- Implement rate limiting on email APIs

## Support
For issues with email setup, contact your hosting provider or email service documentation.
