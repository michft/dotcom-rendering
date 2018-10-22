const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);

const execa = require('execa');
const path = require('path');
const cpy = require('cpy');
const { warn, log } = require('../log');
const { siteName, root, dist, target } = require('../../config');

// This task generates the riff-raff bundle. It creates the following
// directory layout under target/
//
// target
// ├── build.json
// ├── riff-raff.yaml
// ├── frontend-cfn
// |   └── cloudformation.yml
// ├── frontend-static
// │   └── guui
// │       ├── assets
// │       │   └── **
// │       │       └── *
// │       └── static
// │           ├── frontend
// │           │   └── **
// │           │       └── *
// │           └── etc
// └── rendering
//     └── dist
//         └── rendering.zip

const copyCfn = () => {
    log(' - copying cloudformation config');
    return cpy(
        [`${siteName}/cloudformation.yml`],
        path.resolve(target, `${siteName}-cfn`),
    );
};

const copyStatic = () => {
    log(' - copying static');
    return cpy(
        ['**/*'],
        path.resolve(target, `${siteName}-static`, 'guui', 'static', siteName),
        {
            cwd: path.resolve(root, siteName, 'static'),
            parents: true,
            nodir: true,
        },
    );
};

const copyDist = () => {
    log(' - copying dist');
    return cpy(
        ['**/*.!(html|json)'],
        path.resolve(target, `${siteName}-static`, 'guui', 'assets'),
        {
            cwd: path.resolve(dist),
            parents: true,
            nodir: true,
        },
    );
};

const copyRiffRaff = () => {
    log(' - copying riffraff yaml');
    return cpy(['riff-raff.yaml'], target, { cwd: __dirname });
};

const zipBundle = () => {
    log(' - zipping bundle');
    return execa(
        'zip',
        [
            '-r',
            'rendering.zip',
            '.',
            '-x',
            '.git/**\\*',
        ],
        {
            shell: true,
        },
    ).then(() => {
        cpy(['rendering.zip'], path.resolve(target, 'rendering', 'dist'));
    });
};

const createBuildConfig = () => {
    log(' - creating build.json');
    const buildConfig = {
        projectName: process.env.PROJECT || 'dotcom:rendering',
        buildNumber: process.env.BUILD_NUMBER || '0',
        startTime: process.env.BUILD_START_DATE || new Date().toISOString(),
        revision: process.env.BUILD_VCS_NUMBER || 'unknown',
        vcsURL: 'git@github.com:guardian/dotcom-rendering.git',
        branch: process.env.BRANCH_NAME || 'unknown',
    };

    return writeFile(
        path.resolve(target, 'build.json'),
        JSON.stringify(buildConfig, null, 2),
    );
};

Promise.all([copyCfn(), copyStatic(), copyDist(), copyRiffRaff()])
    .then(zipBundle)
    .then(createBuildConfig)
    .catch(err => {
        warn(err.stack);
        process.exit(1);
    });
