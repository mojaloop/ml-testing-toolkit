# Hosted Mode with "Docker Compose" (Without JWS and mTLS)

## _Mojaloop Testing Toolkit_

**Table of Contents**

1. [Introduction](#1-introduction)

2. [Installation](#2-installation)

3. [Creating a group and user for new DFSP](#3-creating-a-group-and-user-for-new-dfsp)

4. [Login into TTK UI](#4-login-into-ttk-ui)

5. [Sending a Transfer](#4-sending-a-transfer)


## 1. Introduction

TTK can be deployed in hosted mode using the docker-compose file provided in the TTK repository. In this method, DFSP can not use mTLS and JWS to communicate with TTK.

![Hosted Mode Docker-Compose](/assets/images/hosted-mode-docker-compose-intro.png)

## 2. Installation

* Clone the TTK repository
* Run the following commands

```bash
git clone https://github.com/mojaloop/ml-testing-toolkit
cd ml-testing-toolkit/docker/hosted-mode
docker-compose up
```

You should see the following services up and running.
* TTK backend service
* TTK frontend service
* MongoDB for storing details like rules, settings, logs and history per DFSP
* Keycloak Server for authentication by DFSPs

After all the services up and running, the following setup steps are needed for a typical scenario.
* [Hub User] Create a group for a new DFSP (Ex: dfsp1)
* [Hub User] Create a user from the new DFSP and assign the corresponding group (Ex: user1)
* [Hub User] Provide the user credentials to DFSP
* DFSP will login to the TTK UI using the credentials
* DFSP gets the token configuration from settings page
* DFSP will provision the token details in his implementation
* DFSP can send a transfer to TTK (DFSP) and monitor the requests in monitoring page


## 3. Creating a group and user for new DFSP

For creating an account for DFSP, we need to use keycloak admin web interface.

* Open the keycloak web interface on http://<Host>:8080
* Go to “Administration Console”
* Login with username “admin” and password “admin” (These default values can be configured using environment values in docker-compose file)

### Creating a group for a new DFSP

* Goto groups in the menu
* Click on “New” button at the right
* Enter the group name in the format /Application/DFSP:dfspName
Where you should replace the string “dfspName” with your DFSP ID
* Save the group

### Creating new user for DFSP

* Goto users in the menu
* Click on “Add User”
* Enter the username as “user1” and click on “Save”
* Goto “Credentials” tab and set the password. Disable “Temporary” checkbox.
* Goto “Groups” tab and join the following groups
  * /Application/DFSP:<dfspName>
  * /Application/MTA
  * /Internal/everyone
* Goto “Attributes” tab and add an attribute the name ‘dfspId’ and value ‘<dfspName>’

That’s it, now a DFSP has been created and also we created a user. Provide the user credentials to DFSP so that they can login in the TTK UI.

## 4. Login into TTK UI

Now a DFSP (user) can login into TTK UI for configuring user settings like callback endpoints and for getting token information.

* Open the TTK UI with URL http://IP:6060
* Login with the credentials provided by scheme
* Goto **“Settings”** page
* Set the callback endpoint to point to the DFSP’s IP address and port where the service is running

SDK-scheme-adapter and payment manager uses **“OAuth 2.0 Client Credentials Grant”** flow to get the access token periodically from the oAuth server.
If the DFSP is using payment manager or sdk-scheme-adapter for their implementation, the token information is available on the setting page.

* Click on the **“Token Info”** button
* The details like “client_id”, “client_secret” and “token_endpoint” will be displayed on the popup window
* DFSP can provide the details in his implementation (sdk-scheme-adapter / payment manager)
* If the DFSP wants to test requests temporarily with a http client / postman, a temporary access token can be generated  by clicking on the button **“Generate a Static Token”**. Typically the token expires in one hour.
* DFSP needs to include the generated token in the **“Authorization”** header as “Bearer TOKEN”

## 5. Sending a Transfer


After configuring the callback endpoint(s) in TTK and token information in DFSP implementation, a DFSP can send a transfer to TTK.

Before sending a transfer, open the monitoring page in TTK UI. All the inbound requests from DFSP implementation and the callbacks generated and sent by TTK will be shown on the monitoring page.

We can expand relevant entries here and see the logs, content of the requests and callbacks including header information.

TTK validates the schema of all the inbound requests and shows if there are any validation failures.

If there are other issues with the parameters in the mojaloop requests, the transfer will fail and DFSP can analyze the problem with the help of logs, entries in the monitoring page.
