import AWS from 'aws-sdk';

const sqs = new AWS.SQS({ region: 'ap-south-1' });

const WEBHOOK_HIT = "WEBHOOK_HIT"
const GENERATE_REPORT = "GENERATE_REPORT"
const FILE_UPLOAD = "FILE_UPLOAD"
const TRAIN_MODEL = "TRAIN_MODEL"
const DATA_IMPORT = "DATA_IMPORT"

const SupportedEventTypes = [WEBHOOK_HIT, GENERATE_REPORT, FILE_UPLOAD, FILE_UPLOAD, TRAIN_MODEL, DATA_IMPORT]
export const handler = async (ee, context, callback) => {


    const { data, webhookUrl, event } = ee

    const isError = validateBody(ee)

    if(isError){
        console.error('Validation Failed:', isError);
        callback(null, {"message":"Validation Error", ...isError})
        return
    }

    const message = {
        data,
        webhookUrl,
        event,
        jobId: new Date().getTime().toString()
    };

    // Define the SQS message parameters
    const params = {
        QueueUrl: 'https://sqs.ap-south-1.amazonaws.com/010928179432/myQueue',
        MessageBody: JSON.stringify(message),
    };

    try {
        // Send message to the SQS queue
        const data = await sqs.sendMessage(params).promise();
        console.log('Message successfully sent to SQS:', data.MessageId);
        
        let res ={
            statusCode: 200,
            body: { message: 'Request received and queued', messageId: data.MessageId },
        }
        // Return success response
        callback(null,  res)

    } catch (error) {
        console.error('Error sending message to SQS:', error);
        callback(error)
    }
};

function validateBody(payload) {
    const { data, webhookUrl, event } = payload;

    // Check for common fields
    if (!event) {
        return {
            error: 'The "event" field is required.',
            sample: {
                event: 'WEBHOOK_HIT',
                data: { name: 'mukul', age: 28 },
                webhookUrl: 'https://webhook.site/your-webhook-url',
            }
        };
    }

    if (!webhookUrl) {
        return {
            error: 'The "webhookUrl" field is required.',
            sample: {
                event,
                data: {}, // Varies by event type
                webhookUrl: 'https://webhook.site/your-webhook-url',
            }
        };
    }

    if (!data) {
        return {
            error: 'The "data" field is required.',
            sample: {
                event,
                data: {}, // Varies by event type
                webhookUrl: 'https://webhook.site/your-webhook-url',
            }
        };
    }

    // Validate based on event type
    switch (event) {
        case 'WEBHOOK_HIT':
            if (!data.name || !data.age) {
                return {
                    error: 'The "data" field must include "name" and "age" for the "WEBHOOK_HIT" event.',
                    sample: {
                        event: 'WEBHOOK_HIT',
                        data: { name: 'mukul', age: 28 },
                        webhookUrl: 'https://webhook.site/your-webhook-url',
                    }
                };
            }
            break;

        case 'GENERATE_REPORT':
            if (!data.reportType || !data.userId) {
                return {
                    error: 'The "data" field must include "reportType" and "userId" for the "GENERATE_REPORT" event.',
                    sample: {
                        event: 'GENERATE_REPORT',
                        data: { reportType: 'sales', userId: '897' },
                        webhookUrl: 'https://webhook.site/your-webhook-url',
                    }
                };
            }
            break;

        case 'FILE_UPLOAD':
            if (!data.fileName || !data.fileSize) {
                return {
                    error: 'The "data" field must include "fileName" and "fileSize" for the "FILE_UPLOAD" event.',
                    sample: {
                        event: 'FILE_UPLOAD',
                        data: { fileName: 'abc.txt', fileSize: '12KB' },
                        webhookUrl: 'https://webhook.site/your-webhook-url',
                    }
                };
            }
            break;

        case 'TRAIN_MODEL':
            if (!data.modelName || !data.trainingDataSize || !data.epochs) {
                return {
                    error: 'The "data" field must include "modelName", "trainingDataSize", and "epochs" for the "TRAIN_MODEL" event.',
                    sample: {
                        event: 'TRAIN_MODEL',
                        data: {
                            modelName: 'delta-x',
                            trainingDataSize: '3400',
                            epochs: '1000'
                        },
                        webhookUrl: 'https://webhook.site/your-webhook-url',
                    }
                };
            }
            break;

        case 'DATA_IMPORT':
            if (!data.dataSource || !data.recordsCount) {
                return {
                    error: 'The "data" field must include "dataSource" and "recordsCount" for the "DATA_IMPORT" event.',
                    sample: {
                        event: 'DATA_IMPORT',
                        data: {
                            dataSource: 's3-bucket',
                            recordsCount: '22'
                        },
                        webhookUrl: 'https://webhook.site/your-webhook-url',
                    }
                };
            }
            break;

        default:
            return {
                error: `Unsupported event type: ${event}.`,
                sample: {
                    event: SupportedEventTypes,
                    data: {}, // Varies by supported event
                    webhookUrl: 'https://webhook.site/your-webhook-url',
                }
            };
    }

    // If everything is valid, return null for no errors
    return null;
}

