# Users Guide

## _Mojaloop Testing Toolkit_

**Table of Contents**

1. [Introduction](#1-introduction)

2. [Getting Started](#2-getting-started)

3. [The Mojaloop Testing Toolkit](#3-the-mojaloop-testing-toolkit)

    3.1 [At first glance](#31-at-first-glance)

    3.2 [Dashboard](#32-dashboard)

    3.3 [Monitoring](#33-monitoring)

    3.4 [Sync Response Rules](#34-sync-response-rules)

    3.5 [Validation Rules (_Error Callbacks_)](#35-validation-rules)

    3.6 [Callback Rules (_Success Callbacks_)](#36-callback-rules)

    3.7 [Outbound Request](#37-outbound-request)

    3.8 [Settings](#38-settings)

4. [Connection Manager](#4-connection-manager)

    4.1 [TLS on local Docker](#41-tls-on-local-docker)

    4.2 [Enabling TLS Verification](#42-enabling-the-tls-verification)

    4.3 [Connection Manager Certificates](#43-connection-manager-certificates)

    4.4 [Alternative Setups](#43-alternative-setups)

### 1. Introduction

The intention of this document is to provide a basic user guide to the **Mojaloop Testing Toolkit**. This easy to use toolkit was designed for both technical and non-technical users, even though the primarily users would likely be Quality Assurance (QA) resources. By following this guide, users will have a better understand of the capabilities and functionality of the tool set.

The **Mojaloop Testing Toolkit** was designed for participants that would like to participate in the Mojaloop scheme. Intentionally build to as a standard integration testing tool between a _Digital Financial Service Provider (DFSP)_ and the  Mojaloop Switch to facilitate testing. This tool set can potentially be used by both the DFSP and the Hub to verify the integration between the 2 entities.

For additional back ground information on the Self Testing Toolkit, please see [Mojaloop Testing Toolkit](/documents/Mojaloop-Testing-Tool.md). At the same time, understanding the [Architecture Diagram](/documents/MojaloopÂ-Testing-Tool.md#7-architecture) components and related flow, would be beneficial.

### 2. Getting Started

To get started, please follow instruction in the [README](/README.md) document. This document covers the use-cases with the **Mojaloop Simulator** and **Mojaloop Simulator _UI (User Interface)_**.

### 3. The Testing Tool

#### 3.1 At first glance

When you open the **Mojaloop Testing Toolkit** in your browser, you will be welcomed by the Dashboard display. Currently this is still under development, and only display "static data". The current static display will provide you with a fair representations of the intentional Dashboard functionality.

![Opening view](/assets/images/Opening_View.png)

Take notice of the navigation bar on the left. The navigational items are;

- **Dashboard**
- **Monitoring**
- **Sync Response Rules**
- **Validation Rules (Error Callbacks)**
- **Callback Rules (Success Callbacks)**
- **Outbound Request**
- **Settings**

We will work through each one of the items and provide you with a fair understanding of the current functionality.

<!-- ![Menu Items](/assets/images/Menu_Items.png) -->

#### 3.2 Dashboard

The _Dashboard_ is the default opening window. It will provide the user with valuable statistical data as to the useage of **Mojaloop Testing Toolkit** pertaining to request and response activities (Request and Responses statistics, including Rules Engine "Hits" statistics).

Accurate information would be available once the development of this functionality is at a more mature stage. Currently only static information is displayed.

#### 3.3 Monitoring

The _Monitoring_ navigation tab allows you to monitor the _incoming_ requests.

![Monitoring Initial State](/assets/images/Monitoring_Initial_State.png) 

By following the docker installation instructions in the [README](/README.md), you should have the **Mojaloop Simulator UI** open in your browser tab. On the **Mojaloop Simulator UI** open browser, go to the navigation bar on the left and click on _Outbound Send_ tab.

Press _Send Transfer_ button on the main window to send sample test data from the **Mojaloop_Simulater UI** to the **Mojaloop Testing Toolkit**. 

![Send Transfer](/assets/images/Send_Transfer.png)

You should receive a response on the **Mojaloop Simulator UI** as indicated below. **Note** the variable data are generated randomly, so could differ than in the images provided below.

![Simulator response](/assets/images/Simulator_Response.png) 

Go back to the **Mojaloop Testing Toolset** in your browser and select from the navigation bar on the left the _Monitoring_ tab. You will notice the three requests associated with the above transfer request send. The order will always show the most recent request first item listed on the main page content.

- GET /parties/{Type}/{ID}
- POST /quotes
- POST /transfers

![Monitoring messages](/assets/images/Monitoring_Messages.png)

To view detail information on any one of the callback, click on the operation - in this example _GET /parties/MSISDN/0001_ presented as a _blue button_. 

If you recall the [Architecture Diagram](/documents/Mojaloop-Self-Testing-Tool.md#7-architecture) mentioned earlier, under messages, you'll notice, Version negotiation, Schema Validation and Additional validations;

Clicking on the _+_ to the left of the expanded list on the main window to view detail related to that specific timeline message.

![Expanded monitoring messages](/assets/images/Expand_Monitoring_Messages.png)

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

![Additional transfers](/assets/images/Additional_Transfers.png)

#### 3.4 Sync Response Rules

**_Validation and synchronous response based on the schema of the code_**

The _Sync Response Rules_ navigation tab on the left of the **Mojaloop Testing Toolset** allow you the setup fixed or mock responses. Take notice the _default.json_ file on the right hand side window. That contains the list of operations and sample content for mock or fixed responses for the operations listed on the center window. These can be tested by running the collection in Postman. (Import the [collection](/postman/mojaloop-pdp-testing-tool.postman_collection.json) and [environment](/postman/mojaloop-pdp-testing-tool.postman_environment.json) files into Postman testing tool.)

![Opening  Sync Response Rules](/assets/images/Opening_Sync_Response_Rules.png)

Below is a sample **MOCK_RESPONSE**

![Sample - Mock Response](/assets/images/Mock-Response-Sample.png)

Below is a sample **FIXED_RESPONSE**

![Sample - Fixed Response](/assets/images/Fixed-Response-Sample.png)

**Building your own Rules File**

The toolset allows you to create your own file with a collection of rules to suite your specific testing requirements. A rule can be created completely with the web UI. But for advanced users and a comprehensive insight, please view the [Rules Engine](/RULES_ENGINE.md) document for more information related to the **Rules Engine**. 

The following section will provide an overview into building your own Rules file. 

On the left window, click the _New Rules File_ button in the top left. Provide an appropriate file name. Remember to save it with a _**.json**_ extension. Click on the |√| to create/save the file.

![Creating New Rule File](/assets/images/Creating-New-Rule-File2.png)

Click on the _Add a new Rule_ button on the middle top center window. The _**Rule Builder**_ window will popup. 

![Building New Rules File](/assets/images/Building-New-Rules-File.png)

First thing to do is to select the desired _**API**_. Click on the down arrow to provide the selection. All the current supported API's are listed in the drop down list. 

![Select API](/assets/images/Rule-Builder-Select-API.png)

Next, select the _operationId_ you require for the new rule in the _**Resource**_ dropdown list. All the _operationId_'s are listed in the drop down list. Click on the down arrow to provide the selection. The list is build from the Swagger definition of the API selected. 

![Resource selection](/assets/images/Resource-selection.png)

You have the option to include one or more _**CONDITION**_ for the new rule. Select the _Add Condition_ button. 

![Add Condition Button](/assets/images/Add-Condition-Button.png)

You will be presented with 4 boxes each with a drop down list to select from;

- _**Fact Type**_
- _**Fact**_
- _**Operation**_
- _**Value**_

For each of the above mentioned items, click on the down arrow in the item box to list the selection options to select from. These selection options are as per the Swagger definition for the selected API above.

![Sample Condition](/assets/images/Sample-Condition.png) 

Next step would be to select the _**EVENT**_ Type detail below. Click on the down arrow in the item box to list the option.  Select either _**Mock Response**_ or _**Fixed Response**_.

![Event Response Options](/assets/images/Event-Response-Options.png)

For normal use case you can select _**Mock Response**_, testing toolkit can generate mock data based on the scheme in swagger file. By selecting the _**Mock Response**_, you will have the option to override the standard mock response by selecting _**Override some parameters**_ tick box. This will open the _**Headers**_. Your options to select from are _**Add Header**_, _**Add Required Header**_, _**Add All Headers**_.

![Header Selection](/assets/images/Header-Selection.png)

A sample body can also be created. The data are build from the swagger definition to be correct for the data type. There are no real "value" to the sample data, but it can be edited in the editing console to be meaning full for testing purposes.

Click on the _Populate with sample body_ button. The editing window will be filled with the sample data for the body of the selected _**Resource**_ _operationId_.

![Populate with sample body](/assets/images/Populate-with-sample-body.png)

Update the sample body if so required. 

![Updated sample body data](/assets/images/Updated-sample-body-data.png)

The body of the response can be configured. Click on the _**Add Configurable Params**_. The _**Select a Configurable Parameter**_ window will pop-up with a list of valid selections. Once completed, the _**Configured Parameter**_ is copied to clipboard by clicking on the completed ```{$request.body.state}```. This can then be used within the later as can be seen in the sample rules below image.

![Using Configurable Parameter](/assets/images/Using-Configurable-Parameter.png)

Once completed, you should save the newly create rule by selecting the _save_ button on the top of the _**Rule Builder**_ window.

This will provide a summarized view of the newly create rule, similar to the samples provided.

![Summarized view of Rule](/assets/images/Summarized-view-of-Rule.png)

Going forward, the option exist to updated the rule or delete it by selecting the appropriate button - _**Edit**_ or _**Delete**_.

Lastly, set the new rule file as active by selecting the new rule file on the right hand side window and selecting the _**Set as active**_ button. You will see the **√** mark next to it to indicate it is active.

#### 3.5 Validation Rules 

**_Error Callbacks_**

This Rules section is to simulate asynchronous error callbacks.

The setup and functionality is similar to [3.4 Sync Response Rules](#34-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under **Building your own Rules File**

![Validation Rules Screen](/assets/images/validation-rules-screen.png)

#### 3.6 Callback Rules

**_Success Callbacks_**

This Rules section is to simulate asynchronous success callbacks.

The same applies for this section, the functionality is similar to [3.4 Sync Response Rules](#34-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under **Building your own Rules File**

![Callback Rules Screen](/assets/images/callback-rules-screen.png)

#### 3.7 Outbound Request

This sections will enable you to intiate requests from the testing toolkit to your DFSP implementation.
User can create a collection of operations and add a number of assertions to these operations. The assertions can be setup and customized to the your testing requirements and verify both positive and negative requests and responses. 

Selecting the _**Outbound Request**_ navigation tab on the left side, the following will open in the main display window. 

![Outbound display opening](/assets/images/Outbound-Display-Opening.png)

At the top of the screen, you will notice the following buttons on the main window, starting from the left.

- Import Template
- New Template
- Show Template
- Save
- Send

By selecting the _**Import Template**_ button, it will allow you to import your own template. Sample templates are available in the [test-case](/examples/test-cases) sub directory for you to explore. On the file explorer window that pop up if you select the _**Import Template**_ button, navigate to the _/examples_ and sub directory _/test-case_ within the main project directory. Select the ```dfsp_tests.json``` file. This sample file consist of a couple of tests samples. Open the file to import into the **Mojaloop Testing Toolkit** application.

![Import Template](/assets/images/Import-Template.png)

The sample template contains, among others, the following operations as samples;

_**P2P Transfer Happy Path**_

  - **get/parties/{Type}/{ID}** - Get party information

  - **post/quotes** - Get quote

  - **post/transfers** - Send transfer

![Opened Imported Template](/assets/images/Opened-Imported-Template.png)

It is possible to update the _**Input Values**_ on the right hand side window. Additional input values can be added, by selecting the _**Add Input Value**_ button on the top right of this right hand side window. These values are like global environment variables those you can refer in any request in any test case you create.

![Add Additional Input Values](/assets/images/Add-Additional-Input-Values.png)

The process is straight forward. Provide a name for the new input value and click on the _Add_ button.

![Add New Input Variable](/assets/images/Add-New-Input-Variable.png)

The new variable will be added to the _**Input Values**_. To add a value, simply type a value in the box. It will then be available for use. You can allso update any existing value by simply selecting the value and replacing it with the new value.

![Add New Input Value](/assets/images/Add-New-Input-Value.png)

___out of date starts here

The window on the left contains the _Template_ with the _Test Cases_ and operations. 

![Template Window](/assets/images/Template-Window.png)

Click on the _**Edit**_ button, to open up the _**Test Case**_ in the edit mode.

![Test-Case Editor](/assets/images/Test-Case-Editor.png)

The **Request** tab reflects both the appropriate _Header_ and _Body_ that makes up the request as per the API swagger definition. These values can be changed in the **Editor** tab.

![Sample Request](/assets/images/Sample-Request.png)

The **Editor** tab displays request content and it can be altered on this window. Depending on how the request was defined, you will be able to see the selected API, the operations, the Header and body Content. Options to _Duplicate_, _Delete_ or _Rename_ are also available as buttons above. You can also build your own new request by selecting the _Add New Request_ button on the top right. The process is building a new request is similar to the one explained in [Sync Response Rules](#34-sync-response-rules)

![Sample Request](/assets/images/Sample-Editor.png)

The **Test** tab contains the assertions that was setup. These are similar to PostMan tests and will evaluate the request and/or the response based on the requirements of the assertion. The below is an assertion from the sample _Template File_ imported earlier, is validation the callback and expect the _**status**_ to be equal to _**202**_.

![Sample Test Assertion](/assets/images/Sample-Test-Assertion.png)

To create a new assertion, you can either add to an existing one, or choise to setup a new assertion. After naming the new assertion, the steps are the same in both cases. We will only cover the basic in this document.

To create a new assertion, select the _**Add New Assertion**_ button on the top right. Provide an appropriate name and click on the _**Add**_ button.

![Add New Assertion](/assets/images/Add-New-Assertion.png) 

The new assertion will be available at the bottom of the existing assertions. You have the option to _Rename_ or _Delete_ the assertion - as are the case with any of the current assertions.

Navigate to the newly create assertion, and click on the arrow on the left of it to expane. 

![New Empty Assertion](/assets/images/New-Empty-Assertion.png) 

Include a new expectation by selecting the _**Add Expectation**_ button at the bottom left. This will launch the Expectation window. Selecting the box will provide you with the option to either select a synchronous response or a callback to be assessed.

![Assess Request or Response](/assets/images/Assess-Request-or-Response.png)

We have opted for the __Response__. Next select the field to be assessed - __Status__ was selected for this demo. 

![Assess Response Status](/assets/images/Assess-Response-Status.png)

Select the equation from the middle box. We have opted for __Not Equal to__.

![Assess Response Equation](/assets/images/Assess-Response-Equation.png)

Add the required value in the last box and click on the _**Save**_ button. Congratulations - you have successfully created an assertion. 

![Assess Response Equation Save](/assets/images/Assess-Response-Equation-Save.png)

It is also possible to compare the values from input values or the parameters from the request. Select the _**Configurable Parameter**_ button at the bottom right with bring up the __Configurable Parameter__ window. Click on the box to provide the dropdown list of possible options. We have selected __Input Values__ for this demo.

![Configurable Parameter](/assets/images/Configurable-Parameter.png)

Click on the box below that one to list the options to select from. We have chosen __currency__ for this demo.

![Configurable Parameter Currency](/assets/images/Configurable-Parameter-Currency.png)

The __Configurable Parameter__ ```{$inputs.currency}``` is now available for use with the option to __Copy to clipboard__ or __Insert into editor__.

To get a better understanding of how this will work, please have a look at the below. This assertion is part of the samples provided. This assertion contains 2 expectations. You will notice it is possible to refer to the previous operation ```prev.2.callback.body``` and compare the current operation ```request.body```. So yes, it can become very technical, and would be better explained in a separate document to cover this subject on assertions.

![Configurable Parameter Assertion](/assets/images/Configurable-Parameter-Assertion.png)

Finally we can execute the __Test Cases__. Please insure you have setup added a user with {MSISDN} with a value found in the Input Values on the simulator. Select the _**Send**_ button on the right top.

![Sending Test Cases](/assets/images/Sending-Test-Cases.png)

If you select the _**Edit**_ button now, you will notice the addition of the response tab. Select that to view all the responses for the operation.

![View Response](/assets/images/View-Response.png)

#### 3.8 Settings

The _**SETTINGS**_ navigation tab will open to the following view. This is the default view of this page.

![Opening Default Settings](/assets/images/Opening-Default-Settings.png)

The _**SETTINGS**_ window consist of the following to windows;

On the left _**Runtime Global Configuration**_ displays the actual configuration that is in effect in the testing toolkit service.

On the right _**Edit Global Configuration**_ amounts a couple of other options, it allows you to edit the values manually.
If you want your own values other than the values from environment you should disable the option _**Override with Environment Variable**_.
In docker mode the environment values can be passed with a provided _local.env_ file.

![Override with Environment Variable](/assets/images/Override-with-Environment-Variable.png)

### 4. Connection Manager

To incorporate security and authenticity validation the **Mojaloop Connection Manager** can be activated as part of the **Mojaloop Testing Toolkit**. This will allow the incorporation of TLS validations as part of the process.

#### 4.1 TLS on local Docker

This section will guide you in the required configuration updates to enable running with TLS enabled in a local docker container environment.

The following configurations on the local file system. Remember to save the files when the config is completed.

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

![Local Enabled Mutual TLS](/assets/images/Local_Mutual_TLS_Enabled.png)

- [/simulator/scheme-adapter.env](/simulator/scheme-adapter.env) file, make the following update;
  
  - Update _INBOUND_MUTUAL_TLS_ENABLED_ to **true**,
  
  - Update _OUTBOUND_MUTUAL_TLS_ENABLED_ to **true**.

```
INBOUND_MUTUAL_TLS_ENABLED=true
OUTBOUND_MUTUAL_TLS_ENABLED=true
```

![Adapter Enabled Mutual TLS](/assets/images/Adapter_Mutual_TLS_Enabled.png)
		
The TLS certificates and key have already been pre generated and populated for use in docker. For information purposes ,the configuration and location are defined in the file content as per the below image. 

![TLS Certificates and Key](/assets/images/TLS_Certs_Keys.png)

The current configuration caters for a local setup within a docker container. 

Current setup for **Mojaloop Simulator** pointing to _scheme-adapter_ as part of the docker containers.

![Simulator Pointing to Scheme-adapter](/assets/images/Simulator-Scheme-adapter-endpoint.png)

Current setup for **Mojaloop Testing- Toolkit** pointing to _mojaloop-testing-toolkit_ as part of the docker containers.
 
![ML Testing Toolkit Pointing to mojaloop-testing-toolkit](/assets/images/Testing-Toolkit -Mojaloop-Testing-Toolkit-endpoint.png)

#### 4.2 Enabling TLS Verification

As we have made updates to the configuration files for both **Mojaloop Simulator** and **Mojaloop Testing Toolkit**, we will need to restart both docker containers. In the appropriate terminal windows for the 2 applications, stop the docker containers by pressing **Ctrl + C** simultaneously on the keyboard in each terminal window. This actions should "Gracefully stop" the respective docker containers. To insure all the docker containers are in fact down, run the following command in the respective terminal windows.

```
docker-compose down
```  

You should still verify that all containers are down by running the below. There shouldn't be any active docker containers.

```
docker-compose ps
```

You should see the following on the respective terminal windows

```
Name   Command   State   Ports
------------------------------
```

To enable the integration with **Mojaloop Connection Manager**, you will need to open a new terminal window to bring up the **Mojaloop Connection Manage** docker container. The **Mojaloop Connection Manager** is part of the **Mojaloop Testing Toolkit** download, and you can just navigate to the respective folder in the repository. Change directory into _/connection-manager_.

```
cd connection-manager
```

To start **Mojaloop Connection Manager** as part of the **Mojaloop Testing Toolkit**, the same command can be executed in the respective terminal window.

```
docker-compose up
```  

**Importanant Note**
The **Mojaloop Testing Toolkit** is a local docker images. If you pull the changes from git repository, you will need to rebuild the docker images before restarting **Mojaloop TestingToolkit**.

```
docker-compose build
```

Now the restart **Mojaloop Simulator** and **Mojaloop Testing Toolkit**, you can simply run the below command in the respective terminal windows. The containers will startup as per the initial instructions in the [README](/README.md) document.

```
docker-compose up
``` 

To start **Mojaloop Connection Manager** as part of the **Mojaloop Testing Toolkit**, the same command can be executed in the respective terminal window.

```
docker-compose up
```

To verify if you are running with TLS enabled, navigate to the _**Settings**_ on the right hand navigation plain and select _**Settings**_.

As per the initial configurations that was done on the _local.env_ files, you will notice on the _**Runtime Global Configuration**_ window on the right the following 3 settings;

- Callback URL starts with https://
- Enable Inbound Mutual TLS is |√|
- Enable Outbound Mutual TLS is |√|

![TLS Enabled on Environment](/assets/images/TLS-Enabled-on-Environment.png)


Once **Mojaloop Connection Manager** and all other services are running, you can open a browser and enter ```localhost:5060``` in the url. This will open the **Mojaloop Connection Manager UI**. You will be signed on as a _DFSP_ **dfsp1**, on a _**TESTING-TOOL**_ environment.

![Connection Manager UI Opening](/assets/images/Connection-Manager-UI-Opening.png)


#### 4.3 Connection Manager Certificates

Even though all the certificates for testing toolkit and simulator have been pre generated and placed in a folder and ready for use, some manual actions are required to enable these from a security perspective. Since the **Mojaloop Testing Toolkit** is simulating a HUB, we will only focus on the **Mojaloop Connect Manager** requirements from the DFSP perspective.

From the **Mojaloop Connect Manager** window, click on the _**TESTING-TOOL**_ environment button.

![MCM Environment Opening](/assets/images/MCM-Environment-Opening.png)

##### 4.3.1 Certificate Authorities

On the navigational tab on the left, navigate to _Certificates_ and select _Certificate Authorities_. Under the _DFSP Certificate Authority_ tab in the _Root Certificate_ box, click on _choice a file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_client_cacert.pem``` file. 

![dfsp_client_cacert](/assets/images/dfsp_client_cacert.png)

##### 4.3.2 TSL Client Certificates

Still under _Certificates_ on the navigational tab on the left, select _TSL Client Certificates_. Under the _CSR_ tab in the _CSR_ box, click on the _choice a file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_client.csr``` file. On submission of this CSR, the testing toolkit will automaticallly sign this and the signed certificate will be available in the _Sent CSR_ tab. Under normal circumstances, you can download this client certificate and provide it to your DFSP implementation. But for this demo, it is already place in the simulator/tls folder for convinience.

![dfsp_client](/assets/images/dfsp_client.png)

Click on the _|√|Submit_ button to send the file to the HUB signing.

![dfsp_client Submit](/assets/images/dfsp_client-submit.png)

Now select the _Unprocessed Hub CSRs_ tab. Under normal circumstances, we will download the CSR file and sign it with our CA  by clicking on the _Download CSR_ button. For the dempo as we already have the signed hub certificate in the folder, this is not necessary, and you can click on the _Upload Certificate_ button on the right of the main window. Navigate to ```/simulator/secrets/tls/``` and select ```hub_client_cert.pem``` file.

![hub_client_cert](/assets/images/hub_client_cert.png)

##### 4.3.3 TLS Server Certificates

Still under _Certificates_ on the navigational tab on the left, select _TSL Server Certificates_. Under the _DFSP Server certificates_ tab in the _Server certificate_ box, click on the _choice a file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_server_cert.pem``` file.

![dfsp_server_cert](/assets/images/dfsp_server_cert.png)

Under the _DFSP Server certificates_ tab in the _Root certificate_ box, click on the _choice a file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_server_cacert.pem``` file.

![dfsp_server_cacert](/assets/images/dfsp_server_cacert.png)

Click on the _|√|Submit_ button

![Server certificates submitted](/assets/images/Server-certificates-submitted.png)

To do a quick verification if everything is still functioning as expected, you can repeat the simulator test done in 3.3 [Monitoring](#33-monitoring).

#### 4.4 Alternative Setups

It is also possible for **Mojaloop Testing Toolkit** to function outside of a local docker environment, enabling more advance integration testing and verifications between a Mojaloop Switch and testing DFSP before going live. 

To familiarize yourself with the process, you can create your own TLS certificate. Script files are provided to speed up the process to generate these certificates for both the **Mojaloop Simulator** and **Mojaloop Testing Toolkit**. 

- **Mojaloop Simulator** the file path /simulator/secrets/tls/createSecrets.sh
- **Mojaloop Testing Toolkit** the file path /secrets/tls/createSecrets.sh

Please be aware should you setup on another environment , some variables will need to be updated like DNS or IP address of the server.

We will be covering the setting up and activation of the certificates in more depth in a separate document. This will including the actions required on **Mojaloop Connection Manager** interface.
