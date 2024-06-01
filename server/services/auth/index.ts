import fs from "fs";
import path from "path";
import { filesDirPath } from "../constants";
import random from "@cch137/utils/random";

const auth = {
  isPin(pin: string) {
    const userDirname = path.join(filesDirPath, pin);
    if (!fs.existsSync(userDirname)) return false;
    return fs.statSync(userDirname).isDirectory();
  },
  generatePin() {
    let i = 3;
    while (i--) {
      const pin = random.base16(10).toUpperCase();
      if (auth.isPin(pin)) continue;
      return pin;
    }
    throw new Error("Failed to generate pin");
  },
};

export default auth;
