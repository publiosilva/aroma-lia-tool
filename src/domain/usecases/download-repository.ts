export interface DownloadRepository {
  execute(repositoryURL: string): Promise<string>;
}
