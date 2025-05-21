import fs from "node:fs/promises";
import { directory } from "./directory.adapter.ts";

const ENCODING = "utf-8";

/**
 * File adapter for file operations.
 */
export const file = {
  /**
   * Reads a file.
   * @param path - The path to read.
   * @returns The contents of the file.
   */
  async read(path: string): Promise<string> {
    const content = await fs.readFile(path, ENCODING);
    return content;
  },
  /**
   * Reads a JSON file.
   * @param path - The path to read.
   * @returns The contents of the file.
   */
  async readJson<T>(path: string): Promise<T> {
    const content = await file.read(path);
    return JSON.parse(content) as T;
  },
  /**
   * Writes a file.
   * @param path - The path to write.
   * @param content - The contents to write.
   */
  async write(path: string, content: string): Promise<void> {
    await directory.make(path);
    await fs.writeFile(path, content, ENCODING);
  },
  /**
   * Appends a line to a file.
   * @param path - The path to append to.
   * @param content - The contents to append.
   */
  async appendLine(path: string, content: string): Promise<void> {
    await directory.make(path);
    await fs.appendFile(path, `${content}\n`, ENCODING);
  },
  /**
   * Writes a JSON file.
   * @param path - The path to write.
   * @param content - The contents to write.
   */
  async writeJson(path: string, content: unknown): Promise<void> {
    await file.write(path, JSON.stringify(content));
  },
  /**
   * Deletes a file.
   * @param path - The path to delete.
   */
  async delete(path: string): Promise<void> {
    await fs.unlink(path);
  },

  /**
   * Checks if a file exists.
   * @param path - The path to check.
   * @returns True if the file exists, false otherwise.
   */
  async exists(path: string): Promise<boolean> {
    return await fs
      .access(path)
      .then(() => true)
      .catch(() => false);
  },
};
