import fs from 'fs';
import puppeteer from 'puppeteer-core';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QuickShow Project Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: auto; padding: 20px; }
        h1, h2, h3 { color: #222; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 4px; font-family: monospace; }
        .mermaid { text-align: center; margin: 30px 0; }
        .page-break { page-break-before: always; }
    </style>
    <!-- Include Mermaid.js -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>mermaid.initialize({startOnLoad:true});</script>
</head>
<body>
    <h1>QuickShow Project Analysis Report</h1>
    <p>This report provides a comprehensive architectural and workflow analysis of the <strong>QuickShow</strong> platform.</p>
    
    <h2>1. Architecture Overview</h2>
    <p>QuickShow follows a standard <strong>MERN (MongoDB, Express, React, Node.js)</strong> architecture.</p>
    <ul>
        <li><strong>Frontend:</strong> React 19 powered by Vite, styled with TailwindCSS v4. Uses Clerk for authentication.</li>
        <li><strong>Backend:</strong> Node.js with Express.js. Secured via Clerk Express SDK.</li>
        <li><strong>Database:</strong> MongoDB via Mongoose.</li>
        <li><strong>Background Jobs:</strong> Inngest handles asynchronous, event-driven tasks.</li>
    </ul>

    <h2>2. System Workflow & Functionality Diagram</h2>
    <p>Below is a diagram illustrating the core functionality of QuickShow, particularly the Booking and 10-Minute Seat Lock Workflow.</p>
    
    <div class="mermaid">
    sequenceDiagram
        participant User
        participant Frontend
        participant Backend
        participant MongoDB
        participant Stripe
        participant Inngest
        
        User->>Frontend: Select Movie & Seats
        Frontend->>Backend: Request Checkout (Lock Seats)
        Backend->>MongoDB: Create Pending Booking & Lock Seats
        Backend->>Stripe: Create Payment Session
        Stripe-->>Backend: Return Checkout URL
        Backend-->>Frontend: Send Checkout URL
        Backend->>Inngest: Dispatch 10-Minute Expiry Timer
        Frontend->>User: Redirect to Stripe Payment
        
        alt Payment Successful within 10 mins
            Stripe->>Backend: Webhook (Payment Success)
            Backend->>MongoDB: Update Booking to Confirmed
            Backend->>Inngest: Cancel Expiry Timer
            Backend->>Inngest: Schedule Reminder Email (8 hours before show)
            Backend-->>User: Send Confirmation Email
        else Timer Expires (No Payment)
            Inngest->>Backend: Timer Triggered
            Backend->>MongoDB: Cancel Booking & Release Seats
        end
    </div>

    <div class="page-break"></div>

    <h2>3. Key Workflows Explained</h2>
    <h3>A. The Booking & 10-Minute Lock Mechanism</h3>
    <p>To prevent double-booking, the system uses a robust locking mechanism:</p>
    <ol>
        <li><strong>Seat Selection:</strong> Users pick available seats for a specific Show.</li>
        <li><strong>Checkout Initiation:</strong> The backend creates a Booking document with a "pending" status and locks the selected seats.</li>
        <li><strong>Background Timer:</strong> An <code>inngest</code> job is dispatched with a 10-minute delay. If payment is not confirmed within this window, the job automatically releases the locked seats and cancels the pending booking.</li>
    </ol>

    <h3>B. Secure Payments (Stripe)</h3>
    <p>The checkout process is securely handled off-platform by Stripe. Once the payment succeeds, Stripe fires a webhook event. The backend listens for this event, verifies the signature, and updates the Booking status to "confirmed".</p>

    <h3>C. Event-Driven Email Notifications</h3>
    <p>QuickShow uses Nodemailer combined with Brevo (SMTP) to send transactional emails. Upon successful payment, a booking confirmation email is dispatched immediately. Another <code>inngest</code> job is queued to send a reminder email to the user exactly 8 hours before the show begins.</p>
</body>
</html>
`;

fs.writeFileSync('report.html', htmlContent);

(async () => {
  const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  let executablePath = paths.find(p => fs.existsSync(p));
  
  if (!executablePath) {
      console.error('Could not find a browser executable on this machine to render PDF.');
      process.exit(1);
  }

  const browser = await puppeteer.launch({ executablePath });
  const page = await browser.newPage();
  
  // Load the HTML file
  await page.goto(`file://${process.cwd()}/report.html`, { waitUntil: 'networkidle0' });
  
  // Wait a little extra time for Mermaid to render completely
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.pdf({
    path: '../QuickShow_Report.pdf',
    format: 'A4',
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    printBackground: true
  });
  
  await browser.close();
  console.log('PDF generated successfully!');
})();
