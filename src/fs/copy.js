import { promises as fsPromises, readdir, lstat, copyFile } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copy = async () => {
    const sourceFolderPath = path.join(__dirname, 'files');
    const destinationFolderPath = path.join(__dirname, 'files_copy');

    try {
        // Check for source and destination
        await fsPromises.access(sourceFolderPath);
        await fsPromises.access(destinationFolderPath);

        throw new Error('FS operation failed: Destination folder already exists');
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('FS operation failed: Source folder does not exist');
        } else if (error.code === 'EEXIST') {
            throw error;
        } else {
            await fsPromises.mkdir(destinationFolderPath);
            await copyFolderContents(sourceFolderPath, destinationFolderPath);

            console.log('Folder copied successfully.');
        }
    }
};

const copyFolderContents = async (source, destination) => {
    const entries = await readdir(source);

    for (const entry of entries) {
        const sourcePath = path.join(source, entry);
        const destinationPath = path.join(destination, entry);

        const stat = await lstat(sourcePath);

        if (stat.isDirectory()) {
            // Copy files from directory
            await fsPromises.mkdir(destinationPath);
            await copyFolderContents(sourcePath, destinationPath);
        } else {
            // Copy file
            await copyFile(sourcePath, destinationPath);
        }
    }
};

// Call function
copy().catch((error) => console.error(error.message));