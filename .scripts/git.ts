import { execFile } from "node:child_process";
import { promisify } from "node:util";
import * as path from "node:path";

const execFileAsync = promisify(execFile);

async function git(...args: string[]) {
  return execFileAsync("git", args);
}

async function commitDirWithFileNames(dir: string, baseMessage: string) {
  await git("reset");

  const { stdout } = await git("status", "--porcelain", "--", dir);

  const changedFiles = stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
    .filter(Boolean);

  if (changedFiles.length === 0) {
    console.log(`No changes detected in "${dir}".`);
    return;
  }

  await git("add", "--", dir);

  const fileNames = changedFiles
    .map((file) => path.basename(file, path.extname(file)))
    .join(", ");

  const commitMessage = `update: ${baseMessage}\n\nAffected:\n${fileNames}`;

  await git("commit", "-m", commitMessage);
}

await commitDirWithFileNames("shops", "updated shops");

export {};
