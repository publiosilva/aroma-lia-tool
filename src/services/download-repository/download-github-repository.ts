import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import * as os from 'os';
import { DownloadRepository } from '../../domain/usecases';

export class DownloadGithubRepositoryService implements DownloadRepository {
  async execute(repositoryURL: string): Promise<string> {
    const regex = /https:\/\/github\.com\/([^\\/]+)\/([^\\/]+)/;
    const match = repositoryURL.match(regex);

    if (!match) {
      throw new Error('Invalid GitHub URL');
    }

    const owner = match[1];
    const repo = match[2];

    const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoResponse = await axios.get(repoInfoUrl);
    const defaultBranch = repoResponse.data.default_branch;

    const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;

    const response = await axios({
      method: 'get',
      url: zipUrl,
      responseType: 'arraybuffer',
    });

    const tempDir = os.tmpdir();
    const zipFilePath = path.join(tempDir, `${repo}.zip`);

    fs.writeFileSync(zipFilePath, response.data);

    const zip = new AdmZip(zipFilePath);
    const extractPath = path.join(tempDir, repo);

    zip.extractAllTo(extractPath, true);

    return extractPath;
  }
}
