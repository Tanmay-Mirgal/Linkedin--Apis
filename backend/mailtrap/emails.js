import { WELCOME_EMAIL,CONNECTION_ACCEPTED_EMAIL,COMMENT_NOTIFICATION_EMAIL } from './emailTemplate.js';
import {mailtrapClient,sender} from './mailtrap.config.js';

export const sendWelcomeEmail = async (email,name,profileUrl)=>{
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Welcome to Linkedin",
            html:WELCOME_EMAIL(name,profileUrl),
            category:"Welcome Email",

        })
        console.log("Welcome Email sent successfully",response);
    } catch (error) {
        throw new Error ("Could not send welcome email",error);
    }
}
export const sendConnectionAcceptedEmail = async (senderName, recipientName, profileUrl)=>{

}
export const sendCommentNotificationEmail = async (recipientName, commenterName, postUrl, commentContent)=>{
    
}