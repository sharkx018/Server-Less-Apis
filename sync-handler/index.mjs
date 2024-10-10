import axios from 'axios';

const ADDITION = "ADDITION"
const SUBTRACTION = "SUBTRACTION"
const DIVISION = "DIVISION"
const MULTIPLICATION = "MULTIPLICATION"
const API_FETCH = "API_FETCH"

const SupportedEventTypes = [ADDITION, SUBTRACTION, DIVISION, MULTIPLICATION, API_FETCH]
export const handler = async (ee, context, callback) => {


    let { data, event } = ee

    if(data.x != ''){
        data.x = parseInt(data?.x, 10)
    }

    if(data.y != ''){
        data.y = parseInt(data?.y, 10)
    }




    const isError = validateBody(ee)

    if(isError){
        console.error('Validation Failed:', isError);
        callback(null, {"message":"Validation Error", ...isError})
        return
    }

    const message = {
        data,
        event,
        jobId: new Date().getTime().toString()
    };


    try {

        // Send message to the SQS queue
        const result = await getResult(message)
        
        let res ={
            statusCode: 200,
            body: { message: 'Request processed!', data: result },
        }
        // Return success response
        callback(null,  res)

    } catch (error) {
        console.error('Error sending message to SQS:', error);
        callback(error)
    }
};



async function getResult(payload) {
    const { data, event } = payload;

    console.log("sync-handler", {data, event})

    try {
        switch (event) {
            case ADDITION:
                return {
                    result: data.x + data.y,
                    message: 'Addition performed successfully.'
                };

            case SUBTRACTION:
                return {
                    result: data.x - data.y,
                    message: 'Subtraction performed successfully.'
                };

            case DIVISION:
                if (data.y === 0) {
                    return {
                        error: 'Division by zero is not allowed.',
                        message: 'Please provide a non-zero value for "y".'
                    };
                }
                return {
                    result: data.x / data.y,
                    message: 'Division performed successfully.'
                };

            case MULTIPLICATION:
                return {
                    result: data.x * data.y,
                    message: 'Multiplication performed successfully.'
                };

            case API_FETCH:
                // Fetch data from the provided URL using axios
                const response = await axios.get(data.url);
                return {
                    result: response.data,
                    message: 'Data fetched successfully from the API.'
                };

            default:
                return {
                    error: `Unsupported event type: "${event}".`,
                    message: 'The provided event type is not supported.'
                };
        }
    } catch (error) {
        return {
            error: error.message,
            message: 'An error occurred while processing the request.'
        };
    }
}


function validateBody(payload) {
    const { data, event } = payload;



    // Check for common fields
    if (!event) {
        return {
            error: 'The "event" field is required.',
            sample: {
                event: 'ADDITION',
                data: { x: 10, y: 3 }
            }
        };
    }

    if (!data) {
        return {
            error: 'The "data" field is required.',
            sample: {
                event,
                data: {} // Varies by event type
            }
        };
    }

    // Validate based on event type
    switch (event) {
        case 'ADDITION':
        case 'SUBTRACTION':
        case 'DIVISION':
        case 'MULTIPLICATION':

            // Check if parsing was successful
            if (isNaN(data.x) || isNaN(data.y)) {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: 'Invalid input. Both x and y must be numbers.',
                    }),
                });
            }

            if (data.x === '' || data.y === '' || data.x === undefined || data.y === undefined) {
                return {
                    error: `The "data" field must include "x" and "y" for the "${event}" event.`,
                    sample: {
                        event,
                        data: { x: 10, y: 3 }
                    }
                };
            }
            break;

        case 'API_FETCH':
            if (!data.url) {
                return {
                    error: 'The "data" field must include "url" for the "API_FETCH" event.',
                    sample: {
                        event: 'API_FETCH',
                        data: { url: 'https://jsonplaceholder.typicode.com/users' }
                    }
                };
            }
            break;

        default:
            return {
                error: `Unsupported event type: "${event}".`,
                sample: {
                    event: SupportedEventTypes,
                    data: {} // Varies by supported event
                }
            };
    }

    // If everything is valid, return null for no errors
    return null;
}


