# BranchGen

BranchGen is a command-line tool designed to simplify the process of creating git branches with standardized naming conventions. This tool is highly configurable, ensuring it meets the diverse requirements of teams and workflows.

⭐ If you find this tool helpful, please consider giving it a star on GitHub! Your support means a lot.

---

## Key Features

- **Customizable Branch Naming**: Supports prefixes like `feature`, `bugfix`, `hotfix` for branch types.
- **Automated Versioning**: Automatically appends version numbers to branch names to avoid conflicts (configurable).
- **Validation for Naming Standards**: Ensures branch names and ticket IDs conform to specified patterns.
- **Retry Logic**: Prompts users to retry if the branch already exists (if automated versioning is disabled).
- **Remote Branch Integration**: Ensures compatibility with existing remote branches.

---

## Installation

```bash
npm install -g branch-gen
```

---

## Why Use BranchGen?

Manually creating branches often leads to inconsistent naming, which can confuse teams and complicate workflows. For example:

**Problem Case:**

- Developers on your team create branches with inconsistent names like:
  - `feature-add_login`
  - `bugfix/login_bug`
  - `hotfix/criticalFix`

These variations cause confusion and make it difficult to search, manage, and enforce naming conventions across the repository.

**How BranchGen Helps:**

- By using **BranchGen**, you can:
  - Standardize branch names (e.g., `feature/PROJ-123-add-login`).
  - Ensure ticket IDs follow a specific pattern (e.g., `PROJ-123`).
  - Automatically append version numbers to avoid branch conflicts.
  - Simplify workflows by reducing human error and maintaining consistency.

---

## Configuration

BranchGen uses a configuration file named `branchgen-config.json` to customize its behavior. If the file is not found, default settings are applied.

### Default Configuration

```json
{
  "prefixes": ["feature", "bugfix", "hotfix"],
  "separator": "/",
  "maxBranchNameLength": 15,
  "ticketPattern": "^[A-Z]+-[0-9]+$",
  "defaultSourceBranch": "main",
  "branchNameSeparator": "-",
  "useAutomatedVersioning": true,
  "requireTicket": false,
  "requireBranchName": true
}
```

### Options Explained

- **prefixes**: List of branch types available for selection (e.g., `feature`, `bugfix`).
- **separator**: Character used to separate the branch type from the rest of the branch name.
- **maxBranchNameLength**: Maximum length allowed for a branch name.
- **ticketPattern**: Regex pattern for validating ticket IDs (e.g., `PROJ-123`).
- **defaultSourceBranch**: Default branch to check out before creating a new branch.
- **branchNameSeparator**: Character used to replace spaces in branch names.
- **useAutomatedVersioning**: Enables/disables automated numbering for duplicate branch names.
- **requireTicket**: Enforces ticket ID input.
- **requireBranchName**: Enforces branch name input.

---

## Usage

```bash
npx branch-gen
```

Run the script and follow the prompts to generate a branch name and create the branch.

### Example Workflow

1. Select a branch type (e.g., `feature`).
2. Enter a ticket ID if required (e.g., `PROJ-123`).
3. Provide a branch name (e.g., `add new feature`).
4. Choose a source branch from the list of remote branches.
5. BranchGen checks out the source branch, pulls the latest changes, and creates the new branch.

---

### Handling Duplicate Branch Names

- If `useAutomatedVersioning` is enabled, BranchGen appends version numbers (e.g., `feature/PROJ-123-add-new-feature-1`).
- If `useAutomatedVersioning` is disabled, you are prompted to retry with a different branch name.

---

## Error Handling

- **No Remote Branches Found**: If no remote branches exist, the script exits with an error.
- **Invalid Ticket ID**: If the ticket ID does not match the specified pattern, the script prompts for a valid ID.
- **Branch Name Too Long**: If the branch name exceeds the maximum allowed length, you are prompted to retry.

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
