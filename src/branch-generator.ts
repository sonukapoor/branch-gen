import { BranchGenConfig } from './branch-gen.config';
import { GitHelper } from './git-helper';

export class BranchGenerator {
  private config: BranchGenConfig;
  private gitHelper: GitHelper;

  constructor(config: BranchGenConfig, gitHelper: GitHelper) {
    this.config = config;
    this.gitHelper = gitHelper;
  }

  validateTicket(ticket: string): void {
    if (this.config.requireTicket) {
      const pattern = new RegExp(this.config.ticketPattern);
      if (!pattern.test(ticket)) {
        throw new Error(
          `Ticket ID does not match pattern: ${this.config.ticketPattern}`
        );
      }
    }
  }

  validateBranchName(branchName: string): void {
    if (branchName.length > this.config.maxBranchNameLength) {
      throw new Error(
        `Branch name exceeds max length of ${this.config.maxBranchNameLength} characters.`
      );
    }

    if (branchName.trim().length === 0 && this.config.requireBranchName) {
      throw new Error('Branch name is required.');
    }
  }

  async generateBranchName(
    type: string,
    ticket: string | undefined,
    branchName: string
  ): Promise<{ branchExists: boolean; newBranch: string }> {
    this.validateTicket(ticket || '');
    this.validateBranchName(branchName);

    branchName = branchName
      .toLowerCase()
      .split(' ')
      .join(this.config.branchNameSeparator);

    let newBranch = `${type}${this.config.separator}${
      ticket ? `${ticket}-` : ''
    }${branchName}`;
    let branchExists = await this.gitHelper.doesBranchExist(newBranch);

    if (!branchExists || !this.config.useAutomatedVersioning) {
      return { branchExists, newBranch };
    }

    let version = 0;
    while (branchExists) {
      version++;
      newBranch = `${type}${this.config.separator}${
        ticket ? `${ticket}-` : ''
      }${branchName}-${version}`;
      branchExists = await this.gitHelper.doesBranchExist(newBranch);
    }

    return { branchExists, newBranch };
  }
}
