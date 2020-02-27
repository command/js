const { exec } = require("child_process");
const fs = require("fs");
const AWS = require("aws-sdk");
const settings = require("./settings.js");

AWS.config = new AWS.Config();
AWS.config.accessKeyId = settings.aws.accessKeyId;
AWS.config.secretAccessKey = settings.aws.secretAccessKey;

AWS.config.update({
  signatureVersion: "v4",
  region: "us-east-2"
});

const s3 = new AWS.S3();

const putFileOnS3 = (path, fileContents) => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: "command-js",
        ACL: "public-read",
        Key: path,
        Body: fileContents,
        ContentType: "text/javascript"
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

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

    await promiseExec(
      "npm run test",
      "❌ Tests failed! Run npm test and correct errors before releasing. \n"
    );
    console.log("✅ Tests passed!");

    await promiseExec("npm run build");
    console.log("✅ Build complete!");

    const majorVersion = getMajorVersion(version);
    const scriptContents = fs.readFileSync("./index.min.js", "utf-8");
    const developmentAPIRegex = new RegExp("http://localhost:4000/api", "ig");
    const scriptContentsSanitized = scriptContents.replace(
      developmentAPIRegex,
      "https://api.oncommand.io"
    );

    fs.writeFileSync("./index.min.js", scriptContentsSanitized);
    console.log("✅ Production URLs updated!");

    const packageJsonContents = fs.readFileSync("./package.json", "utf-8");
    const packageJson = JSON.parse(packageJsonContents);
    packageJson.homepage = `https://portal.oncommand.io/docs/command-js/${version}/introduction`;
    const stringifiedPackageJson = JSON.stringify(packageJson, null, 2);

    fs.writeFileSync("./package.json", stringifiedPackageJson);
    console.log("✅ Homepage updated in package.json!");

    fs.writeFileSync(
      "./README.md",
      `## Command.js\n\nOfficial JavaScript library for the Command API.[Read the Documentation]\n\n(https://portal.oncommand.io/docs/api/${version}/libraries#javascript)
    `
    );
    console.log("✅ README.md updated!");

    await promiseExec(`git add . && git commit -m "release ${version}"`);
    console.log("✅ Committed to repo!");

    await promiseExec(
      `git tag -a ${version} -m "release ${version}" && git push origin ${version}`
    );
    console.log("✅ Version tag pushed to repo!");

    await promiseExec(`git push origin master`);
    console.log("✅ Code pushed to repo!");

    await putFileOnS3(`${majorVersion}/index.min.js`, scriptContentsSanitized);
    console.log("✅ Uploaded to Amazon S3!");

    await promiseExec(`npm version ${version} && npm publish --access public`); // NOTE: --access public is due to the scoped package (@oncommandio/js).
    console.log("✅ Released to NPM!");
  } catch (exception) {
    console.log(exception);
  }
};

release();
