// test.js
import { handler } from './index.mjs';

// Simulate the event object you would send to Lambda
const events = [
    {
        // Your event data here
        data:{ name: 'mukul', aged: 28 },
        event:"WEBHOOK_HIT",
        webhookUrl:"https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",
    },
    {
        // Your event data here
        data:{ reportType: 'sales', userId: '897' },
        event:"GENERATE_REPORT",
        webhookUrl:"https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",
    },
    {
        // Your event data here
        data:{ fileName: 'abc.txt', fileSize: '12KB' },
        event:"FILE_UPLOAD",
        webhookUrl:"https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",
    },
    {
        // Your event data here
        data:{ modelName: 'delta-x', trainingDataSize: '3400', epochs: '1000' },
        event:"TRAIN_MODEL",
        webhookUrl:"https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",
    },
    {
        // Your event data here
        data:{ dataSource: 's3-bucket', recordsCount: '22' },
        event:"DATA_IMPORT",
        webhookUrl:"https://webhook.site/fb396b89-b1b1-420d-ad2e-273f741c2af0",
    }
];

const context = {}; // You can add any context properties you need
const callback = (error, result) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Result:', result);
    }
};

// Invoke the Lambda handler
handler(events[0], context, callback);
