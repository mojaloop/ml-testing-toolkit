# Users Guide Frequently Asked Questions

## _Mojaloop Testing Toolkit_

This section will list a number a frequently asked questions and the solutions provided.

**Table of Contents**

0. [User Guide](/documents/User-Guide.md)

1. [Mojaloop Connection Manager require sign on](#1-mojaloop-connection-manager-require-sign-on)

2. [Generic ID not found](#2-generic-id-not-found)

### 1 Mojaloop Connection Manager require sign on

When opening **Mojaloop Connection Manager** in my browser, a _**Username**_ and _**Password**_ is required.
  - The default is to open to the available environment, _**TESTING-TOOLKIT**_ as default. After the initial opening, and a time lapses, the **Mojaloop Connection Manager UI** will request you to sign on. Use the default _**Username**_ => ```test``` and _**Password**_ => ```test```.

### 2 Generic ID not found

When I run the _**Outbound Request**_, I receive failures on the Callback response;

```
{
  "body": {
    "errorInformation": {
      "errorCode": "3200",
      "errorDescription": "Generic ID not found"
    }
  }
}
```

- The reason for this is the **Inbound User** is no present on the **Mojaloop Simulator**. For the samples used in this document, you will need to create a new user for **MSISDN** = **9876543210**. In the **Mojaloop Simulator UI**, select _**+ Add User**_ button on the _**Config Inbound**_ navigation tab. Below screenshot is a sample based on the sample data used within this document. Click on the _**√ Submit**_ button when done. 

You are welcome to change any values as required. Important values to keep in mind, are the _Id Type_, _Id Value_ and the _DateOfBirth_ date format _(CCYY-MM-DDD)_.

![Create Inbound User on Simulator](/assets/images/create-inbound-user-simulator.png)