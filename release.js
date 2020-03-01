/* eslint-disable consistent-return */

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

const promiseExec = (command, messageIfError) => {
  try {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(messageIfError || error);
          return;
        }

        resolve({ stdout, stderr });
      });
    });
  } catch (exception) {
    throw new Error(`[release.promiseExec] ${exception.message}`);
  }
};

const releaseToNPM = async version => {
  try {
    await promiseExec(
      `npm version ${version} --allow-same-version && npm publish --access public`
    ); // NOTE: --access public is due to the scoped package (@oncommandio/js).
  } catch (exception) {
    throw new Error(`[release.releaseToNPM] ${exception.message}`);
  }
};

const uploadScriptToS3 = (path, fileContents) => {
  try {
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
  } catch (exception) {
    throw new Error(`[release.uploadScriptToS3] ${exception.message}`);
  }
};

const tagReleaseOnGit = async version => {
  try {
    await promiseExec(
      `git tag -a ${version} -m "release ${version}" && git push origin ${version}`
    );
  } catch (exception) {
    throw new Error(`[release.tagReleaseOnGit] ${exception.message}`);
  }
};

const pushReleaseToGit = async () => {
  try {
    await promiseExec("git push origin master");
  } catch (exception) {
    throw new Error(`[release.pushReleaseToGit] ${exception.message}`);
  }
};

const commitReleaseToRepo = async version => {
  try {
    await promiseExec(`git add . && git commit -m "release v${version}"`);
  } catch (exception) {
    throw new Error(`[release.commitReleaseToRepo] ${exception.message}`);
  }
};

const updateREADME = version => {
  try {
    fs.writeFileSync(
      "./README.md",
      `## Command.js\n\nOfficial JavaScript library for the Command API.\n\n[Read the Documentation](https://portal.oncommand.io/docs/command-js/${version}/introduction)`
    );
  } catch (exception) {
    throw new Error(`[release.updateREADME] ${exception.message}`);
  }
};

const setHomepageURL = version => {
  try {
    const packageJsonContents = fs.readFileSync("./package.json", "utf-8");
    const packageJson = JSON.parse(packageJsonContents);
    packageJson.homepage = `https://portal.oncommand.io/docs/command-js/${version}/introduction`;
    const stringifiedPackageJson = JSON.stringify(packageJson, null, 2);
    fs.writeFileSync("./package.json", stringifiedPackageJson);
  } catch (exception) {
    throw new Error(`[release.setHomepageURL] ${exception.message}`);
  }
};

const setReleaseVersionInSource = version => {
  try {
    const sourceContents = fs.readFileSync("./index.min.js", "utf-8");
    const sourceContentsWithVersion = sourceContents.replace(
      new RegExp('this.version=""'),
      `this.version="${version}"`
    );
    fs.writeFileSync("./index.min.js", sourceContentsWithVersion);
  } catch (exception) {
    throw new Error(`[release.setReleaseVersionInSource] ${exception.message}`);
  }
};

const setProductionAPIURL = () => {
  try {
    const sourceContents = fs.readFileSync("./index.min.js", "utf-8");
    const developmentAPIRegex = new RegExp("http://localhost:4000/api", "ig");
    const scriptContentsSanitized = sourceContents.replace(
      developmentAPIRegex,
      "https://api.oncommand.io"
    );

    fs.writeFileSync("./index.min.js", scriptContentsSanitized);
  } catch (exception) {
    throw new Error(`[release.setProductionAPIURL] ${exception.message}`);
  }
};

const runBuild = async () => {
  try {
    await promiseExec("npm run build");
  } catch (exception) {
    throw new Error(`[release.runBuild] ${exception.message}`);
  }
};

const runTests = async () => {
  try {
    await promiseExec(
      "npm run test",
      "❌ Tests failed! Run npm test and correct errors before releasing. \n"
    );
  } catch (exception) {
    throw new Error(`[release.runTests] ${exception}`);
  }
};

const getMajorVerison = version => {
  try {
    const versionParts = version.split(".");
    return `v${versionParts[0]}`;
  } catch (exception) {
    throw new Error(`[release.getMajorVerison] ${exception.message}`);
  }
};

const release = async version => {
  try {
    await runTests();
    console.log("✅ Tests passed!");

    await runBuild();
    console.log("✅ Build complete!");

    setProductionAPIURL();
    console.log("✅ Production URLs updated!");

    setReleaseVersionInSource(version);
    console.log("✅ Release version updated!");

    setHomepageURL(version);
    console.log("✅ Homepage updated in package.json!");

    updateREADME(version);
    console.log("✅ README.md updated!");

    await commitReleaseToRepo(version);
    console.log("✅ Release committed to repo!");

    await pushReleaseToGit();
    console.log("✅ Release pushed to repo!");

    await tagReleaseOnGit(version);
    console.log("✅ Version tag pushed to remote repo!");

    await uploadScriptToS3(
      `${getMajorVerison(version)}/index.min.js`,
      fs.readFileSync("./index.min.js", "utf-8")
    );
    console.log("✅ Uploaded to Amazon S3!");

    await releaseToNPM(version);
    console.log("✅ Released to NPM!");
  } catch (exception) {
    console.warn(`[release] ${exception.message}`);
  }
};

release(process.argv[2]);
