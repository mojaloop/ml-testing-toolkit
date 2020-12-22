# Users Guide Mojaloop Testing Toolkit

## _Mojaloop Testing Toolkit_

**Table of Contents**

0. [User Guide](/documents/User-Guide.md)

1. [At first glance](#1-at-first-glance)

2. [Welcome Page](#2-welcome-page)

3. [Monitoring](#3-monitoring)

4. [Sync Response Rules](#4-sync-response-rules)

    4.1 [Building your own Rules File](#41-building-your-own-rules-file)

5. [Validation Rules (_Error Callbacks_)](#5-validation-rules)

6. [Callback Rules (_Success Callbacks_)](#6-callback-rules)

7. [Outbound Request](#7-outbound-request)

    7.1 [Collection Manager](#71-collection-manager)

    7.2 [Import Environment](#72-import-environment)

    7.3 [Test Cases](#73-test-cases)

      7.3.1 [Request](#731-request)

      7.3.2 [Test Editor](#732-editor)

      7.3.3 [Test Scripts](#733-scripts)

      7.3.4 [Tests](#734-tests)

    7.4 [Download Report](#74-download-report)

    7.5 [New Template](#75-new-template)

    7.6 [Show Template](#76-dhow-template)

    7.7 [Save](#77-save)

    7.7 [Send](#77-send)

8. [Settings](#8-settings)

### 1 At first glance

When you open the **Mojaloop Testing Toolkit** in your browser, you will be welcomed by the Dashboard display. Currently this is still under development, and only display "static data". The current static display will provide you with a fair representations of the intentional Dashboard functionality.

![Opening view](/assets/images/opening-view.png)

Take note of the navigation bar on the left. The navigational items are;

- **Welcome Page**
- **Monitoring**
- **Sync Response Rules**
- **Validation Rules (Error Callbacks)**
- **Callback Rules (Success Callbacks)**
- **Outbound Request**
- **Settings**

We will work through each one of the items and provide you with a fair understanding of the current functionality.

### 2 Welcome Page

The _Welcome page_ is the default opening window.

![Opening view](/assets/images/opening-view.png)

### 3 Monitoring

The _Monitoring_ navigation tab allows you to monitor _incoming_ and _outgoing_ requests to / from the **Testing Toolkit**.

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

### 4 Sync Response Rules

**_Validation and synchronous response based on the schema of the code_**

The _Sync Response Rules_ navigation tab on the left of the **Mojaloop Testing Toolset** allow you the setup fixed or mock responses. Take note of the _default.json_ file on the right hand side window. That contains the list of operations and sample content for mock or fixed responses for the operations listed on the center window. These can be tested by running the collection in Postman. (Import the [collection](/postman/mojaloop-pdp-testing-tool.postman_collection.json) and [environment](/postman/mojaloop-pdp-testing-tool.postman_environment.json) files into Postman testing tool.)

![Opening  Sync Response Rules](/assets/images/opening-sync-response-rules.png)

Below is a sample **MOCK_RESPONSE**

![Sample - Mock Response](/assets/images/mock-response-sample.png)

Below is a sample **FIXED_RESPONSE**

![Sample - Fixed Response](/assets/images/fixed-response-sample.png)

#### 4.1 Building your own Rules File

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

You have the option to enable or disable inbound requests scripts. You can use Scripts tab to set dfsp positions and do validations later. In the given example we are updating the ttkdfspTotalAmount if the transfer request is successfull for testingtoolkit dfsp. You could execute p2p-happy-path with fromFspId equal to testingtoolkitdfsp and go back to Environment tab to see the total amount.

![Inbound Requests Scripts](/assets/images/inbound-requests-scripts.png)

In the Environment tab you could observe the current environment state. 

![Inbound Requests Environment](/assets/images/inbound-requests-environment.png)

You have the option to include one or more **CONDITIONS** for the new rule. Select the _**Add Condition**_ button should you wish to add an additional condition to your rule. 

![Add Condition Button](/assets/images/add-condition-button.png)

You will be presented with 4 boxes each with a dropdown list to select from;

- _**Fact Type**_
- _**Fact**_
- _**Operation**_
- _**Value**_

For each of the above mentioned items, click on the down arrow in the item box to list the selection options to select from. These selection options are as per the Swagger definition for the selected **API** above.

![Sample Condition](/assets/images/sample-condition.png)

You can use configurable param in Value field. You can select one by clicking on **Add Configuration Params** button. 

![Sample Condition add configurable params](/assets/images/sample-condition-add-configurable-params.png) 

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

### 5 Validation Rules 

_**Error Callbacks**_

This Rules section is to simulate asynchronous error callbacks.

The setup and functionality is similar to [4 Sync Response Rules](#24-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under [4.1 Building your own Rules File](#241-building-your-own-rules-file).

![Validation Rules Screen](/assets/images/validation-rules-screen.png)

### 6 Callback Rules

_**Success Callbacks**_

This Rules section is to simulate asynchronous success callbacks.

The same applies for this section, the functionality is similar to [4 Sync Response Rules](#4-sync-response-rules) with the ability to create your own Rules file. This has already been explained in the previous section under [4.1 Building your own Rules File](#41-building-your-own-rules-file).

![Callback Rules Screen](/assets/images/callback-rules-screen.png)

### 7 Outbound Request

This sections will enable you to intiate requests from the testing toolkit to your DFSP / HUB implementations.

The user can create a collection of operations and add a number of assertions to these operations. The assertions can be setup and customized to support your testing requirements and verify both positive and negative requests and responses. 

Selecting the _**Outbound Request**_ navigation tab on the left side, the following will open in the main display window. 

![Outbound display opening](/assets/images/outbound-display-opening.png)

At the top of the screen, you will notice the following buttons on the main window, starting from the left.

- _**Collections Manager**_
- _**Load Sample**_
- _**Show Current Template**_
- _**Iteration Runner**_
- _**Send**_

You can see two tabs _'Test Cases'_ and _'Input Values'_. 

![Template Window](/assets/images/template-window.png)

#### 7.1 Collection Manager

By selecting the _**Collection Manager**_ button, it will open a drawer on left which contains a number of file operations. That will allow you to import, export and modify a collection. For your exploration, sample collections are available under the project root directory under [/examples/collections](/examples/collections) sub directory. To select one of the sample files, on the file explorer window that poped up when you selected the _**Import File**_ button, navigate to [/examples/collections/dfsp](/examples/collections/dfsp) under the project root directory. Select the ```p2p_happy_path.json``` file to import into the **Mojaloop Testing Toolkit** application. You should select the file in the collection manager, and observe the test cases should be loaded in the main screen. You could add more test cases by clicking on _Add Test Case_ button

![Collection Manager](/assets/images/import-template.png)

_**P2P Transfer Happy Path**_

  - **get/parties/{Type}/{ID}** - Get party information

  - **post/quotes** - Get quote

  - **post/transfers** - Send transfer

![Opened Imported Template](/assets/images/opened-imported-template.png)

#### 7.2 Import Environment
By selecting the _**Import Environment**_ button in _Input Values_ tab, it will allow you to import input values. For your exploration, sample environments are available under the project root directory under [/examples/environments](/examples/environments) sub directory. To select one of the sample files, on the file explorer window that poped up when you selected the _**Import Environment**_ button, navigate to [/examples/environments](/examples/environments) under the project root directory. Select the ```dfsp_local_environment.json``` file to import into the **Mojaloop Testing Toolkit** application. This sample file consist of a couple of input values.

It is possible to update the **Input Values** on the right hand side window. Additional input values can be added, by selecting the _**Add Input Value**_ button on the top right of this right hand side window. These values relates to the specified variable that you can select and use in any **Request** that you create.

![Add Additional Input Values](/assets/images/add-additional-input-values.png)

The process is straight forward. Provide a name for the new input value and click on the _**Add**_ button.

![Add New Input Variable](/assets/images/add-new-input-variable.png)

To update values of exisiting variable(s) to the **Input Values**, simply select the value next to the variable and type in a new value. It will then be available for use in the test cases imported earlier.

![Add New Input Value](/assets/images/add-new-input-value.png)

#### 7.3 Test Cases

Click on the _**Edit**_ button, to open up the _**Test Case**_ in the edit mode.

![Test-Case Editor](/assets/images/test-case-editor.png)

##### 7.3.1 Request

The **Request** tab reflects both the appropriate _Header_ and _Body_ that makes up the request as per the selected **API** swagger specification. These values can be changed in the **Editor** tab.

![Sample Request](/assets/images/sample-request.png)

##### 7.3.2 Editor

The **Editor** tab displays request content and it can be updated manually on this window. Depending on how the request was defined, you will be able to see the selected **API**, the _operationId_, the _Header_ and _Body_ content. Options to _**Duplicate**_, _**Delete**_ or _**Rename**_ are also available as buttons above. There are some additional options like _Override with Custom URL_ or _Ignore Callbacks_. You can also build your own new request by selecting the _**Add New Request**_ button on the top right of this window. The process to build a new request is similar to the one explained in [2.4 Sync Response Rules](#24-sync-response-rules)

![Sample Scripts](/assets/images/sample-editor.png)

##### 7.3.3 Scripts

The **Scripts** tab allows you to use postman like pre request and test scripts. Make sure that advanced features options is enabled.

You can write scripts in two formats.

- **Postman Script:**

  If you select postman script option, you can use the same functions like pm.sendRequest as in postman. This option is usefull when you want to convert your existing postman tests to testing toolkit format.
  - pm.test - not supported - Use Testing Toolkit Tests for this purpose. In **Tests** You could use values stored in the environment. To access thoes values use environment.'key'
  - pm.response - to get the response object outside pm.sendRequest use pm.response.body not pm.response.json()
  - everything else should work the same way is in postman

- **Java Script:**

  If you want advanced features and flexibility, you can select javascript option. This option enables you to write the scripts in javascript format and you can use the following functions.
  - **console.log** - function
  - **response** - variable
  - **environment** - variable
  - **axios** - library
    
    With axios library, you can use various functions like axios.get, axios.post...etc. Please note these functions are async functions and you may need to use `await` before the function.
    ```
    const resp = await axios.get('http://someurl')
    ```
    You can find the documentation about axios at this link https://github.com/axios/axios#axios-api
  - **websocket** - library

    With websocket library, you can connect to a websocket server and get the first message from the server.

    Functions supported:
    
    - _**websocket.connect**_ - To connect to a websocket URL and listen for messsages
    - _**websocket.getMessage**_ - To get the message arrived. This function can also wait for the message some time. The session will be disconnected automatically after returning the message
    - _**websocket.disconnect**_ - To disconnect a particular session
    - _**websocket.disconnectAll**_ - To disconnect all the sessions
    
    This will be used to assert on the payee side data from the sdk-scheme-adapter in tests cases. You may need to enable websocket capabilities in the sdk-scheme-adapter.
    
    **Examaple:**

    In Pre-request
    ```
    await websocket.connect('ws://localhost:4002/requests/{$inputs.toIdValue}', 'payeeRequest')
    ```
    In Post-request
    ```
    environment.payeeRequest = await websocket.getMessage('payeeRequest')
    ```
    Then you can use the above environment variable in assertions.
    ```
    environment.payeeRequest.headers['content-type']
    ```
  - **custom.setRequestTimeout** - To set a specific timeout value for the request in milli seconds (Default: 3000ms)
  - **custom.sleep** - To wait for particular amount of milli seconds
  - **custom.jws** - library

    With custom.jws library, you can sign and validate an FSPIOP request using JWS

    Functions supported:
    
    - _**custom.jws.signRequest**(<PRIVATE_KEY>)_ - To sign the outgoing request using the private key
    - _**custom.jws.validateCallback**(<callback.headers>, <callback.body>, <PUBLIC_CERTIFICATE>)_ - To validate the incoming callback using public certificate. This will validate protected headers too.
    - _**custom.jws.validateCallbackProtectedHeaders**(<callback.headers>)_ - To validate only protected headers in the FSPIOP-Signature header


![Sample Pre Request and Post Request Scripts](/assets/images/test-case-editor-scripts.png)

After executing the test case you will see _Console Log_ and _Environment State_ as well.

- _Console Log_

![Sample Scripts - Console Log](/assets/images/test-case-editor-console-log.png)

- _Environment State_

![Sample Scripts - Environment State](/assets/images/test-case-editor-environment-state.png)


##### 7.3.4 Tests

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

#### 7.4 Download Report

You could download a report in several formats by clicking on _Download Report_ in the top right corner:
- JSON
- HTML
- Printer Friendly HTML

![Download Report](/assets/images/download-report.png)

#### 7.5 New Template

You could create a new template by clicking on _New Template_ button the top right corner

#### 7.6 Show Template

You could view the template by clicking on _Show Template_ button in the top right corner

#### 7.7 Save

You could save the collection or the environment by clicking on _Save_ button in the top right corner

#### 7.8 Send

You could execute the whole template by clicking on _Send_ button in the top right corner. Please insure you added a user with {MSISDN} and value found in the **Input Values** on the simulator (see [Frequently Asked Questions](/documents/Mojaloop-Testing-Toolkit.md#4-frequently-asked-questions) section [4.2 Generic ID not found](/documents/Mojaloop-Testing-Toolkit.md#42-eneric-id-not-found)). 
(/documents/Mojaloop-Testing-Toolkit.md#7-architecture)

![Sending Test Cases](/assets/images/sending-test-cases.png)

- Select the aditional options and _**Send this test case**_ button on the right top.

![Sending Test Cases](/assets/images/sending-single-test-case-1.png)

- Select _**Edit**_ and then the _**Send**_ button on the right top.

![Sending Test Cases](/assets/images/sending-single-test-case-2.png)

If you select the _**Edit**_ button now, you will notice the addition of the response tab. Select that to view all the responses for the operation.

![View Response](/assets/images/view-response.png)

### 8 Settings

The _**SETTINGS**_ navigation tab will open to the **SETTINGS** window. Below is the default view of this page.

![Opening Default Settings](/assets/images/opening-default-settings.png)

- The **SETTINGS** window consist of the following two windows;
  - On the left **Runtime Global Configuration** displays the actual configuration that is effectively active by the **Mojaloop Testing Toolkit** service.
  - On the right **Edit Global Configuration** amongst a couple of other options, it allows you to edit the values manually. Should you elect to use other environment values you can disable the default values by selecting the _**Override with Environment Variable**_ option.

- In a default docker deployment, the environment values will be provided in the _local.env_ file in the project root directory.

![Override with Environment Variable](/assets/images/override-with-environment-variable.png)
