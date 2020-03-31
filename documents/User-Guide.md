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

    3.5 [Validation Rules (_Error Callbacks_)](#35-validation-rules)

    3.6 [Callback Rules (_Success Callbacks_)](#36-callback-rules)

    3.7 [Outbound Request](#37-outbound-request)

    3.8 [Settings](#38-settings)

### 1. Introduction

The intention of this document is to provide a basic user guide to the mojaloop Self Testing Toolkit. This easy to use toolkit was designed for both technical and non-technical users, even though the primarily users would likely be Quality Assurance (QA) resources. By following this guide, users will have a better understand of the capabilities and fuctionality of the tool set.

The mojaloop Self Testing Toolkit was designed for participants that would like to partcipate in the mojaloop Hub scheme. Intentially build to have a standard way to test integration with a Mojaloop Hub, this tool set can potentially be used by both the DFSP and the Hub to verify the inergration between the 2 entities.

For additional back ground information on the Self Testing Toolkit, please see [mojaloop Self Testing Toolkit](/documents/Mojaloop-Self-Testing-Tool.md). At the same time, understanding the [Architecture Diagram](/documents/Mojaloop-Self-Testing-Tool.md#7-architecture) components and related flow, would be beneficial.

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

If you have followed the installation instructions, you should have the Simulator UI open in a browser tab. Go to the **Outbound Send** tab on the left.

Press **Send Transfer** button to send a request from the Simulator UI to the Self Testing Toolkit.

![Send Transfer](/assets/images/Send_Transfer.png)


If the request is send successfully from the Simulator UI.

![Simulator response](/assets/images/Simulator_Response.png) 

Go back to the Monitoring tab on the Self Testing Toolset. You will notice the three requests associated with a transfer in an order such that most recent request first.

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

**_Validation and synchronous response based on the schema of the code_**

The **Sync Response Rules** tab allow you the setup fixed or mock responses. You will notice the _default.json_ file on the right hand side. That is the sample content provided for mock or fixed responses on the center display. These can be tested by running the Postman scripts supplied in the root directory of this project.

![Opening  Sync Response Rules](/assets/images/Opening_Sync_Response_Rules.png)

Below is a sample **MOCK_RESPONSE**

![Sample - Mock Response](/assets/images/Mock-Response-Sample.png)

Below is a sample **FIXED_RESPONSE**

![Sample - Fixed Response](/assets/images/Fixed-Response-Sample.png)

**Building your own Rules File**

It is possible to create your own file with a collection of rules to suite your specific requirements. For an comprehensive insight, please view [Rules Engine](../RULES_ENGINE.md) document. 

The following sectin will provide an overview into building your own Rules file. 

On the left window, click the **New Rules File** tab. Provide an appropriate file name. Remember to save it with a _**.json**_ extension.

![Creating New Rule File](/assets/images/Creating-New-Rule-File2.png)

Click on the **Add a new Rule** button on the middle top right window. The _**Rule Builder**_ will popup. 

First thing to do is to select the desired **API** from the drop down. All the current supported API's will be listed there. 

![Select API](/assets/images/Rule-Builder-Select-API.png)

Next you will need to select the _operationId_ you require for the new rule. All the _operationId_'s are listed in the **Resource** drop down list. The list is build from the Swagger definition of the selected API. 

![Resource selection](/assets/images/Resource-selection.png)

You have the option to include one or more _**CONDITION**_ for the new rule. Select the **Add Condition** button. 

![Add Condition Button](/assets/images/Add-Condition-Button.png)

You will be presented with 4 drop down list to select from;

- _**Fact Type**_
- _**Fact**_
- _**Operation**_
- _**Value**_

You will have an drop down list for each one, depending on the _Resource_ selection. These are as per the Swagger definition.

![Sample Condition](/assets/images/Sample-Condition.png) 

Next step would be to select the **EVENT** Type detail below. The drop down menu will provide you with the option to either select a **Mock Response** or a  **Fixed Response**.

![Event Response Options](/assets/images/Event-Response-Options.png)

By selecting the **Mock Response**, you will have the option to override the standard mock response by selecting **Override some parameters** tick box. This will open the **Headers**. Your options to select from are **Add Header**, **Add Required Header**, **Add All Headers**.

![Header Selection](/assets/images/Header-Selection.png)

A sample body can also be created. The data are build from the swagger definition to be correct for the data type. There are no real "value" to the sample data, but it can be edited in the editing console to be meaning full for testing purposes.

Click on the **Populate with sample body** button. The editing window will be filled with the sample data for the body of the selected **Resource** _operationId_.

![Populate with sample body](/assets/images/Populate-with-sample-body.png)

Update the sample body if so required. 

![Updated sample body data](/assets/images/Updated-sample-body-data.png)

The body of the response can be configured. Click on the **Add Configurable Params**. The **Select a Configurable Parameter** window will pop-up with a list of valid selections. Once completed, the **Configured Parameter** is copied to clipboard by clicking on the completed ```{$request.body.state}```. This can then be used within the later as can be seen in the sample rules below image.

![Using Configurable Parameter](/assets/images/Using-Configurable-Parameter.png)

Once completed, you should save the newly create rule by selecting the **save** button on the top of the **Rule Builder** window.

This will provide a summarized view of the newly create rule, similar to the samples provided.

![Summarized view of Rule](/assets/images/Summarized-view-of-Rule.png)

Going forward, the option exist to updated the rule or delete it by selecting the appropriate button - **Edit** or **Delete**.

Lastly, set the new rule file as active by selecting the new rule file on the right hand side and selecting the **Set as active** button. You will see the tick mark next to it to indicate it is active.

#### 3.5 Validation Rules 

**_Error Callbacks_**

The setup and functionality is simular to [3.4 Sync Response Rules](#34-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under **Building your own Rules File**

![Validation Rules Screen](/assets/images/validation-rules-screen.png)

#### 3.6 Callback Rules

**_Success Callbacks_**

The same applies for this section, the functionality is simular to [3.4 Sync Response Rules](#34-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under **Building your own Rules File**

![Callback Rules Screen](/assets/images/callback-rules-screen.png)

#### 3.7 Outbound Request

This part is still being enhanched. These updates will be included in the document as the product is updated. 

The main view and functionality are only described below.

On opening the _**Outbound Request**_ tab you will be welcomed with the following display.


![Outbound display opening](/assets/images/Outbound-Display-Opening.png)

At the top of the screen, you will notice the following buttons, starting from the left.

- Import Template
- New Template
- Show Template
- Save
- Send

By slecting the **Import Template** option, you will need to navigate to the sub directory _test-case_ within the project. Select the _p2p_transfer.json_ file. Open the file to import into the application.

![Import Template](/assets/images/Import-Template.png)

The sample template contains the following requests as samples;

1. **get/parties/{Type}/{ID}** - Get party information
2. **post/quotes** - Get quote
3. **post/transfers** - Send transfer

![Opened Imported Template](/assets/images/Opened-Imported-Template.png)

It is possible to update the **Input Values**. Additional input values can be added, by selecting the **Add Input Value** button on the top right of the **Import Template** screen. These will need to be correct as per the swagger definition for the selected API swagger definition.

Below the **Input Values**, you will notice the API operation Id with a decription and the content of the request. The **Request** reflects both the appropiate _Header_ and _Body_ that makes up the request as per the API swagger definition.

![Sample Request](/assets/images/Sample-Request.png)

From 1 to a _n_ number of requests can be setup/created. By selecting the **Send** button on the left top, these requests will execute. The response Tab will appear ontop, allowing the Response data to be review, as per the sample failure below.

![Sample Response Failure](/assets/images/Sample-Response-Failure.png)

#### 3.8 Settings

The **SETTINGS** tab consist on the; 

_**Runtime Global Configuration**_ displays the environmental setting as stippulated in the _local.env_ file

_**Edit Global Configuration**_ allows you to edit and override the environment variables by selecting the **Override with Environment Variable** tikbox.

![Override with Environment Variable](/assets/images/Override-with-Environment-Variable.png)
