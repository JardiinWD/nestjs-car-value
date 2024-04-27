// In this file we define the global beforeEach function
// That will be executed before each test, deleting all files in the test folder
// and the sql database

import { rm } from "fs/promises";
import { join } from "path";

// Create a global beforeEach function
global.beforeEach(async () => {
    try {
        // Delete the sql database
        await rm(join(__dirname, "..", "test.sqlite"));
    } catch (error) { }
})