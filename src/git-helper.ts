import simpleGit, { SimpleGit } from 'simple-git';

export class GitHelper {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async doesBranchExist(branchName: string): Promise<boolean> {
    try {
      const result = await this.git.revparse([branchName]);
      return !!result.trim();
    } catch {
      return false;
    }
  }

  async getRemoteBranches(): Promise<string[]> {
    const branches = (await this.git.branch(['-r'])).all;
    return branches.map((branch) => branch.replace('origin/', ''));
  }

  async checkoutBranch(branchName: string): Promise<void> {
    await this.git.checkout([branchName]);
  }

  async pullBranch(branchName: string): Promise<void> {
    await this.git.pull(['origin', branchName]);
  }

  async createBranch(branchName: string): Promise<void> {
    await this.git.checkout(['-b', branchName]);
  }
}
