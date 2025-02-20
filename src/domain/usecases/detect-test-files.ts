export interface DetectTestFiles {
  execute(projectFolder: string): Promise<string[]>;
}
