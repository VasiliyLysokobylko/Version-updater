/// <reference path="../typings/main.d.ts" />
var fs = require('fs');
var StateChecker = require("./stateChecker").StateChecker;
var readline = require('readline');

// Path to the file with json
var CHILD_REPOS_PATH = "";//"/Users/vasil/Documents/workspace/job/versionUpdater/child_repos.json";
var reposJson;

class VersionUpdater{

    process(){
        reposJson = this.readReposJson(this.getPathArg());
        updater.updateDependencies(reposJson.main_repo_path.path, true);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('\nDo yo want to continue and update packages? Please answer \'y\' or \'n\'\n', (question) => {
            var answer = question.toString();
            if (answer.localeCompare("y") == 0 || answer.localeCompare("yes") == 0) {
                updater.updateDependencies(reposJson.main_repo_path.path, false);
            }
            rl.close();
            process.exit();
        });
    }

    updateDependencies(repoPath, isTest){
        var gitStateChecker = new StateChecker();
        var isDepricated = gitStateChecker.isDeprecated(repoPath);
        var updated = false;

        var packageJson = JSON.parse(fs.readFileSync(repoPath + '/package.json'));
        var packageNewVersion;

        var dependencyKeys = Object.keys(packageJson.dependencies);
        for (var i = 0; i < dependencyKeys.length; i++){
            var dependencyRepo = reposJson[dependencyKeys[i]];
            if (dependencyRepo){
                var newDependencyVersion = this.updateDependencies(dependencyRepo.path, isTest);
                if (newDependencyVersion){
                    updated = true;
                    packageJson.dependencies[dependencyKeys[i]] = "^" + newDependencyVersion;
                }
            }
        }

        if(updated || isDepricated){
            packageNewVersion = this.incVersion(packageJson.version);
            packageJson.version = packageNewVersion;

            if (isTest){
                console.log("Package '" + packageJson.name + "' will be updated to the version: " + packageJson.version);
            } else {
                console.log("Package '" + packageJson.name + "' was updated to the version: " + packageJson.version);
            }

            if (!isTest) {
                fs.writeFileSync(repoPath + '/package.json', JSON.stringify(packageJson, null, 4));
            }
        }
        return packageNewVersion;
    }

    incVersion(version){
        var incVersion;
        var lastPart = parseInt(version.substr(version.lastIndexOf(".") + ".".length));
        lastPart = lastPart+1;
        incVersion = version.substring(0, version.lastIndexOf(".") + ".".length) + lastPart;
        return incVersion;
    }

    getPathArg(){
        var args = process.argv.slice(2);
        for (var i = 0; i < args.length; i++){
            var arg = args[i];
            if ((arg == "--path" || arg == "-path") && i < args.length-1){
                return args[i+1];
            }
        };
    }

    readReposJson(path){
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
}


var updater = new VersionUpdater();
updater.process();
