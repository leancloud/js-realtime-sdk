#!/bin/sh
echo "Deploy dist to dist branch.";
REV=`git rev-parse HEAD`;
BRANCH=`git rev-parse --abbrev-ref HEAD`;
npm run build;
if [[ "`git config user.name`" == "" ]]; then
  git config user.name "leancloud-bot";
  git config user.email "ci@leancloud.cn";
fi
git add dist -f;
git commit -m "chore(build): build ${REV} [skip ci]";
git push -qf https://${TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git ${BRANCH}:dist;
git reset HEAD~1;
echo "done.";
