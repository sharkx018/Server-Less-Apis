// test.js
import { handler } from './index.mjs';

// Simulate the event object you would send to Lambda
const events = [
    {
        // Your event data here
        data:{ x: 0, y: 1},
        event:"ADDITION",
    },
    {
        // Your event data here
        data:{ x: 10, y: 3},
        event:"SUBTRACTION",
    },
    {
        // Your event data here
        data:{ x: 10, y: 3},
        event:"DIVISION",
    },
    {
        // Your event data here
        data:{ x: 10, y: 3},
        event:"MULTIPLICATION",
    },
    {
        // Your event data here
        data:{ url: 'https://jsonplaceholder.typicode.com/users'},
        event:"API_FETCH",
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
