'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class ServerlessPlugin {
  constructor (serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'package:createDeploymentArtifacts': this.packageDotNetLambda.bind(this),
    };
  }

  async packageDotNetLambda () {
    const cli = this.serverless.cli;
    cli.log('Package lambda functions!');
    const service = this.serverless.service;
    const buildConfiguration = service.provider.buildConfiguration;
    const framework = service.provider.framework;
    if (!buildConfiguration || !framework) {
      console.error('You need to provide "buildConfiguration" and "framework"');
      process.exit();
    }
    const packages = service.getAllFunctions().reduce((dotnetPackages, funcName) => {
      let func = service.getFunction(funcName);

      if (this.funcRuntimeIsDotNet(service, func)) {
        const lambdaPackage = func.package;
        if (lambdaPackage && lambdaPackage.artifact && lambdaPackage.projectFolder) {
          dotnetPackages.push(func.package);

        }
      }

      return dotnetPackages;
    }, []);
    for (const p of packages) {
      cli.log(`Start to pack function ${p.projectFolder}`)
      await this.pack(p);
    }
  }

  async pack (functionPackage) {
    try {
      const cli = this.serverless.cli;
      const service = this.serverless.service;
      const buildConfiguration = service.provider.buildConfiguration;
      const framework = service.provider.framework;
      const {stdout } = await exec(`dotnet lambda package --configuration ${buildConfiguration} --framework ${framework} --project-location ${functionPackage.projectFolder} --output-package ${functionPackage.artifact}`);
      cli.log(stdout)
    } catch (error) {
      console.error('An error occured while restoring packages');
      console.error(error);
      process.exit(error.code);
    }
  }

  funcRuntimeIsDotNet (service, func) {
    let providerRuntime = service.provider.runtime;
    let funcRuntime = func.runtime;

    if (!providerRuntime && !funcRuntime) {
      console.error('No runtime found at global provider or local function level, eg. dotnetcore2.1');
    }

    return (providerRuntime && providerRuntime.startsWith('dotnet') && !funcRuntime)
      || (funcRuntime && funcRuntime.startsWith('dotnet'))
      || (!providerRuntime && funcRuntime && funcRuntime.startsWith('dotnet'));
  }
}

module.exports = ServerlessPlugin;
