const { exec } = require("child_process");

const promiseExec = command => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }

      resolve({ stdout, stderr });
    });
  });
};

const getMajorVersion = version => {
  const versionParts = version.split(".");
  return `v${versionParts[0]}`;
};

const release = async () => {
  const version = process.argv[2];

  if (!version) {
    throw new Error("Pass a version to release.");
  }

  const majorVersion = getMajorVersion(version);

  await promiseExec("npm run build");
  console.log("Build complete!");

  await promiseExec(`git add . && git commit -m "release ${version}"`);
  console.log("Release committed to repo!");
};

release();

// npm run build
// git add .
// git commit -m "release "$1""
// npm version "$1"
// npm publish

// exit 0
