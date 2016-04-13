/// <reference path="../typings/main.d.ts" />
var exec = require('child_process').execSync;

export class StateChecker{
    executeCommand(command){
        var commandResult = exec(command,
            (error, stdout, stderr) => {
                if (stderr !== null){
                    console.log(`stderr: ${stderr}`);
                }
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
        return commandResult.toString('utf8');
    }

    getLastTag(repoPath){
        var tag = this.executeCommand("cd " + repoPath + " && git tag");
        var tags = tag.split(/\n/g);
        return tags[tags.length-2];
    }

    getTagCommit(repoPath, tagName){
        var commit="";
        if(repoPath && tagName) {
            var commitInfo = this.executeCommand("cd " + repoPath + " && git show " + tagName);
            var commitInfoLines = commitInfo.split(/\n/g);
            for (var i = 0; i < commitInfoLines.length; i++) {
                if (commitInfoLines[i].match(/^commit \w+/)) {
                    commit = commitInfoLines[i].substring(7);
                    break;
                }
            }
        }
        return commit;
    }

    getLastRepoCommit(repoPath){
        var repoCommits = this.executeCommand("cd " + repoPath + " && git log -1");
        var repoCommitsLines = repoCommits.split(/\n/g);
        var lastCommit;
        for (var i = 0; i < repoCommitsLines.length; i++){
            if (repoCommitsLines[i].match(/^commit \w+/)){
                lastCommit = repoCommitsLines[i].substring(7);
                break;
            }
        }
        return lastCommit;
    }

    public isDeprecated(repoPath){
        var lastTag = this.getLastTag(repoPath);
        var lastTagCommit = this.getTagCommit(repoPath, lastTag);
        var lastRepoCommit = this.getLastRepoCommit(repoPath);
        var compareResult = lastRepoCommit.localeCompare(lastTagCommit);
        if (compareResult == 0)
            return false;
        else
            return true;
    }
}


