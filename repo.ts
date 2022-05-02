import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

export const getRepoVersion = () => {
    return readFileSync("VERSION");
}

export const updateRepoVersion = async (version: string) => {
    await promisify(exec)(`make update-version --VERSION=${version}`);
}