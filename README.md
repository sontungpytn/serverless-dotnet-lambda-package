# serverless-dotnet-lambda-package
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-dotnet-lambda-package.svg)](https://badge.fury.io/js/serverless-dotnet-lambda-package)
[![license](https://img.shields.io/npm/l/serverless-dotnet-lambda-package.svg)](https://www.npmjs.com/package/serverless-dotnet-lambda-package)

Serverless plugin for package DotNet lambda function before deploy in to AWS

## Install

```
npm i serverless-dotnet-lambda-package
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-dotnet-lambda-package
```

Add framework and buildConfiguration to your `serverless.yml` file in provider:

E.g.
```yaml
provider:
  name: aws
  framework: netcoreapp3.1
  buildConfiguration: Release
```

Set projectFolder and artifact for each DotNet function:

E.g.

```yaml
package:
 artifact: src/app/functionproject-folder/publish/deploy-package.zip
 projectFolder: src/app/functionproject-folder 
```


## Note
This work is based on @tsibelman [serverless-multi-dotnet](https://github.com/tsibelman/serverless-multi-dotnet)
