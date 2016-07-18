#!/bin/sh
echo "Deploy demos to github pages.";
mkdir gh_pages;
cp -r demo gh_pages/;
cp -r dist gh_pages/;
cp -r test gh_pages/;
cp -r docs gh_pages/;
mkdir -p gh_pages/plugins/webrtc;
cp -r plugins/webrtc/dist gh_pages/plugins/webrtc/;
cp -r plugins/webrtc/docs gh_pages/plugins/webrtc/;
mkdir -p gh_pages/plugins/typed-messages;
cp -r plugins/typed-messages/dist gh_pages/plugins/typed-messages/;
cp -r plugins/typed-messages/docs gh_pages/plugins/typed-messages/;
cp -r bower_components gh_pages/;
cd gh_pages && git init;
git config user.name "leancloud-bot";
git config user.email "ci@leancloud.cn";
git add .;
git commit -m "Deploy demos to Github Pages [skip ci]";
git push -qf https://${TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git master:gh-pages;
echo "done.";
cd ..
