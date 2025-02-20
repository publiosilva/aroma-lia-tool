import { DownloadRepository } from '../../../domain/usecases';
import { DownloadGithubRepositoryService } from '../../../services';

export function makeDownloadGithubRepositoryService(): DownloadRepository {
  return new DownloadGithubRepositoryService();
}
