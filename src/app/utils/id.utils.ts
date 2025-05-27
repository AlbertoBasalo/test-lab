import { file } from "../file/file.adapter.ts";

let last = 0;
let seed = 0;
/**No usar en la versión inicial, 
 * solo para demostrar la necesidad de DI 
 * y sustituir el file adapter (una dependencia del SUT)
 * por un fake
 * */
let _file = file;
/**
 * Utils for generating unique IDs
 */
export const idUtils = {
  /**
   * Generates a new ID
   * @returns A promise that resolves to the new ID
   */
  generate: async (): Promise<string> => {
    const currentSeed = await idUtils.getSeed();
    last++;
    return `${currentSeed}.${last}`;
  },
  /**
   * Extracts the seed from an ID
   * @param id - The ID to extract the seed from
   * @returns The seed from the ID
   */
  extractSeed: (id: string): number => {
    return Number.parseInt(id.split(".")[0]);
  },
  /**
   * Gets the current seed
   * @returns A promise that resolves to the current seed
   */
  getSeed: async () => {
    if (seed > 0) return seed;
    if (await _file.exists("seed.json")) {
      seed = await _file.readJson("seed.json");
    }
    seed++;
    await _file.writeJson("seed.json", seed);
    return seed;
  },
  /**
   * Gets the last number
   */
  get last(): number {
    return last;
  },
  /**
   * Gets the current seed
   */
  get seed(): number {
    return seed;
  },
  /**
   * DI for testing
   */
  set file(value: typeof file) {
    _file = value;
    last = 0;
    seed = 0;
  },
};
