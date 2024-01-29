import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const create = async () => {
    const filePath = path.join(__dirname, 'files', 'fresh.txt');
    const fileContent = 'I am fresh and young';

    try {
        // Check if the file already exists
        await fsPromises.access(filePath);

        // If access does not throw an error, the file exists
        throw new Error('FS operation failed: File already exists');
    } catch (error) {
        // If the file does not exist, create it
        if (error.code === 'ENOENT') {
            await fsPromises.writeFile(filePath, fileContent);
            console.log('File created successfully.');
        } else {
            // If the error is different from file not found, rethrow it
            throw error;
        }
    }
};

// Call the create function
create().catch((error) => console.error(error.message));