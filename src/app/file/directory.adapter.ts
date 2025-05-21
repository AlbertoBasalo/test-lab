import fs from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Directory adapter for file operations.
 */
export const directory = {
	/**
	 * Checks if a directory exists.
	 * @param path - The path to check.
	 * @returns True if the directory exists, false otherwise.
	 */
	async exists(path: string): Promise<boolean> {
		return await fs
			.access(path)
			.then(() => true)
			.catch(() => false);
	},
	/**
	 * Creates a directory.
	 * @param path - The path to create.
	 */
	async make(path: string): Promise<void> {
		const dirName = dirname(path);
		if (dirName && !(await directory.exists(dirName))) {
			await fs.mkdir(dirName, { recursive: true });
		}
	},
	/**
	 * Gets the name of a directory.
	 * @param path - The path to get the name of.
	 * @returns The name of the directory.
	 */
	async getName(path: string): Promise<string> {
		return dirname(path);
	},
	/**
	 * Reads a directory.
	 * @param path - The path to read.
	 * @returns The contents of the directory.
	 */
	async read(path: string): Promise<string[]> {
		return await fs.readdir(path);
	},
};
