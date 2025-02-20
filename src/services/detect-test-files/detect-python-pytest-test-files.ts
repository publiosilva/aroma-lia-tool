import fs from 'fs';
import path from 'path';
import { DetectTestFiles } from '../../domain/usecases';

export class DetectPythonPyTestTestFilesService implements DetectTestFiles {
  async execute(projectFolder: string): Promise<string[]> {
    const testFiles: string[] = [];

    async function traverseDirectory(currentPath: string): Promise<void> {
      const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          await traverseDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.py')) {
          const fileContent = await fs.promises.readFile(fullPath, 'utf-8');

          if (fileContent.includes('pytest') || entry.name.startsWith('test_')) {
            testFiles.push(fullPath);
          }
        }
      }
    }

    await traverseDirectory(projectFolder);

    return testFiles;
  }
}
