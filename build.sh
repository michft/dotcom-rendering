#!/usr/bin/env bash

set -e

PROJECT=dotcom:guui

sudo apt-get install zip -y

nvm use

node -v

if [[ -z $BUILD_NUMBER ]]; then
  BUILD_NUMBER=0
fi

if [[ -z $BUILD_VCS_NUMBER ]]; then
  BUILD_VCS_NUMBER=unknown
fi

if [[ -z $BRANCH_NAME ]]; then
  BRANCH_NAME=unknown
fi

zip -r guui.zip * -x node_modules/**\*
[ -d target ] && rm -rf target
mkdir -p target/dist
mkdir -p target/cfn
mv guui.zip ./target/dist/guui.zip
cp __config__/cloudformation.yml ./target/cfn

cp riff-raff.yaml target

BUILD_START_DATE=$(date +"%Y-%m-%dT%H:%M:%S.000Z")

cat >target/build.json << EOF
{
   "projectName":"$PROJECT",
   "buildNumber":"$BUILD_NUMBER",
   "startTime":"$BUILD_START_DATE",
   "revision":"$BUILD_VCS_NUMBER",
   "vcsURL":"git@github.com:guardian/guui.git",
   "branch":"$BRANCH_NAME"
}
EOF

aws s3 cp --acl bucket-owner-full-control --region=eu-west-1 --recursive target s3://riffraff-artifact/$PROJECT/$BUILD_NUMBER
aws s3 cp --acl bucket-owner-full-control --region=eu-west-1 target/build.json s3://riffraff-builds/$PROJECT/$BUILD_NUMBER/build.json
