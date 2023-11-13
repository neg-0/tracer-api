const simpleGit = require('simple-git');
const git = simpleGit();

function gitInit(cwd) {
  return git.cwd(cwd).init();
}

function gitAdd(cwd, files) {
  return git.cwd(cwd).add(files);
}

function gitCommit(cwd, message) {
  return git.cwd(cwd).commit(message);
}

function gitPush(cwd, remote, branch) {
  return git.cwd(cwd).push(remote, branch);
}

module.exports = {
  gitInit,
  gitAdd,
  gitCommit,
  gitPush
};