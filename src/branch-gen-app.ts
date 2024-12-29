import { BranchGenConfig } from './branch-gen.config';
import { BranchGenerator } from './branch-generator';
import { ConfigLoader } from './config-loader';
import { GitHelper } from './git-helper';
import { input, select } from '@inquirer/prompts';

export class BranchGenApp {
  private config: BranchGenConfig;
  private gitHelper: GitHelper;
  private branchGenerator: BranchGenerator;

  constructor() {
    this.config = ConfigLoader.loadConfig();
    this.gitHelper = new GitHelper();
    this.branchGenerator = new BranchGenerator(this.config, this.gitHelper);
  }

  async run(branchType?: string): Promise<void> {
    try {
      const branches = await this.gitHelper.getRemoteBranches();

      if (branches.length === 0) {
        console.error(
          'Error: No remote branches exist. Please set up remote branches before proceeding.'
        );
        process.exit(1);
      }

      const type =
        branchType ||
        (await select({
          message: 'Select the branch type:',
          choices: this.config.prefixes,
        }));

      const ticket = this.config.requireTicket
        ? await input({
            message: 'Enter the ticket ID:',
            validate: (input: string) => {
              try {
                this.branchGenerator.validateTicket(input);
                return true;
              } catch (err) {
                return err.message;
              }
            },
          })
        : undefined;

      const branchName = await input({
        message:
          'Enter the branch name (spaces will be replaced with the configured separator):',
        validate: (input: string) => {
          try {
            this.branchGenerator.validateBranchName(input);
            return true;
          } catch (err) {
            return err.message;
          }
        },
      });

      const { branchExists, newBranch } =
        await this.branchGenerator.generateBranchName(type, ticket, branchName);

      if (branchExists && !this.config.useAutomatedVersioning) {
        console.error(
          `- Branch ${newBranch} already exists and useAutomatedVersioning is disabled. Please try a different name.`
        );
        this.run(type);
        return;
      }

      let filteredBranches = branches;
      let sourceBranch: string | undefined;

      while (!sourceBranch) {
        const searchTerm = await input({
          message:
            'Type to filter the source branch list (leave blank to see all):',
        });

        filteredBranches = branches.filter((branch) =>
          branch.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredBranches.length === 0) {
          console.error('No branches match your search. Try again.');
          continue;
        }

        filteredBranches.unshift('Select this option to filter again');

        sourceBranch = await select({
          message: 'Select the source branch:',
          choices: filteredBranches,
        });

        if (sourceBranch === 'Select this option to filter again') {
          sourceBranch = undefined;
          continue;
        }
      }

      console.log(`Checking out source branch: ${sourceBranch}`);
      await this.gitHelper.checkoutBranch(sourceBranch);
      await this.gitHelper.pullBranch(sourceBranch);

      console.log(`Creating new branch: ${newBranch}`);
      await this.gitHelper.createBranch(newBranch);
      console.log(`Switched to branch: ${newBranch}`);
      process.exit();
    } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
  }
}
