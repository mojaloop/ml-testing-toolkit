# Mojaloop Self-Testing Tool

**Table of Contents**

1. [Introduction](#1-introduction)

   1.1 [Goal](#11-goal)

   1.2 [Scope](#12-scope)

   1.3 [Out of Scope](#13-out-of-scope)

   1.4 [User Interface](#14-user-interface)

   1.5 [Audience](#15-audience)

2. [Tool characteristics](#2-tool-characteristics)

   2.1 [API version](#21-api-version)

   2.2 [Rules engine](#22-rules-engine)

3. [Getting started](#3-getting-started)

4. [Sending test requests](#4-sending-test-requests)

5. [Tests included](#5-tests-include)

6. [Flow diagram](#6-flow-diagram)

7. [Architecture](#7-architecture)

8. [Roadmap after the PoC](#8-roadmap-after-poc)

9. [Additional information](#9-additional-information)

## 1. Introduction

As part of the Mojaloop Partner Development Project (PDP), a ‘self-testing tool kit’ for Mojaloop API implementations was requested by Bill and Melinda Gates Foundation to be delivered. This will happen in two stages, a Proof of Concept (PoC) delivered in the first stage and then a standardized tool as the second stage that builds on the PoC. This will be delivered as a toolkit in the Mojaloop Open Source space.

### 1.1 Goal

The goal of the Self-testing Tool Kit is for the participants in a Mojaloop Hub, in particular DFSPs, but in future System Integrators and other entities, to have a standard way to test integration to a Mojaloop Hub. 

It should be simple to use for both technical and non-technical users; although it is primarily directed at QA personnel. The goal is to ensure that the tool is easy to use for almost anyone involved with a Mojaloop related system be able to quickly configure the tool and use it.

The tool will make use of already existing standard components existing in the Mojaloop space such as Simulators and Labs, with the notable difference that it must have the capability of testing different versions of Mojaloop APIs.

### 1.2 Scope

The following characteristics are identified for the  initial version of Self-testing tool kit:

#### 1.2.1 Schema Validation

The tool must have the capability to test the API’s structural characteristics, regardless of API version and implementation / local modifications.

To enable that, the tool must be able to:

1. Read the current API definition being used, and based on that
2. Check the incoming message according to that specific definition, and 
3. Send the outgoing message according to that specific definition

#### 1.2.2 Content Validation

The tool must have the capability to test the allowable and not-allowable content of the API calls based on the Data Model definitions.

This could be covered for example by a generic processor and a configuration file set according to the schema as tested in point#1 of Section 1.2.1 above.

The configuration file must be editable by the user, using a specified tool that does not require a high level of technical knowledge (currently JRE is being used as backend and User Interface provided).

#### 1.2.3 Workflow check

The tool must have the capability of testing the flow of specific API calls, where the outcome of the one call needs to be used by the following call. A typical example is a quote and transfer flow.

For PoC, only the Peer-to-Peer use case will be supported. Other use cases will be added in, once the PoC is approved.

The testing of each use case must include:

1. Golden Path testing
2. Testing of error conditions as defined by a variable error code matrix

### 1.3 Out of Scope

The scope is limited to endpoints / resources needed for the P2P use-case and once the PoC is in place, all the resources in the FSPIOP API can be supported.

"Settlement API" and the "Operations / Admin API" are outside of scope of the PoC.

The Security aspects and extensive testing are planned to be addressed after the functionality in the PoC is approved.

### 1.4 User Interface

User Interface is currently provided with almost all options exposed for Users of the tool to edit configuration and test files. Along with this, templates can be created and edited to test various use cases.

It will enable the User of the tool to:

1. Create custom validation rules to reflect tests
1.1 Validate functionality of an FSP both inbound and outbound
2. Create templates to simulate an entire Use Case
2.1 Edit templates and values
2.2 Use mock or fixed callbacks and easily use values from preceding requests
2.3 View logs for each of the requests grouped based on timestamps
3. View test results
4. Edit selected tests
5. Add new tests
6. Remove selected tests 

### 1.5 Audience

The tool is aimed for use initially by DFSPs specifiically for the Mojaloop FSP Interoperability (FSPIOP) API, but it will be later extended to be used by Hubs, system integrators and any other parties that will use Mojaloop API’s (along with the Settlement and Admin APIs).

With the first phase of the tool, it will be delivered aimed at the Mojaloop FSPIOP API. The follow-up phases will cover Use cases other than P2P and APIs other than just the FSPIOP API.

## 2. Tool characteristics

Here’s the list of characteristics that we currently identified for the self-testing tool kit:
1. Version negotiation (using Accept, Content-Type headers) provided as per the API Definition v1.0, Section 3.3.4
2. Schema validation provided based on the specific version of the API (v1.0, v1.1, v2.0)
3. Validation of incoming requests based on Rules (after the Schema validation)
4. Generate callbacks dynamically based on incoming requests using Rules (with capability to generate values at field/object level and not hard-coded)
5. Roadmap
5.1 Use toolkit for Settlements tests (Settlement API)
5.2 Validate association of a transfer request with an existing quote (configurable to disable)
5.3 Standardization: JWS validation, generation and support TLS (using SDK standard components)
5.4 Extensive testing of the toolkit itself

### 2.1 API version

1. Validations are done using the Swagger
2. The API version available should be identified from the Swagger file provided
3. API version needs to be validated just on the first call per client per session, not on every call

### 2.2 Rules engine

Rules engine will be used to:
1. Facilitate the different versions of APIs
2. Facilitate specific requirements from a specified implementation site
3. Generate values dynamically for messages included in callbacks

Rules engine will apply to both parties (payer and payee) and both DFSP and hub.

## 3. Getting started

When a new release is done, as part of the workflow, Release Notes are published listing all of the new and/or enhanced functionality implemented as part of the release. These notes are used by the QA teams to extend and enhance the existing Postman Collections where tests are written behind the request/response scripts to test both positive as well as negative scenarios against the intended behaviour. These tests are then run in the following manner:
- Manually to determine if the tests cover all aspects and angles of the functionality, positive tests to assert intended behaviour and negative tests to determine if the correct alternate flows work as intended when something unexpected goes wrong
- Scheduled - as part of the Regression regime, to do exactly the same as the manual intent, but fully automated (with the Newman Package) with reports and logs produced to highlight any unintended behaviour and to also warn where known behaviour changed from a previous run.

In order to facilitate the automated and scheduled testing of a Postman Collection, there are various methods one can follow and the one implemented for Mojaloop use is explained further down in this document.

There is a complete repository containing all of the scripts, setup procedures and anything required in order to set up an automated QA and Regression Testing Framework. This framework allows one to target any Postman Collection, specifying your intended Environment to execute against, as well as a comma-separated list of intended email recipients to receive the generated report. This framework is in daily use by Mojaloop and exists on an EC2 instance on AWS, hosting the required components like Node, Docker, Email Server and Newman, as well as various Bash Scripts and Templates for use by the framework to automatically run the intended collections every day. Using this guide will allow anyone to set up their own Framework.

**Postman Collections**

There are a number of Postman collections in use throughout the different processes:
- **OSS-New-Deployment-FSP-Setup:** This collection needs to be executed at least once after a new deployment, to seed the Database with the required enumerations and static data, as well as test FSPs with their accounts and position data in order to be able to execute any manual or automation tests by other collections.
  - Notes: Ensure that there is a delay of 200ms if executed through Postman UI Test Runner. This will ensure that tests have enough time to validate requests against the simulator.
- **OSS-API-Tests:** This suite of tests will issue a request/response against each and every exposed API, testing APIs such as the Mojaloop core APIs, bulk quotes, admin-APIs, Settlement APIs, Metrics APIs, Fund-in and out APIs etc. These tests are done to test the message headers, body, responses received and not to test the end-to-end flow of a transfer for example
  - Notes: Ensure that there is a delay of 1500ms if executed through Postman UI Test Runner. This will ensure that tests have enough time to validate requests against the simulator.
- **OSS-Feature-Tests:** Scenario based testing are performed with this collection, such as Settlements processes, Block Transfers, Negative testing scenarios and so on
  - Notes: Ensure that there is a delay of 1500ms if executed through Postman UI Test Runner. This will ensure that tests have enough time to validate requests against the simulator.
- **Golden_Path:** This test collection is the one used by the scheduled regression testing framework to test end-to-end scenarios, resembling real-world use-cases where the response from one API call is used to populate the request of a subsequent call. We make use of an intelligent simulator playing the role of an FSP on the recipient side of the scenario, responding to various request from a Payer FSP as an example
  - Notes: Ensure that there is a delay of 1000ms if executed through Postman UI Test Runner. This will ensure that tests have enough time to validate requests against the simulator.

**Environment Configuration**

Import the Environment Config and make the required changes to reflect the correct endpoints to the Mojaloop deployment required to be tested. This environment file contains all the required variables and placeholders needed by all the collections, but the examples for endpoints provided, point to a local Mojaloop installation with the standard Ingress exposed local endpoints:

## 4. Sending test requests

TO BE UPDATED

## 5. Tests include

**For one Use case, P2P**

|   | GET | PUT | POST | DELETE |
| --- | --- | --- | --- | --- |
| /participants | | | Yes | |
| /participants/{ID} | | Yes | | |
| /participants/{Type}/{ID} <br>Alternative:</br> /participants/{Type}/{ID}/{SubId} | Yes | Yes | Yes | Yes |
| /parties/{Type}/{ID} <br> Alternative:</br> /parties/{Type}/{ID}/{SubId}| Yes| Yes | | |
| /quotes | | | Yes | |
| /quotes/{ID} | Yes | Yes | | |
| /transfers | | | Yes | |
| /transfers/{ID} | Yes | Yes | | |

## 6. Flow diagram

![Flow Diagram](/assets/diagrams/flow/flow-diagram.svg)

## 7. Architecture

![Architecture Diagram](/assets/diagrams/architectural/architectural-diagram.svg)

## 8. Roadmap after the POC

1. Try the Settlements API with the testing toolkit
2. Unit tests, refactoring code to support
3. CI / CD
4. Capability to handle multiple APIs at the same time
5. Helm charts, deployment support
6. Enhance User Interface
7. Add other use cases e.g. B2P, P2B ect
8. JWS support
9. TLS support
10. UI tests
11. Provide sample rules, templates for use cases supported
12. Event Framework support
13. Error Framework support
14. Metrics Instrumentation

## 9. Additional information

Additional Validation JSON file format:

```json
[
  {
    "ruleId": 1,
    "description": "If the transfer amount is equal to 2 USD, send a fixed error callback",
    "conditions": {
      "all": [
        {
          "fact": "path",
          "operator": "equal",
          "value": "/transfers"
        },
        {
          "fact": "method",
          "operator": "equal",
          "value": "post"
        },
        {
          "fact": "body",
          "operator": "equal",
          "value": "2",
          "path": "amount.amount"
        }
      ]
    },
    "event": {
      "type": "FIXED_ERROR_CALLBACK",
      "params": {
        "path": "/transfers/{$request.body.transferId}/error",
        "method": "put",
        "headers": {},
        "delay": 100,
        "body": {
          "errorInformation": {
            "errorCode": "5001",
            "errorDescription": "The amount is less than the required amount"
          }
        }
      }
    }
  }
]

```

Callback generation JSON file format:

```json
[
  {
    "ruleId": 1,
    "priority": 2,
    "description": "If the transfer amount is equal to 50 USD, send a fixed callback",
    "conditions": {
      "all": [
        {
          "fact": "path",
          "operator": "equal",
          "value": "/transfers"
        },
        {
          "fact": "method",
          "operator": "equal",
          "value": "post"
        },
        {
          "fact": "body",
          "operator": "equal",
          "value": "50",
          "path": "amount.amount"
        }
      ]
    },
    "event": {
      "type": "FIXED_CALLBACK",
      "params": {
        ...Some fixed callback
      }
    }
  }
]
```
