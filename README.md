# Version-updater

### Getting started

- Clone this repo.
- Execute command:
  ```
  typings install
  ```
- Open a file 'child_repos.json'. Specify a main node package git repository local path in the 'main_repo_path' object. Add your node packages and local path to them. Example you can see in the 'child_repos.json' file.
- To run VersionUpdater execute command `node src/versionUpdater.js --path PATH_TO_child_repos.json`

This tool does not applies changes without user permissions. At first execution stage versionUpdater shows packages with possible version changes. Program shows a question: "Do yo want to continue and update packages?". Then user should take decision to apply this changes or not. 
