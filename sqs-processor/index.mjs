import axios from 'axios';

const WEBHOOK_HIT = "WEBHOOK_HIT"
const GENERATE_REPORT = "GENERATE_REPORT"
const FILE_UPLOAD = "FILE_UPLOAD"
const TRAIN_MODEL = "TRAIN_MODEL"
const DATA_IMPORT = "DATA_IMPORT"

export const handler = async (event) => {


    
    for (const record of event.Records) {


        try {
            let payload = JSON.parse(record.body)

            console.log("sqs-processor started", JSON.stringify(payload))

            switch (payload.event) {
                case WEBHOOK_HIT:
                    await processWebhook(payload)
                    break
                case GENERATE_REPORT:
                    await generateReport(payload)
                    break
                case FILE_UPLOAD:
                    await fileUpload(payload)
                    break
                case TRAIN_MODEL:
                    await trainModel(payload)
                    break
                case DATA_IMPORT:
                    await dataImport(payload)
                    break

            }

        } catch (error) {
            console.error('Error processing message:', error);
        }
    }
};

async function processWebhook(payload) {

    const { data, webhookUrl, jobId, } = payload;

    // Process data (simulate a time-consuming task)
    console.log(`For jobId ${jobId}, data is :` ,JSON.stringify(data));


    // Send result to the client’s webhook
    if (webhookUrl) {
        let webhookRes = await axios.post(webhookUrl, data);
        console.log(`Successfully processed jobId: ${jobId}, result:`,JSON.stringify(webhookRes?.data));
    }

    console.log('Successfully processed!!!');

}


async function generateReport(payload) {

    const { data, webhookUrl, jobId } = payload;

    // Process data (simulate a time-consuming task)
    console.log(`For jobId ${jobId}, data is :` ,JSON.stringify(data));

    const reportData = await generateDummyReport(data.reportType, data.userId);

    // Send result to the client’s webhook
    if (webhookUrl) {
        let webhookRes = await axios.post(webhookUrl, reportData);
        console.log(`Successfully processed jobId: ${jobId}, result:`,JSON.stringify(webhookRes?.data));
    }

    console.log('Successfully processed!!!');

}


// Simulate generating a dummy report with data
async function generateDummyReport(reportType, userId) {
    // Simulating a time-consuming task with a delay (e.g., 2 seconds)
    // await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate dummy data based on the report type
    const reportData = {
        userId,
        reportType,
        generatedAt: new Date().toISOString(),
        data: []
    };

    switch (reportType) {
        case 'sales':
            reportData.data = generateSalesData();
            break;
        case 'activity':
            reportData.data = generateActivityData(userId);
            break;
        case 'summary':
            reportData.data = generateSummaryData(userId);
            break;
        default:
            throw new Error('Unsupported report type');
    }

    return reportData;
}

// Function to generate dummy sales data
function generateSalesData() {
    return [
        { date: '2024-10-01', totalSales: 1500, transactions: 30 },
        { date: '2024-10-02', totalSales: 2000, transactions: 45 },
        { date: '2024-10-03', totalSales: 1700, transactions: 38 },
    ];
}

// Function to generate dummy activity data for a user
function generateActivityData() {
    return [
        { date: '2024-10-01', activity: 'Logged in', details: 'User logged in from web' },
        { date: '2024-10-02', activity: 'Viewed report', details: 'User viewed the sales report' },
        { date: '2024-10-03', activity: 'Made a purchase', details: 'User purchased a product worth $150' },
    ];
}

// Function to generate a summary report for a user
function generateSummaryData(userId) {
    return {
        userId,
        totalSales: 5200,
        totalTransactions: 113,
        lastLogin: '2024-10-03T14:30:00Z',
        activeDays: ['2024-10-01', '2024-10-02', '2024-10-03'],
    };
}


async function fileUpload(payload){

    const { webhookUrl, jobId } = payload;
    const { fileName, fileSize } = payload.data;

    try {
        // Validate input
        if (!fileName || !fileSize) {
            console.log({ error: 'fileName and fileSize are required' })
            return
        }

        // Simulate file processing with a delay
        const result = await processFile(fileName, fileSize);

        if (webhookUrl) {
            let webhookRes = await axios.post(webhookUrl, result);
            console.log(`Successfully processed jobId: ${jobId}, result:`,JSON.stringify(webhookRes?.data));
        }

        // Return the processed result
        console.log({
            message: 'File processed successfully',
            result,
        })

    } catch (error) {
        console.error('Error processing file:', error);
    }
}

// Function to simulate file processing
async function processFile(fileName, fileSize) {
    // Simulate a time-consuming file processing task (e.g., 3 seconds)
    // await new Promise(resolve => setTimeout(resolve, 3000));

    return {
        fileName,
        fileSize,
        processedAt: new Date().toISOString(),
        status: 'Processed',
        details: 'File has been successfully processed and saved.',
    };
}

async function trainModel(payload){

    const { modelName, trainingDataSize, epochs } = payload.data;
    const { webhookUrl, jobId } = payload;

    try {
        // Validate input
        if (!modelName || !trainingDataSize || !epochs) {
            console.log({ error: 'modelName, trainingDataSize, and epochs are required' });
            return
        }

        // Simulate model training with a delay
        const result = await trainModelProcess(modelName, trainingDataSize, epochs);

        if (webhookUrl) {
            let webhookRes = await axios.post(webhookUrl, result);
            console.log(`Successfully processed jobId: ${jobId}, result:`,JSON.stringify(webhookRes?.data));
        }

        // Return the training result
        console.log({
            message: 'Model training completed successfully',
            result,
        });
    } catch (error) {
        console.error('Error training model:', error);

    }

}

// Function to simulate model training
async function trainModelProcess(modelName, trainingDataSize, epochs) {
    // Simulate a time-consuming training task (e.g., 5 seconds)
    // await new Promise(resolve => setTimeout(resolve, 5000));

    return {
        modelName,
        trainingDataSize,
        epochs,
        trainedAt: new Date().toISOString(),
        accuracy: `${Math.floor(Math.random() * 20) + 80}%`, // Random accuracy between 80% to 99%
        status: 'Trained',
        details: 'Model training completed with the specified parameters.',
    };
}

async function dataImport(payload){
    const { dataSource, recordsCount } = payload.data;
    const { webhookUrl, jobId } = payload;

    try {
        // Validate input
        if (!dataSource || !recordsCount) {
            console.log({ error: 'dataSource and recordsCount are required' });
            return
        }

        // Simulate data import with a delay
        const result = await importData(dataSource, recordsCount);

        if (webhookUrl) {
            let webhookRes = await axios.post(webhookUrl, result);
            console.log(`Successfully processed jobId: ${jobId}, result:`,JSON.stringify(webhookRes?.data));
        }

        // Return the import result
        console.log({
            message: 'Data import completed successfully',
            result,
        });
    } catch (error) {
        console.error('Error importing data:', error);
    }
}

// Function to simulate data import
async function importData(dataSource, recordsCount) {
    // Simulate a time-consuming data import task (e.g., 4 seconds)
    // await new Promise(resolve => setTimeout(resolve, 4000));

    return {
        dataSource,
        recordsCount,
        importedAt: new Date().toISOString(),
        status: 'Imported',
        details: 'Data has been successfully imported from the specified source.',
    };
}
