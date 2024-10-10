// test.js
import { handler } from './index.mjs';

// Simulate the event object you would send to Lambda
const event = {
    Records:[
        {
            body: JSON.stringify({
                event:"WEBHOOK_HIT",
                jobId: new Date().getTime().toString(),
                data: {
                    name:"mukul",
                    age:28
                },
                webhookUrl: "https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",

            })
        },
        {
            body: JSON.stringify({
                event:"GENERATE_REPORT",
                jobId: new Date().getTime().toString(),
                data: {
                    reportType:"sales",// sales, activity, summary
                    userId:"897",
                },
                webhookUrl: "https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",

            })
        },
        {
            body: JSON.stringify({
                event:"FILE_UPLOAD",
                jobId: new Date().getTime().toString(),
                data: {
                    fileName:"abc.txt",
                    fileSize:"12KB"
                },
                webhookUrl: "https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",

            })
        },
        {
            body: JSON.stringify({
                event:"TRAIN_MODEL",
                jobId: new Date().getTime().toString(),
                data: {
                    modelName:"delta-x",
                    trainingDataSize:"3400",
                    epochs:"1000"
                },
                webhookUrl: "https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",

            })
        },
        {
            body: JSON.stringify({
                event:"DATA_IMPORT",
                jobId: new Date().getTime().toString(),
                data: {
                    dataSource: "s3-bucket",
                    recordsCount:"22"
                },
                webhookUrl: "https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",

            })
        }
    ]
    // Your event data here
    
};

const context = {}; // You can add any context properties you need
const callback = (error, result) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Result:', result);
    }
};

// Invoke the Lambda handler
handler(event, context, callback);
