# Users Guide

## _Mojaloop Testing Toolkit_

### Introduction

The intention of this document is to provide a basic user guide to the **Mojaloop Testing Toolkit**. This easy to use toolkit was designed for both technical and non-technical users, even though the primarily users would likely be Quality Assurance (QA) resources. By following this guide, users will have a better understand of the capabilities and functionality of the toolkit.

The **Mojaloop Testing Toolkit** was designed for participants that would like to participate in the Mojaloop scheme. Intentionally build as a standard integration testing tool between a _Digital Financial Service Provider (DFSP)_ and the _Mojaloop Switch_ (Hub), to facilitate testing. This tool set can potentially be used by both the DFSP and the _Mojaloop Switch_ to verify the integration between the 2 entities.

For additional back ground information on the Self Testing Toolkit, please see [Mojaloop Testing Toolkit](/documents/Mojaloop-Testing-Tool.md). It would be to the particpant's benefit to familiarise themselves with the understanding of the  [Architecture Diagram](/documents/MojaloopÂ-Testing-Tool.md#7-architecture) that explains the various components and related flows.

If you need The Mojaloop Testing Toolkit CLI you could follow [CLI User Guide](/documents/User-Guide-CLI.md)

**Table of Contents**

1. [Getting Started](#1-getting-started)

2. [The Mojaloop Testing Toolkit](#2-the-mojaloop-testing-toolkit)

    2.1 [At first glance](#21-at-first-glance)

    2.2 [Dashboard](#22-dashboard)

    2.3 [Monitoring](#23-monitoring)

    2.4 [Sync Response Rules](#24-sync-response-rules)

    2.5 [Validation Rules (_Error Callbacks_)](#25-validation-rules)

    2.6 [Callback Rules (_Success Callbacks_)](#26-callback-rules)

    2.7 [Outbound Request](#27-outbound-request)

    2.8 [Settings](#28-settings)

3. [Mojaloop Connection Manager](#3-mojaloop-connection-manager)

    3.1 [Configure TLS](#31-configure-tls)

    3.2 [Configure JWS](#32-configure-jws)

    3.3 [Enabling TLS and JWS Verification](#33-enabling-tls-and-jws-cerification)

    3.4 [Connection Manager Keys and Certificates](#34-connection-manager-keys-and-certificates)

    3.4.1 [Certificate Authorities](#341-certificate-authorities)

    3.4.2 [TSL Client Certificates](#342-tls-client-certificates)

    3.4.3 [TLS Server Certificates](#343-tls-server-certificates)

    3.4.4 [JWS Certificates](#344-jws-certificates)

    3.5 [Alternative Set-ups](#35-alternative-set-ups)

4. [Frequently Asked Questions](#4-frequently-asked-questions)
5. [The Mojaloop Testing Toolkit CLI](#5-the-mojaloop-testing-toolkit-cli)

### 1. Getting Started

To get started, please follow the instructions in the [README](/README.md) document. This document covers the use-cases with the **Mojaloop Simulator** and **Mojaloop Simulator _UI (User Interface)_**.

### 2. The Testing Tool

#### 2.1 At first glance

When you open the **Mojaloop Testing Toolkit** in your browser, you will be welcomed by the Dashboard display. Currently this is still under development, and only display "static data". The current static display will provide you with a fair representations of the intentional Dashboard functionality.

![Opening view](/assets/images/opening-view.png)

Take note of the navigation bar on the left. The navigational items are;

- **Dashboard**
- **Monitoring**
- **Sync Response Rules**
- **Validation Rules (Error Callbacks)**
- **Callback Rules (Success Callbacks)**
- **Outbound Request**
- **Settings**

We will work through each one of the items and provide you with a fair understanding of the current functionality.

<!-- ![Menu Items](/assets/images/menu-items.png) -->

#### 2.2 Dashboard

The _Dashboard_ is the default opening window. It will provide the user with valuable statistical data pertaining to request and response activities (Request and Responses statistics, including Rules Engine "Hits" statistics).

The static data will be replaced with accurate information once the development of this functionality is at a more advanced stage.

#### 2.3 Monitoring

The _Monitoring_ navigation tab allows you to monitor _incoming_ requests from the **Mojaloop Simulator**.

![Monitoring Initial State](/assets/images/monitoring-initial-state.png) 

By following the docker installation instructions in the [README](/README.md) document, you should have the **Mojaloop Simulator UI** open in your browser tab. On the **Mojaloop Simulator UI** open browser, go to the navigation bar on the left and click on _Outbound Send_ tab.

Press _**Send Transfer**_ button on the main window to send sample test data from the **Mojaloop Simulater UI** to the **Mojaloop Testing Toolkit**. 

![Send Transfer](/assets/images/send-transfer.png)

You should receive a response on the **Mojaloop Simulator UI** as indicated below. **Note** the variable data are generated randomly, therefore it could differ from the information displayed in the images provided below.

![Simulator response](/assets/images/simulator-response.png) 

Go back to the **Mojaloop Testing Toolkit UI** in your browser and select from the navigation bar on the left the _Monitoring_ tab. You will notice the three operations associated with the above transfer request send. The most recent request with the associated operations will be the most recent displayed item on the main page and can be verified by the date/time stamp associated to each operation.

- GET /parties/{Type}/{ID}
- POST /quotes
- POST /transfers

![Monitoring messages](/assets/images/monitoring-messages.png)

To view detailed information on any one of the Callbacks, click on the operation - in this example _**GET /parties/MSISDN/0001**_ presented as a _blue button_. 

If you recall the [Architecture Diagram](/documents/Mojaloop-Self-Testing-Tool.md#7-architecture) mentioned earlier, under messages, you'll notice, Version negotiation, Schema Validation and Additional validations;

Clicking on the _+_ to the left of the expanded list on the main window to view detail related to that specific timeline message.

![Expanded monitoring messages](/assets/images/expand-monitoring-messages.png)

As an example for this document, the above messages in the image has be expanded to provide better insight.

- Request: get/parties/MSISDN/000111
  - This contains the body of the request
- Version negotiation succeeded, picked up the version 1.0
  - Confirm the API version that was used
- Callback rules are matched
  - The callback rule used in this process. This can be customized, and will be covered later in this document
- Received callback response 200 OK
  - The http response for the previous step "Sending callback put /parties/MSISDN/000111"

When you send more transfers from the **Mojaloop Simulator UI**, these transactions will be added to the monitoring event.

![Additional transfers](/assets/images/additional-transfers.png)

#### 2.4 Sync Response Rules

**_Validation and synchronous response based on the schema of the code_**

The _Sync Response Rules_ navigation tab on the left of the **Mojaloop Testing Toolset** allow you the setup fixed or mock responses. Take note of the _default.json_ file on the right hand side window. That contains the list of operations and sample content for mock or fixed responses for the operations listed on the center window. These can be tested by running the collection in Postman. (Import the [collection](/postman/mojaloop-pdp-testing-tool.postman_collection.json) and [environment](/postman/mojaloop-pdp-testing-tool.postman_environment.json) files into Postman testing tool.)

![Opening  Sync Response Rules](/assets/images/opening-sync-response-rules.png)

Below is a sample **MOCK_RESPONSE**

![Sample - Mock Response](/assets/images/mock-response-sample.png)

Below is a sample **FIXED_RESPONSE**

![Sample - Fixed Response](/assets/images/fixed-response-sample.png)

##### 2.4.1 Building your own Rules File

The toolset allows you to create your own file with a collection of rules to suite your specific testing requirements. A rule can be created completely with the web UI. But for advanced users and a comprehensive insight, please view the [Rules Engine](/RULES_ENGINE.md) document for more information related to the **Rules Engine**. 

The following section will provide an overview into building your own Rules file. 

On the left window, click the _**New Rules File**_ button in the top left. Provide an appropriate file name. Remember to save it with a _.json_ extension. Click on the _**√**_ to create/save the file.

![Creating New Rule File](/assets/images/creating-new-rule-file.png)

Click on the _**Add a new Rule**_ button on the middle top center window. The **Rule Builder** window will popup. 

![Building New Rules File](/assets/images/building-new-rules-file.png)

Firstly, select your desired **API** from the drop down list provided.  All of the supported API's are included in this list.

![Select API](/assets/images/rule-builder-select-api.png)

Next, select the _operationId_ you require for the new rule in the **Resource** dropdown list. All the _operationId_'s are listed in the dropdown list. Click on the down arrow to provide the selection. The list is as per the Swagger definition of the API selected. 

![Resource selection](/assets/images/resource-selection.png)

You have the option to include one or more **CONDITIONS** for the new rule. Select the _**Add Condition**_ button should you wish to add an additional condition to your rule. 

![Add Condition Button](/assets/images/add-condition-button.png)

You will be presented with 4 boxes each with a dropdown list to select from;

- _**Fact Type**_
- _**Fact**_
- _**Operation**_
- _**Value**_

For each of the above mentioned items, click on the down arrow in the item box to list the selection options to select from. These selection options are as per the Swagger definition for the selected **API** above.

![Sample Condition](/assets/images/sample-condition.png) 

Next step would be to select the **EVENT Type** detail below. Click on the down arrow in the item box to list the option.  Select either _**Mock Response**_ or _**Fixed Response**_.

![Event Response Options](/assets/images/event-response-options.png)

For normal use cases you can select _**Mock Response**_, where the testing toolkit can generate mock data based on the schema in the swagger file. By selecting the _**Mock Response**_, you will have the option to override the standard mock response by selecting _**Override some parameters**_ tick box. This will open the **Headers**. Your options to select from are _**Add Header**_, _**Add Required Header**_, _**Add All Headers**_.

![Header Selection](/assets/images/header-selection.png)

A sample body can also be created. The data is generated by using the swagger definition pertaining to the specified _operationId_. There are no real "value" to the sample data, but it can be edited in the editing console to be more meaningfull for testing purposes.

Click on the _**Populate with sample body**_ button. The editing window will be filled with the sample data for the body of the selected **Resource** _operationId_.

![Populate with sample body](/assets/images/populate-with-sample-body.png)

Update the sample body if so required. 

![Updated sample body data](/assets/images/updated-sample-body-data.png)

The body of the response can be configured. Click on the _**Add Configurable Params**_. The **Select a Configurable Parameter** window will pop-up with a list of valid selections. Once completed, the **Configured Parameter** is copied to clipboard by clicking on the completed ```{$request.body.state}```. This can then be used within the latter as can be seen in the sample rules image below.

![Using Configurable Parameter](/assets/images/using-configurable-parameter.png)

Once completed, you should save the newly create rule by selecting the _**Save**_ button on the top of the **Rule Builder** window.

This will provide a summarized view of the newly created rule, similar to the samples provided.

![Summarized view of Rule](/assets/images/summarized-view-of-rule.png)

Going forward, the option exist to updated the rule or delete it by selecting the appropriate button - _**Edit**_ or _**Delete**_.

Lastly, set the new rule file as active by selecting the new rule file on the right hand side window and selecting the _**Set as active**_ button. You will see the _**√**_ mark next to it to indicate it is active.

#### 2.5 Validation Rules 

_**Error Callbacks**_

This Rules section is to simulate asynchronous error callbacks.

The setup and functionality is similar to [2.4 Sync Response Rules](#24-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under [2.4.1 Building your own Rules File](#241-building-your-own-rules-file).

![Validation Rules Screen](/assets/images/validation-rules-screen.png)

#### 2.6 Callback Rules

_**Success Callbacks**_

This Rules section is to simulate asynchronous success callbacks.

The same applies for this section, the functionality is similar to [2.4 Sync Response Rules](#24-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under [2.4.1 Building your own Rules File](#241-building-your-own-rules-file).

![Callback Rules Screen](/assets/images/callback-rules-screen.png)

#### 2.7 Outbound Request

This sections will enable you to intiate requests from the testing toolkit to your DFSP implementation.

The user can create a collection of operations and add a number of assertions to these operations. The assertions can be setup and customized to support your testing requirements and verify both positive and negative requests and responses. 

Selecting the _**Outbound Request**_ navigation tab on the left side, the following will open in the main display window. 

![Outbound display opening](/assets/images/outbound-display-opening.png)

At the top of the screen, you will notice the following buttons on the main window, starting from the left.

- _**Import Collection**_
- _**Import Environment**_
- _**New Template**_
- _**Show Template**_
- _**Save**_
- _**Send**_

By selecting the _**Import Collection**_ button, it will allow you to import a collection. For your exploration, sample collections are available under the project root directory under [/examples/collections](/examples/collections) sub directory. To select one of the sample files, on the file explorer window that poped up when you selected the _**Import Collection**_ button, navigate to [/examples/collections/dfsp](/examples/collections/dfsp) under the project root directory. Select the ```p2p_happy_path.json``` file to import into the **Mojaloop Testing Toolkit** application. This sample file consist of a couple of test samples. 

By selecting the _**Import Environment**_ button, it will allow you to import input values. For your exploration, sample environments are available under the project root directory under [/examples/environments](/examples/environments) sub directory. To select one of the sample files, on the file explorer window that poped up when you selected the _**Import Environment**_ button, navigate to [/examples/environments](/examples/environments) under the project root directory. Select the ```dfsp_local_environment.json``` file to import into the **Mojaloop Testing Toolkit** application. This sample file consist of a couple of input values.

![Import Collection or Environment](/assets/images/import-template.png)

The template contains, amongst others, the following operations as samples;

_**P2P Transfer Happy Path**_

  - **get/parties/{Type}/{ID}** - Get party information

  - **post/quotes** - Get quote

  - **post/transfers** - Send transfer

![Opened Imported Template](/assets/images/opened-imported-template.png)

It is possible to update the **Input Values** on the right hand side window. Additional input values can be added, by selecting the _**Add Input Value**_ button on the top right of this right hand side window. These values relates to the specified variable that you can select and use in any **Request** that you create.

![Add Additional Input Values](/assets/images/add-additional-input-values.png)

The process is straight forward. Provide a name for the new input value and click on the _**Add**_ button.

![Add New Input Variable](/assets/images/add-new-input-variable.png)

To update values of exisiting variable(s) to the **Input Values**, simply select the value next to the variable and type in a new value. It will then be available for use in the test cases imported earlier.

![Add New Input Value](/assets/images/add-new-input-value.png)

The window on the left contains the _**Template**_ with the _Test Cases_ and operations. 

![Template Window](/assets/images/template-window.png)

Click on the _**Edit**_ button, to open up the _**Test Case**_ in the edit mode.

![Test-Case Editor](/assets/images/test-case-editor.png)

The **Request** tab reflects both the appropriate _Header_ and _Body_ that makes up the request as per the selected **API** swagger specification. These values can be changed in the **Editor** tab.

![Sample Request](/assets/images/sample-request.png)

The **Editor** tab displays request content and it can be updated manually on this window. Depending on how the request was defined, you will be able to see the selected **API**, the _operationId_, the _Header_ and _Body_ content. Options to _**Duplicate**_, _**Delete**_ or _**Rename**_ are also available as buttons above. There are some additional options like _Override with Custom URL_ or _Ignore Callbacks_. You can also build your own new request by selecting the _**Add New Request**_ button on the top right of this window. The process to build a new request is similar to the one explained in [2.4 Sync Response Rules](#24-sync-response-rules)

![Sample Scripts](/assets/images/sample-editor.png)

The **Scripts** tab allows you to use postman like pre request and test scripts. Make sure that advanced features options is enabled. 
- pm.test - not supported - Use Testing Toolkit Tests for this purpose. In **Tests** You could use values stored in the environment. To access thoes values use environment.'key'
- pm.response - to get the response object outside pm.sendRequest use pm.response.body not pm.response.json()
- everything else should work the same way is in postman

![Sample Pre Request and Post Request Scripts](/assets/images/test-case-editor-scripts.png)

After executing the test case you will see _Console Log_ and _Environment State_ as well.

- _Console Log_

![Sample Scripts - Console Log](/assets/images/test-case-editor-console-log.png)

- _Environment State_

![Sample Scripts - Environment State](/assets/images/test-case-editor-environment-state.png)

The **Tests** tab contains the assertions that was setup for the specified _operationId_. These are similar to PostMan tests and will evaluate the request and/or the response based on the requirements of the assertion. The below is an assertion from the sample _Import Template_ imported earlier, and validate the Callback and expect the _**response.status**_ to be equal to _**202**_.

![Sample Test Assertion](/assets/images/sample-test-assertion.png)

To create a new assertion, you can either add to an existing assertion, or choose to set-up a new assertion. Apart from naming new assertion,the rest of the steps are the same in both cases. We will only cover the basic set-up for this document. The options to _**Rename**_ or _**Delete**_ the assertion are also avalable.

To create a new assertion, select the _**Add New Assertion**_ button on the top right. Provide an appropriate name and click on the _**Add**_ button.

![Add New Assertion](/assets/images/add-new-assertion.png) 

The new assertion will be available at the bottom of the existing assertions for that operation. 

Navigate to the newly created assertion, and click on the arrow on the left to expand the dropdown list.

![New Empty Assertion](/assets/images/new-empty-assertion.png) 

Include a new expectation by selecting the _**Add Expectation**_ button at the bottom left. This will launch the **Expectation** window. Selecting the first box will provide you with the option to either select a synchronous response or a callback to be assessed.

![Assess Request or Response](/assets/images/assess-request-or-response.png)

We have opted for the _Response_. Next select the field to be assessed - _Status_ was selected for this demo. 

![Assess Response Status](/assets/images/assess-response-status.png)

Select the equation from the middle box. We have opted for _Not Equal to_.

![Assess Response Equation](/assets/images/assess-response-equation.png)

Add the required value in the last box and click on the _**Save**_ button. Congratulations - you have successfully created an assertion. 

![Assess Response Equation Save](/assets/images/assess-response-equation-save.png)

It is also possible to compare the values from **Input Values** or the parameters from the request. Select the _**Configurable Parameter**_ button at the bottom right to launch the **Configurable Parameter** window. Click on the dropdown box to provide the list of possible options. We have selected _Input Values_ for this demo.

![Configurable Parameter](/assets/images/configurable-parameter.png)

Click on the **Input Values** box below to display the dropdown list.  Select one of the options listed. We have chosen _currency_ for this demo.

![Configurable Parameter Currency](/assets/images/configurable-parameter-currency.png)

The _Configurable Parameter_ ```{$inputs.currency}``` is now available for use with the option to _Copy to clipboard_ or _Insert into editor_.

To get a better understanding of how this will work, please refer to the below. This assertion is part of the samples provided. This assertion contains 2 expectations. You will notice it is possible to refer to the values from the previous _operationId_ ```$prev.2.callback.body.*``` and can be compared to the values from the current _operationId_ ```$request.body.*```. Due to the technical nature of these assertions, it will be explained in detail in a seperate document.

![Configurable Parameter Assertion](/assets/images/configurable-parameter-assertion.png)

Finally we can execute the _Test Cases_. Please insure you added a user with {MSISDN} and value found in the **Input Values** on the simulator (see [Frequently Asked Questions](#4-frequently-asked-questions) section [4.2 Generic ID not found](#42-eneric-id-not-found)). 

- Select the _**Send**_ button on the right top.

![Sending Test Cases](/assets/images/sending-test-cases.png)

- Select the aditional options and _**Send this test case**_ button on the right top.

![Sending Test Cases](/assets/images/sending-single-test-case-1.png)

- Select _**Edit**_ and then the _**Send**_ button on the right top.

![Sending Test Cases](/assets/images/sending-single-test-case-2.png)

If you select the _**Edit**_ button now, you will notice the addition of the response tab. Select that to view all the responses for the operation.

![View Response](/assets/images/view-response.png)

#### 2.8 Settings

The _**SETTINGS**_ navigation tab will open to the **SETTINGS** window. Below is the default view of this page.

![Opening Default Settings](/assets/images/opening-default-settings.png)

The **SETTINGS** window consist of the following two windows;

On the left **Runtime Global Configuration** displays the actual configuration that is effectively active by the **Mojaloop Testing Toolkit** service.

On the right **Edit Global Configuration** amongst a couple of other options, it allows you to edit the values manually. Should you elect to use other environment values you can disable the default values by selecting the _**Override with Environment Variable**_ option.

In a default docker deployment, the environment values will be provided in the _local.env_ file in the project root directory.

![Override with Environment Variable](/assets/images/override-with-environment-variable.png)

### 3. Connection Manager

To incorporate security and authenticity validations between the testing DFSP and the _Mojaloop Switch_, the **Mojaloop Connection Manager** can be activated to integrate with the **Mojaloop Testing Toolkit**. This will allow the incorporation of TLS and JWS Certificates and Key validations as part of the process.

#### 3.1 Configure TLS

This section will guide you in the required configuration updates to enable running with TLS, enabled in a local docker container environment.

To enable TLS, you need to apply the following configurations on the local file system. Remember to save the files when the configurations are completed.

- [local.env](/local.env) file under the root directory;
  
  - update _CALLBACK_ENDPOINT_ to **HTTPS**,
  
  - update _INBOUND_MUTUAL_TLS_ENABLED_ to **true**,
  
  - Update _OUTBOUND_MUTUAL_TLS_ENABLED_ to **true**.
	
```
CALLBACK_ENDPOINT=https://scheme-adapter:4000
.
.
.
INBOUND_MUTUAL_TLS_ENABLED=true
OUTBOUND_MUTUAL_TLS_ENABLED=true
```

![Local Enabled Mutual TLS](/assets/images/local-mutual-tls-enabled.png)

- [/simulator/scheme-adapter.env](/simulator/scheme-adapter.env) file, make the following update;
  
  - Update _INBOUND_MUTUAL_TLS_ENABLED_ to **true**,
  
  - Update _OUTBOUND_MUTUAL_TLS_ENABLED_ to **true**.

```
INBOUND_MUTUAL_TLS_ENABLED=true
OUTBOUND_MUTUAL_TLS_ENABLED=true
```

![Adapter Enabled Mutual TLS](/assets/images/adapter-mutual-tls-enabled.png)
		
The TLS certificates and keys for the _Mojaloop Switch_ have already been pre-generated and populated for use in the docker container. For information purposes ,the configuration and location are defined in the file content as per the image below. 

![Simulator HUB TLS Certificates and Key](/assets/images/tls-hub-certs-keys.png)

The current configuration caters for a local setup within a docker container. 

Current setup for **Mojaloop Simulator** endpoint, pointing to _scheme-adapter_ as part of the docker containers.

![Simulator Pointing to Scheme-adapter](/assets/images/simulator-scheme-adapter-endpoint.png)

Current setup for **Mojaloop Testing-Toolkit** endpoint, pointing to _mojaloop-testing-toolkit_ as part of the docker containers.
 
![ML Testing Toolkit Pointing to mojaloop-testing-toolkit](/assets/images/testing-toolkit-mojaloop-testing-toolkit-endpoint.png)

#### 3.2 Configure JWS

This section will guide you through the required configurations to run with JWS, enabled in a local docker container environment.

To enable JWS, you need to apply the following configurations on the local file system. Remember to save the files when the config is completed.

- [local.env](/local.env) file under the root directory;
  
  - update _VALIDATE_INBOUND_JWS_ to **true**,
  - update _VALIDATE_INBOUND_PUT_PARTIES_JWS_ to **true**,
  - update _JWS_SIGN_ to **true**,
  - update _JWS_SIGN_PUT_PARTIES_ to **true**.
	
```
VALIDATE_INBOUND_JWS=true
VALIDATE_INBOUND_PUT_PARTIES_JWS=true
JWS_SIGN=true
JWS_SIGN_PUT_PARTIES=true
```

![Local Enabled JWS PublicKey](/assets/images/local-enable-jws-publickey.png)

- [/simulator/scheme-adapter.env](/simulator/scheme-adapter.env) file, make the following update;
  
  - Update _INBOUND_MUTUAL_TLS_ENABLED_ to **true**,
  - Update _VALIDATE_INBOUND_JWS_ to **true**,
  - Update _VALIDATE_INBOUND_PUT_PARTIES_JWS_ to **true**,
  - Update _JWS_SIGN_ to **true**,
  - Update _JWS_SIGN_PUT_PARTIES_ to **true**.

```
VALIDATE_INBOUND_JWS=true
VALIDATE_INBOUND_PUT_PARTIES_JWS=true
JWS_SIGN=true
JWS_SIGN_PUT_PARTIES=true
```
		
The JWS certificates and publickey for the _Mojaloop Switch_ have already been pre-generated and populated for use in your local docker container. For information purposes, the configuration and location are defined in the file content as per the image below. 

![JWS Hub Certificates and Key](/assets/images/jws-hub-certs-keys.png)

The current configuration caters for a local setup within a docker container. 

Current setup for **Mojaloop Simulator** pointing to _scheme-adapter_ as part of the docker containers.

![Simulator Pointing to Scheme-adapter](/assets/images/simulator-scheme-adapter-endpoint.png)

Current setup for **Mojaloop Testing- Toolkit** pointing to _mojaloop-testing-toolkit_ as part of the docker containers.
 
![ML Testing Toolkit Pointing to mojaloop-testing-toolkit](/assets/images/testing-toolkit-mojaloop-testing-toolkit-endpoint.png)

#### 3.3 Enabling TLS and JWS Verification

As we have made updates to the configuration files for both **Mojaloop Simulator** and **Mojaloop Testing Toolkit**, we will need to restart both docker containers. In the appropriate terminal windows for the 2 applications, stop the docker containers by pressing **Ctrl + C** simultaneously on the keyboard in each terminal window. These actions should "Gracefully stop" the respective local docker containers. To insure all the docker containers are in fact down, run the following command in the respective terminal windows.

```
docker-compose down
```  

It is good practice and recommended to verify that all local docker containers are down by running the below command to ensure that there are no local docker containers still active.

```
docker-compose ps
```

There shouldn't be any active local docker containers. You should see the following on the respective terminal windows

```
Name   Command   State   Ports
------------------------------
```

To enable the integration with **Mojaloop Connection Manager**, you will need to open a new terminal window to bring up **Mojaloop Connection Manager** service within a local docker container. (We will refer to this new session as "Connection Manager terminal" to avoid confusion. 

The **Mojaloop Connection Manager** is downloaded as part of the **Mojaloop Testing Toolkit**. Just navigate to the respective folder from the project root _/connection-manager_.

```
cd connection-manager
```

To start **Mojaloop Connection Manager** as part of the **Mojaloop Testing Toolkit**, execute the below command in the "Connection Manager terminal" terminal window.

```
docker-compose up
```  

**Important Notes**
- The **Mojaloop Connection Manager** environment is created when the **Mojaloop Testing Toolkit** service is started. Please insure the service is available and stable before starting **Mojaloop Testing Toolkit** service.

- The **Mojaloop Testing Toolkit** is a local docker image. With the configuration change to enable TLS and JWS, the local docker image will need to be recreated before restarting **Mojaloop Testing Toolkit**. In the project root directory, execute the following to rebuild the docker image to include the updated configurations.

  ```
  docker-compose build
  ```

After the images rebuild is competed, restart **Mojaloop Simulator** and **Mojaloop Testing Toolkit**. Simply run the below command in both the respective terminal windows for the 2 services. The services will startup in the respective docker containers as described in the initial instructions in the [README](/README.md) document.

```
docker-compose up
``` 

Once **Mojaloop Testing Toolkit** service is available, open the UI in a browser, as described in the [README](/README.md) document. Verify that the TLS and JWS setting are enabled by navigating to _**Settings**_ on the right hand navigation pane and select _**Settings**_.

As per the initial configurations that was done on the _local.env_ files, you will notice on the _**Runtime Global Configuration**_ window on the left the following settings for JWS and TLS are updated and enabled;

- Callback URL starts with **https://**
- Enable Inbound JWS Validation is **√**
- Enable Inbound JWS Signing for PUT /parties is **√**
- Enable Outbound JWS Signing is **√**
- Enable Outbound JWS Signing for PUT /parties is **√**
- Enable Inbound Mutual TLS is **√**
- Enable Outbound Mutual TLS is **√**

![TLS and JWS Enabled on Environment](/assets/images/tls-jws-enabled-on-environment.png)

By now **Mojaloop Connection Manager** and all other services should br available with the updated security configurations (TLS and JWS). Open a browser and enter ```localhost:5060``` in the url. This will open the **Mojaloop Connection Manager UI**. You will be signed in as a _DFSP_ **dfsp1**, on a _**TESTING-TOOL**_ environment.

*Note* - If a _Username_ and _Password_ is required, enter "test" for both.

![Connection Manager UI Opening](/assets/images/connection-manager-ui-opening.png)


#### 3.4 Connection Manager Keys and Certificates

Even though all the certificates for **Mojaloop Testing Toolkit** and **Mojaloop Simulator** have been pre-generated and placed in a folder, ready for use, some manual actions are required to enable the integration with **Mojaloop Connection Manager**. The sample demostration within this document, demostrates **Mojaloop Testing Toolkit** as the testing DFSP and interfacing with the **Mojaloop Simulator** simulating the _Mojaloop Switch_. **Mojaloop Connect Manager** set-up is from the DFSP perspective.

From the **Mojaloop Connect Manager** window, click on the _**TESTING-TOOL**_ environment button.

![MCM Environment Opening](/assets/images/mcm-environment-opening.png)

##### 3.4.1 Certificate Authorities

On the navigational tab on the left, navigate to _Certificates_ and select _Certificate Authorities_. Under the _DFSP Certificate Authority_ tab in the _Root Certificate_ box, click on _Choose file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_client_cacert.pem``` file. 

![dfsp_client_cacert](/assets/images/dfsp-client-cacert.png)

##### 3.4.2 TLS Client Certificates

Still under _Certificates_ on the navigational tab on the left, select _TLS Client Certificates_. Under the _CSR_ tab in the _CSR_ box, click on the _choose file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_client.csr``` file. On submission of this CSR, the testing toolkit will automaticallly sign this and the signed certificate will be available in the _Sent CSR_ tab. Under normal circumstances, you can download this client certificate and provide it to your DFSP implementation. But for this demo, it is already placed in the simulator/tls folder for convinience.

![dfsp_client](/assets/images/dfsp-client.png)

Click on the _**√ Submit**_ button to send the file to the HUB signing.

![dfsp_client Submit](/assets/images/dfsp-client-submit.png)

Now select the _Unprocessed Hub CSRs_ tab. Under normal circumstances, we will download the CSR file and sign it with our _Certificate Authority (CA)_  by clicking on the _Download CSR_ button. For the demo as we already have the signed hub certificate in the folder, this is not necessary, and you can click on the _Upload Certificate_ button on the right of the main window. Navigate to ```/simulator/secrets/tls/``` and select ```hub_client_cert.pem``` file.

![hub_client_cert](/assets/images/hub-client-cert.png)

##### 3.4.3 TLS Server Certificates

Still under _Certificates_ on the navigational tab on the left, select _TSL Server Certificates_. Under the _DFSP Server certificates_ tab in the _Server certificate_ box, click on the _Choice File_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_server_cert.pem``` file.

![dfsp_server_cert](/assets/images/dfsp-server-cert.png)

Under the _DFSP Server certificates_ tab in the _Root certificate_ box, click on the _Choose File_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_server_cacert.pem``` file.

![dfsp_server_cacert](/assets/images/dfsp-server-cacert.png)

Click on the _**√ Submit**_ button

![Server certificates submitted](/assets/images/server-certificates-submitted.png)

To do a quick verification that everything is still functioning as expected, you can repeat the simulator test done in 3.3 [Monitoring](#33-monitoring).

##### 3.4.4 JWS Certificates

Still under _Certificates_ on the navigational tab on the left, select _JWS Certificates_. Under the _DFSP JWS Certificates_ tab in the _JWS Certificate_ box, click on the _Choose File_ button. Navigate to ```/simulator/secrets/jws/``` and select ```publickey.cer``` file.

![JWS Certificate](/assets/images/jws-certificate.png)

Click on the _**√ Submit**_ button to upload the JWS Public Key Certificate.

![dfsp_client Submit](/assets/images/jws-certificate-submit.png)


#### 3.5 Alternative Set-ups

It is possible for **Mojaloop Testing Toolkit** to function outside of a _local_ environment, enabling more advance integration testing and verifications between a _Mojaloop Switch_ and testing DFSP before going live. These are not covered within the boundaries of this document, but you are more than welcome to explore this functionality.

Please be aware should you set-up on another environment or DFSPs, some variables will need to be updated like the DNS or IP address of the server. Certificates and keys will also need to be generated and implemented for the new environment and DFSPs should TLS and JWS be enabled.

These configurations will be covered in a separate document. This will include the actions required on **Mojaloop Connection Manager**, **Mojaloop Testing Toolkit** and **Mojaloop Simulator** to enable the adding of DFSPs, and testing with new environments for DFSPs.

This document will provide guidance on the following;
- add a new DFSP on an existing environment,
- add a new environement for a DFSP,
- guide you to create your own TLS and JWS certificate and keys for inclusion into **Mojaloop Connection Manager**,
- guide you through the configuration required to integrate functionality between the testing entities.

Script files are provided in the respective directories to speed up the process to generate these certificates for both the **Mojaloop Simulator** and **Mojaloop Testing Toolkit**. 

- **Mojaloop Simulator** the file path;
  /simulator/secrets/tls/createSecrets.sh
  /simulator/secrets/jws/keygen.sh

- **Mojaloop Testing Toolkit** the file path;
  /secrets/tls/createSecrets.sh
  /secrets/keygen.sh

As mentioned in the begining of this section, the aforementioned scenarios will be elaborated on in a seperate document.

### 4. Frequently Asked Questions

This section will list a number a frequently asked questions and the solutions provided.

#### 4.1 Mojaloop Connection Manager require sign on

When opening **Mojaloop Connection Manager** in my browser, a _**Username**_ and _**Password**_ is required.
   - The default is to open to the available environment, _**TESTING-TOOLKIT**_ as default. After the initial opening, and a time lapses, the **Mojaloop Connection Manager UI** will request you to sign on. Use the default _**Username**_ => ```test``` and _**Password**_ => ```test```.

#### 4.2 Generic ID not found

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

   - The reason for this is the **Inbound User** is no present on the **Mojaloop Simulator**. For the samples used in this document, you will need to create a new user for **MSISDN** = **9848613613**. In the **Mojaloop Simulator UI**, select _**+ Add User**_ button on the _**Config Inbound**_ navigation tab. Below screenshot is a sample based on the sample data used within this document. Click on the _**√ Submit**_ button when done. 
   
   You are welcome to change any values as required. Important values to keep in mind, are the _Id Type_, _Id Value_ and the _DateOfBirth_ date format _(CCYY-MM-DDD)_.

   ![Create Inbound User on Simulator](/assets/images/create-inbound-user-simulator.png)