const { exec } = require("child_process");

const promiseExec = (command, messageIfError) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(messageIfError || error);
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
  try {
    const version = process.argv[2];

    if (!version) {
      throw new Error("Pass a version to release.");
    }

    const majorVersion = getMajorVersion(version);

    const tests = await promiseExec(
      "npm run test",
      "❌ Tests failed! Run npm test and correct errors before releasing. \n"
    );

    console.log("✅ Tests passed!");

    await promiseExec("npm run build");
    console.log("✅ Build complete!");

    // await promiseExec(`git add . && git commit -m "release ${version}"`);
    // console.log("✅ Release committed to repo!");

    // Upload to Amazon S3
    // Release on NPM
  } catch (exception) {
    console.log(exception);
  }
};

release();

// npm run build
// git add .
// git commit -m "release "$1""
// npm version "$1"
// npm publish

// exit 0
