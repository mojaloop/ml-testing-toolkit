# Mojaloop Testing Toolkit

## _Onboarding DFSP_

**Table of Contents**

1. [Running the toolkit](#1-running-the-toolkit)

2. [Settings](#2-settings)

3. [Run collections](#3-run-collections)

    3.1 [Web UI](#31-web-ui)

      3.1.1 [Import Collection](#311-import-collection)

      3.1.2 [Import Environment](#312-import-environment)

      3.1.3 [Execute Collection](#313-execute-collection)

      3.1.4 [View Report](#314-view-report)

    3.2 [CLI tool](#32-cli-tool)

      3.2.1 [Help Screen](#321-help-screen)

      3.2.2 [Execute Collection](#322-execute-collection)

      3.2.3 [View Report](#323-view-report)

## 1. Running the toolkit

The following softwares should be installed on your system to run the toolkit.

* Git
* Docker

Please execute the following lines to build and run the tool. 

```bash
git clone https://github.com/mojaloop/ml-testing-toolkit
cd ml-testing-toolkit
docker-compose up
```

To update the **Mojaloop Testing Toolkit** to the latest version and rebuild, please run the following

```bash
cd ml-testing-toolkit
git pull
docker-compose build
docker-compose up
```

You should get the web interface on http://localhost:6060

If you want to test the tool for the whole functionality like schema validation, additional validation and callback generation ..etc, you can initiate a transfer cycle from mojaloop simulator UI.

Please follow the below steps from the ml-testing-toolkit folder

```bash
cd simulator
docker-compose up
```

The above command will start the services scheme-adapter, mojaloop-simulator and mojaloop-simulator-ui.

## 2 Settings

You will need to create a new user for **MSISDN** = **9876543210**. In the **Mojaloop Simulator UI**, select _**+ Add User**_ button on the _**Config Inbound**_ navigation tab. Below screenshot is a sample based on the sample data used within this document. Click on the _**√ Submit**_ button when done. 

![Create Inbound User on Simulator](/assets/images/create-inbound-user-simulator.png)

The _**SETTINGS**_ navigation tab will open to the **SETTINGS** window. Below is the default view of this page.

![Opening Default Settings](/assets/images/opening-default-settings.png)

- The **SETTINGS** window consist of the following two windows;
  - On the left **Runtime Global Configuration** displays the actual configuration that is effectively active by the **Mojaloop Testing Toolkit** service.
  - On the right **Edit Global Configuration** amongst a couple of other options, it allows you to edit the values manually. Should you elect to use other environment values you can disable the default values by selecting the _**Override with Environment Variable**_ option.

- In a default docker deployment, the environment values will be provided in the _local.env_ file in the project root directory.

![Override with Environment Variable](/assets/images/override-with-environment-variable.png)

## 3 Run Collections

### 3.1 Web UI

This sections will enable you to intiate requests from the testing toolkit to your DFSP implementation.

The user can create a collection of operations and add a number of assertions to these operations. The assertions can be setup and customized to support your testing requirements and verify both positive and negative requests and responses. 

Selecting the _**Outbound Request**_ navigation tab on the left side, the following will open in the main display window. 

![Outbound display opening](/assets/images/outbound-display-opening.png)

#### 3.1.1 Import Collection

By selecting the _**Import Collection**_ button, it will allow you to import a collection or multiple collections. For your exploration, sample collections are available under the project root directory under [/examples/collections](/examples/collections) sub directory. To select one of the sample files, on the file explorer window that poped up when you selected the _**Import Collection**_ button, navigate to [/examples/collections/dfsp](/examples/collections/dfsp) under the project root directory. Select the ```p2p_happy_path.json``` file to import into the **Mojaloop Testing Toolkit** application. This sample file consist of a couple of test samples. You could add more test cases by clicking on _Add Test Case_ button

#### 3.1.2 Import Environment

By selecting the _**Import Environment**_ button, it will allow you to import input values. For your exploration, sample environments are available under the project root directory under [/examples/environments](/examples/environments) sub directory. To select one of the sample files, on the file explorer window that poped up when you selected the _**Import Environment**_ button, navigate to [/examples/environments](/examples/environments) under the project root directory. Select the ```dfsp_local_environment.json``` file to import into the **Mojaloop Testing Toolkit** application. This sample file consist of a couple of input values.

It is possible to update the **Input Values** on the right hand side window. Additional input values can be added, by selecting the _**Add Input Value**_ button on the top right of this right hand side window. These values relates to the specified variable that you can select and use in any **Request** that you create. The process is straight forward. Provide a name for the new input value and click on the _**Add**_ button. To update values of exisiting variable(s) to the **Input Values**, simply select the value next to the variable and type in a new value. It will then be available for use in the test cases imported earlier.

#### 3.1.3 Execute Collection

You could execute the whole template by clicking on _Send_ button in the top right corner.

#### 3.1.4 View Report

You could download a report in several formats by clicking on _Download Report_ in the top right corner:
- JSON
- HTML
- Printer Friendly HTML

### 3.2 CLI tool

#### 3.2.1 Help screen

The help screen allows you to see the usage, possible options and default values

command: 

```
node src/cli_client/client -h
```

output:

```
Usage: client [options]

Options:
  -v, --version                             output the version number
  -c, --config <config>                     default configuration: {"mode": "outbound", "reportFormat": "json"}
  -m, --mode <mode>                         default: "outbound" --- supported modes: "monitoring", "outbound"
  -i, --input-files <inputFiles>            csv list of json files or directories; required when the mode is "outbound" --- supported formats: "json"
  -e, --environment-file <environmentFile>  required when the mode is "outbound" --- supported formats: "json"
  --report-format <reportFormat>            default: "json" --- supported formats: "json", "html", "printhtml"
  --report-filename <reportFilename>        default: generated by the backend
  -h, --help                                output usage information
```

#### 3.2.2 Execute Collection

command:

```
node src/cli_client/client -m outbound -i examples/collections/dfsp/p2p_happy_path.json -e examples/environments/dfsp_local_environment.json --report-format html
```

output:

```
Listening on outboundProgress events...
 ████████████████████████████████████████ 100% | ETA: 0s | 3/3
--------------------TEST CASES--------------------
P2P Transfer Happy Path
        Get party information - GET - /parties/{Type}/{ID} - [8/8]
        Send quote - POST - /quotes - [11/11]
        Send transfer - POST - /transfers - [9/9]
--------------------TEST CASES--------------------
┌───────────────────────────────────────────────────────┐
│                        SUMMARY                        │
├───────────────────────┬───────────────────────────────┤
│ Total assertions      │ 28                            │
├───────────────────────┼───────────────────────────────┤
│ Passed assertions     │ 28                            │
├───────────────────────┼───────────────────────────────┤
│ Failed assertions     │ 0                             │
├───────────────────────┼───────────────────────────────┤
│ Total requests        │ 3                             │
├───────────────────────┼───────────────────────────────┤
│ Total test cases      │ 1                             │
├───────────────────────┼───────────────────────────────┤
│ Passed percentage     │ 100.00%                       │
├───────────────────────┼───────────────────────────────┤
│ Started time          │ Mon, 01 Jun 2020 14:46:20 GMT │
├───────────────────────┼───────────────────────────────┤
│ Completed time        │ Mon, 01 Jun 2020 14:46:21 GMT │
├───────────────────────┼───────────────────────────────┤
│ Runtime duration      │ 832 ms                        │
├───────────────────────┼───────────────────────────────┤
│ Average response time │ NA                            │
└───────────────────────┴───────────────────────────────┘
TTK-Assertion-Report-dfsp-p2p-tests-2020-06-01T14:46:21.303Z.html was generated
Terminate with exit code 0
```

#### 3.2.3 View Report

You will find the report in the project folder.

- default name format: 'TTK-Assertion-Report-{collection-name}-{ISO-date}.{report-format}'