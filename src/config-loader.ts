import fs from 'fs';
import { BranchGenConfig } from './branch-gen.config';

export class ConfigLoader {
  private static readonly configFilePath = 'branchgen-config.json';
  private static readonly defaultConfig: BranchGenConfig = {
    prefixes: ['feature', 'bugfix', 'hotfix'],
    separator: '/',
    maxBranchNameLength: 50,
    ticketPattern: '^[A-Z]+-[0-9]+$',
    defaultSourceBranch: 'main',
    branchNameSeparator: '-',
    useAutomatedVersioning: true,
    checkIfBranchExists: true,
    requireTicket: false,
    requireBranchName: true,
  };

  static loadConfig(): BranchGenConfig {
    try {
      const configFile = fs.readFileSync(this.configFilePath, 'utf8');
      return { ...this.defaultConfig, ...JSON.parse(configFile) };
    } catch (_) {
      console.warn(
        'Configuration file not found or invalid. Using default configuration.'
      );
      return this.defaultConfig;
    }
  }
}
