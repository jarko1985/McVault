const { sendEmail } = require("@/lib/email");
const { connectToDatabase } = require("@/lib/mongodb");
const { default: Document } = require("@/models/Document");
const { NextResponse } = require("next/server");
import cron from 'node-cron';

async function checkAndSendEmail(){
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiringDocuments = await Document.find({
        expiryDate:{$lte:today}
    });
    
    console.log(expiringDocuments);
    
    if(expiringDocuments.length>0){
        let emailContent  = "The following documents have expired or are expiring today:\n\n";
        expiringDocuments.forEach((doc) => {
            emailContent += `📌 ${doc.name} (Expires on: ${new Date(doc.expiryDate).toDateString()})\n`;
          });
          await sendEmail(process.env.EMAIL_RECIPIENT, "Expiring Documents Alert", emailContent);
    }
}

cron.schedule("0 0 * * *",async()=>{
    console.log('Running expiry check...');
    await checkAndSendEmail();
});

export async function GET() {
    await checkAndSendEmail();
    return NextResponse.json({ message: "Manual check triggered." });
  }