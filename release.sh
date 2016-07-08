#!/bin/bash
echo "Deploy dist to dist branch.";
REV=`git rev-parse HEAD`;
BRANCH=`git rev-parse --abbrev-ref HEAD`;
test "$(git config user.name)" = '' && (
  git config user.name "leancloud-bot";
  git config user.email "ci@leancloud.cn";
)
git add dist docs -f;
git add plugins/typed-messages/dist plugins/typed-messages/docs -f;
git add plugins/webrtc/dist plugins/webrtc/docs -f;
git commit -m "chore(build): build ${REV} [skip ci]";
git push -qf https://${TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git ${BRANCH}:dist;
git reset HEAD~1;
echo "done.";
