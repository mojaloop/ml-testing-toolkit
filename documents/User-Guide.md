# Users Guide

## _Mojaloop Self Testing Toolkit_

**Table of Contents**

1. [Introduction](#1-introduction)

2. [Getting Started](#2-getting-started)

3. [The Self-Testing Tool](#3-the-self-testing-tool)

    3.1 [At first glance](#31-at-first-glance)

    3.2 [Dashboard](#32-dashboard)

    3.3 [Monitoring](#33-monitoring)

    3.4 [Sync Response Rules](#34-sync-response-rules)

    3.5 [Validation Rules (Error Callbacks)](#35-validation-rules)

    3.6 [Callback Rules (Success Callbacks)](#36-callback-rules)

#### 3.7 Outbound Request
[TODO - complete this section of user-guide]

#### 3.8 Settings

### 1. Introduction

The intention of this document is to provide a basic user guide to the mojaloop Self Testing Toolkit. This easy to use tool set was designed for both technical and non-technical users, even though the primarily users would likely be Quality Assurance (QA) resources. By following this guide, users will have a better understand of the capabilities and fuctionality of the tool set.

The mojaloop Self Testing Toolkit was designed for participants that would like to partcipate in the mojaloop Hub scheme. Intentially build to have a standard way to test integration with a Mojaloop Hub, this tool set can potentially be used by both the DFSP and the Hub to verify the inergration between the 2 entities.

For additional back ground information on the Self Testing Toolkit, please see [mojaloop Self Testing Toolkit](/documents/Mojaloop-Self-Testing-Tool.md). It would also be advisable to look at the [Architecture Diagram](/documents/Mojaloop-Self-Testing-Tool.md#7-architecture) to understand the components and related flow.

### 2. Getting Started

To get started, please follow instruction in the [README](/README.md) document. This document covers the use-cases with the mojaloop simulator and mojaloop simulator ui.

### 3. The Self-Testing Tool

#### 3.1 At first glance

When you open the mojaloop Self Testing Toolkit in your browser, you will be welcomed by the Dashboard display. Currently this is still under developement, but the "static data" will provide you with a fair representations of the intention of the Dashboard display.

![Opening view](/assets/images/Opening_View.png)

You would also notice the navigation items on the left. Currently these consist of;

- Dashboard
- Monitoring
- Sync Response Rules
- Validation Rules (Error Callbacks)
- Callback Rules (Success Callbacks)
- Outbound Request
- Settings

We will work through each one of the items and provide you with a fair understanding of the functionality.

![Menu Items](/assets/images/Menu_Items.png)

#### 3.2 Dashboard

This is the default opening screen. As mentioned, this is still being developed. The intent is to provide information to the user of the mojaloop Self Testing Toolkit on Resources Hits(Incoming and Outgoing), Request and Responses statistics and Rules Engine Hits statistics.

More information would be disclosed once the developement is at a more mature stage.

#### 3.3 Monitoring

Allows you to monitor the incomming and outgoing request.

![Monitoring Initial State](/assets/images/Monitoring_Initial_State.png) 

If you have followed the installation in structions, you should have the Simulator UI open in a browser tab. Go to the **Outbound Send** tab on the left.

Press **Send Transfer** button to send a request from the Simulator UI to the Self Testing Toolkit.

![Send Transfer](/assets/images/Send_Transfer.png)


If the request was send successfully from the Simulator UI.

![Simulator response](/assets/images/Simulator_Response.png) 

Go back to the Monitoring tab on the Self Testing Toolset. You will notice the three processes assosiated with this request in acending order.

- GET /parties/{Type}/{ID}
- POST /quotes
- POST /transfers

![Monitoring messages](/assets/images/Monitoring_Messages.png)

To view detail information on any one of the callback, click on the operation in the blue button - in this example **GET /parties/MSISDN/0001**. 

If you recall the [Architecture Diagram](/documents/Mojaloop-Self-Testing-Tool.md#7-architecture) mentioned earlier, under messages, you'll notice, Version negotiation, Schema Validation and Additional validations;

clicking on the **+** to view detail related to the message.

![Expanded monitoring messages](/assets/images/Expand_Monitoring_Messages.png)

As an example the following has be expanded.

- Request: get/parties/MSISDN/000111
    This contains the body of the request
- Version negotiation succeeded, picked up the version 1.0
    Confirm the API version that was used
- Callback rules are matched
    The callback rule used in this process. This can be customised, and will be covered later in this document
- Recieved callback response 200 OK
    The http response for the previous step "Sending callback put /parties/MSISDN/000111"

When you send more transfers from the simulator, these transactions will be added to the monitoring event.

![Additional transfers](/assets/images/Additional_Transfers.png)

#### 3.4 Sync Response Rules
[TODO - complete this section of user-guide]

#### 3.5 Validation Rules (Error Callbacks)
[TODO - complete this section of user-guide]

#### 3.6 Callback Rules (Success Callbacks)
[TODO - complete this section of user-guide]

#### 3.7 Outbound Request
[TODO - complete this section of user-guide]

#### 3.8 Settings
[TODO - complete this section of user-guide]