export interface BranchGenConfig {
  prefixes: string[];
  separator: string;
  maxBranchNameLength: number;
  ticketPattern: string;
  defaultSourceBranch: string;
  branchNameSeparator: string;
  useAutomatedVersioning: boolean;
  requireTicket: boolean;
  requireBranchName: boolean;
}
