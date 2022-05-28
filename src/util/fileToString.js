import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** File To String
 * Given the path to a file, this function reads the entire contents
 * of that file and returns a string with the contents.
 *
 * @param {string} filePath       realtive or absolute path to the file
 * @param {boolean} [absolute]    set to true if path is absolute
 * @returns                       string with the file contents
 */
export const fileToString = (filePath, absolute = false) => {
    return fs.readFileSync(
        absolute ? filePath : path.resolve(__dirname, filePath),
        { encoding: "utf8" }
    );
};
