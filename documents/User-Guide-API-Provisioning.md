# Mojaloop Testing Toolkit

## _API Provisioning_

**Table of Contents**

1. [Overview](#1-overview)

2. [Synchronous API](#2-synchronous-api)

3. [Asynchronous API](#3-asynchronous-api)

4. [Provisioning through UI](#4-api-provisioning-through-ui)

5. [Prefix and Hostnames](#5-prefix-and-hostnames)


## 1. Overview

The Testing Toolkit is highly configurable and any API can be provisioned into TTK easily. 
TTK supports two kinds of APIs

* Synchronous API
* Asynchronous API

## 2. Synchronous API

You just need to provide the **Swagger / OpenAPI** specification file of your synchronous API to the TTK.

- Please copy the specification file in yaml format into the following folder
  ```
  spec_files/<your-api-folder-name>/api_spec.yaml
  ```
- Add a new entry to the property **API_DEFINITIONS** in _spec_files/system_config.json_
  ```
  {
    "type": "<your-api-name>",
    "version": "<major_version.minor_version",
    "folderPath": "<your-api-folder-name>"
  }
  ```
- Restart the testing toolkit service and that's it. You are all set.

You should be able to send your API requests to TTK and the TTK will validate them against the specification. You can monitor them in the TTK UI.

And also you can go ahead to create your own response rules to get customized responses from TTK through TTK UI.

## 3. Asynchronous API

You should follow the same procedure as Synchronous API and some additional steps are there to provision an Asynchronous API.

- Please copy the specification file in yaml format into the following file
  ```
  spec_files/<your-api-folder-name>/api_spec.yaml
  ```
- Add a new entry to the property **API_DEFINITIONS** in _spec_files/system_config.json_. Please observe the additional _asynchronous_ flag here.
  ```
  {
    "type": "<your-api-name>",
    "version": "<major_version.minor_version",
    "folderPath": "<your-api-folder-name>",
    "asynchronous": true
  }
  ```
- Additionally you should provide some information about callback mappings to associate the asynchronous callbacks to the respective requests. You can add that information into the following file. You can refer the sample files provided for FSPIOP api in the repository.
  ```
  spec_files/<your-api-folder-name>/callback_map.json
  ```
- Restart the testing toolkit service and that's it. You are all set.

You should be able to send your API requests to TTK and the TTK will validate them against the specification. You can monitor them in the TTK UI.

And also you can go ahead to create your own validation rules, callback rules and response rules to get customized / mock callbacks and responses from TTK through TTK UI.

## 4. Provisioning through UI

![Opening API Management](/assets/images/api-provisioning-menu-item.png)

- You can go to _**API Management**_ navigation tab. Below is the default view of this API Management page.

  ![API Management Default View](/assets/images/api-provisioning-list-apis-view.png)

- Click on **Add new API** button, a popup window will be opened and you should drag / select your API specification yaml file there.

  ![API Management File Input Window](/assets/images/api-provisioning-file-input-window.png)

- After your file is been processed and validated by TTK, you can find the information about your API in the window. You can verify the details and change the name and other details populated there.

  ![API Management Add New API Confirmation](/assets/images/api-provisioning-add-new-api-confirmation.png)

## 5. Prefix and Hostnames

We can also add a `prefix` to a provisioned API. For example if the API consists of a resource called `/pets`, we can configure a prefix for the pets api like `prefix: "/api"` in `system_config.json` file.
Then the TTK accepts inbound requests on `/api/pets` instead of `/pets`.

This is useful when two provisioned APIs have a common resource. Then we can clearly specify how TTK should work for the inbound requests on that common resource.

In the same way we can also specify `hostnames` for an API. Then TTK selects the API based on the matching `hostname` of the inbound request. For example you can configure the hostname `127.0.0.1` for an API, then all that API will be selected only when the hostname of the inbound request in `127.0.0.1`. It doesn't match the inbound requests with the hostname `localhost`.

Example configuration section of `system_config.json` file.
```
"API_DEFINITIONS": [
  {
    "type": "example-api-1",
    "version": "1.0",
    "folderPath": "example-api-1",
    "hostnames": [],
    "prefix": "api1"
  },
  {
    "type": "example-api-2",
    "version": "1.0",
    "folderPath": "example-api-2",
    "hostnames": [
      "example2.localhost.localdomain"
    ]
  }
}
```