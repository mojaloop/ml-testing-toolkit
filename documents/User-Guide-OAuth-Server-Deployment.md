# Users Guide

## _OAuth Server Installation & Configuration (Hosted mode only)_

### Introduction

The intention of this document is to provide a basic user guide to the **install and configure an oAuth server and configure for the testing toolkit**. .

To use **Hosting Capability** in the testing toolkit a scheme / hub should provide their oAuth server details in the toolkit for providing user authentication in the toolkit web UI and connection manager UI. Generally schemes / hub might already have their own oAuth server. This guide is just incase if they want to implement it from scratch or to have a reference about flow.

We are using an open source oAuth server called **Keycloak**. Keycloak is "Open Source Identity and Access Management" software and the documentation can be found at https://www.keycloak.org/


**Table of Contents**

1. [Deploy Keycloak Server](#1-deploy-keycloak-server)

2. [Configure the KeyCloak Server](#2-configure-the-keycloak-server)

    2.1 [Login to the admin console](#21-login-to-the-admin-console)

    2.2 [Create a Realm](#22-create-a-realm)

    2.3 [Create a Client](#23-create-a-client)

    2.4 [Change some Client settings](#24-change-some-client-settings)
  
    2.5 [Create Groups](#25-create-groups)
  
    2.6 [Create Hub User](#26-create-hub-user)
  
    2.7 [Create DFSP User](#27-create-dfsp-user)

3. [Obtain the required details from KeyCloak Server](#3-obtain-the-required-details-from-keycloak-server)

    3.1 [Get the Client ID and Secret](#31-get-the-client-id-and-secret)
  
    3.2 [Get the Public Key for decoding the Access Token](#32-get-the-public-key-for-decoding-the-access-token)

4. [Configure the Testing Toolkit](#4-configure-the-testing-toolkit)

    4.1 [Enable oAuth authentication](#41-enable-oauth-authentication)

5. [Configure the Connection Manager](#5-configure-the-connection-manager)

    5.1 [Enable oAuth authentication in Connection Manager](#51-enable-oauth-authentication-in-connection-manager)


### 1. Deploy Keycloak Server

There are many ways to deploy Keycloak. Here we are using docker method to run this service easily.

Just execute the following command to run the service

```
docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin quay.io/keycloak/keycloak:10.0.2
```

For additional documentation please refer https://www.keycloak.org/getting-started/getting-started-docker

### 2. Configure the KeyCloak Server

#### 2.1 Login to the admin console

Open the URL http://localhost:8080/auth/admin and login with username 'admin' and password 'admin' (You can change these values in the command we used for start the server)

#### 2.2 Create a Realm

* Hover the mouse over the dropdown in the top-left corner where it says Master, then click on Add realm

* Fill in the form with the following values:

  ```
  Name: testingtoolkit
  ```
* Click Create

#### 2.3 Create a Client

* Click Clients (left-hand menu)

* Click Create (top-right corner of table)

* Fill in the form with the following values:
  ```
  Client ID : ttk
  Client Protocol : openid-connect
  ```

#### 2.4 Change some Client settings

* Click Clients (left-hand menu)

* Click on the new client (ttk)

* Change the following values in Settings tab:
  ```
  Access Type : confidential
  Service Accounts Enabled : ON
  Authorization Enabled: ON
  Valid Redirect URIs: Any random URI for now
  Fine Grain OpenID Connect Configuration -> Access Token Signature Algorithm: RS256
  Fine Grain OpenID Connect Configuration -> ID Token Signature Algorithm: RS256
  ```

* Create the following entries in the Mappers tab:

  | Name | Mapper Type | Properties | Add to ID token | Add to Access token |
  | --- | --- | --- | --- | --- | --- |
  | dfspId | User Attribute | User Attribute: __dfspId__ <br /> Token Claim Name: __dfspId__ <br /> Claim JSON Type: __String__ | ON | ON |
  | aud | Audience | Included Client Audience : __ttk__ <br /> Included Custom Audience: __aud__ |
  | Groups | Group Membership | Token Claim Name: __groups__ <br /> Full group path: __OFF__ | ON | ON |

#### 2.5 Create Groups

* Click Groups (left-hand menu)

* Click New (top-right corner of table)

* Create the following groups:

  ```
  Application/DFSP:dfsp1
  Application/MTA
  Application/PTSA
  Internal/everyone
  ```

#### 2.6 Create Hub User

* Click Users (left-hand menu)

* Click Add user (top-right corner of table)

* Fill in the form with the following values:
  ```
  Username: hub
  First Name: Hub
  Last Name: User
  User Enabled: ON
  Email Verified: OFF
  ```

* Click on the tab "Attributes" and add the following
  ```
  Key: dfspId
  Value: hub
  ```

* Click on the tab "Credentials" and create the password
  ```
  Password: <Some password for the Hub>
  Password Confirmation: <Some password for the Hub>
  Temporary: OFF
  ```

* Click on the tab "Groups" and join the following groups
  ```
  Application/PTA
  Internal/everyone
  ```

#### 2.7 Create DFSP User

* Click Users (left-hand menu)

* Click Add user (top-right corner of table)

* Fill in the form with the following values:
  ```
  Username: user1
  First Name: User
  Last Name: One
  User Enabled: ON
  Email Verified: OFF
  ```

* Click on the tab "Attributes" and add the following
  ```
  Key: dfspId
  Value: dfsp1
  ```

* Click on the tab "Credentials" and create the password
  ```
  Password: <Some password for User1>
  Password Confirmation: <Some password for User1>
  Temporary: OFF
  ```

* Click on the tab "Groups" and join the following groups
  ```
  Application/DFSP:dfsp1
  Application/MTA
  Internal/everyone
  ```

### 3. Obtain the required details from KeyCloak Server

#### 3.1 Get the Client ID and Secret

* Click Clients (left-hand menu)

* Click on the client 'ttk' in the table

* Note down the __Client ID__

* Click on the tab 'Credentials' and note down the __Secret__

#### 3.2 Get the Public Key for decoding the Access Token

* Click Realm Settings (left-hand menu)

* Click on the tab 'Keys'

* Click on the '__Public Key__' of RS256 Algorithm and note down the key


### 4. Configure the Testing Toolkit

#### 4.1 Enable oAuth authentication

* Change the system_config.json file with the following values
  ```
  "HOSTING_ENABLED": true,
  "OAUTH": {
    "AUTH_ENABLED": true,
    "APP_OAUTH_CLIENT_KEY": "ttk",
    "APP_OAUTH_CLIENT_SECRET": "<CLIENT_SECRET>",
    "MTA_ROLE": "Application/MTA",
    "PTA_ROLE": "Application/PTA",
    "EVERYONE_ROLE": "Internal/everyone",
    "OAUTH2_TOKEN_ISS": "http://<KEYCLOAK_HOST>:8080/auth/realms/testingtoolkit",
    "OAUTH2_ISSUER": "http://<KEYCLOAK_HOST>:8080/auth/realms/testingtoolkit/protocol/openid-connect/token",
    "JWT_COOKIE_NAME": "TTK-API_ACCESS_TOKEN",
    "EMBEDDED_CERTIFICATE": "-----BEGIN PUBLIC KEY-----\n<PUBLIC_KEY_COPIED_FROM_KEYCLOAK>\n-----END PUBLIC KEY-----"
  }
  ```

* Change the following values of the service mojaloop-testing-toolkit-ui in _'docker-compose.yml'_
  ```
    environment:
      - API_BASE_URL=http://localhost:5050
      - AUTH_ENABLED=TRUE
  ```

### 5. Configure the Connection Manager

#### 5.1 Enable oAuth authentication in Connection Manager

* Change the environment variables of the service 'connection-manager-api' in the _'connection-manager/docker-compose.yml'_
  ```
  environment:
    DATABASE_HOST: connection-manager-db
    DATABASE_PORT: 3306
    DATABASE_USER: mcm
    DATABASE_PASSWORD: mcm
    DATABASE_SCHEMA: mcm
    MYSQL_ROOT_PASSWORD: <MYSQL_PASSWORD>
    PORT: 5061
    P12_PASS_PHRASE: 'SOME_S3C4R3_P@SS'
    OAUTH2_ISSUER: http://<KEYCLOAK_HOST>:8080/auth/realms/testingtoolkit/protocol/openid-connect/token
    OAUTH2_TOKEN_ISS: http://<KEYCLOAK_HOST>:8080/auth/realms/testingtoolkit
    AUTH_ENABLED: 'TRUE'
    APP_OAUTH_CLIENT_KEY: ttk
    MTA_ROLE: 'Application/MTA'
    PTA_ROLE: 'Application/PTA'
    EVERYONE_ROLE: 'Internal/everyone'
    APP_OAUTH_CLIENT_SECRET: <CLIENT_SECRET>
    EMBEDDED_CERTIFICATE: |-
      -----BEGIN PUBLIC KEY-----
      <PUBLIC_KEY_COPIED_FROM_KEYCLOAK>
      -----END PUBLIC KEY-----
  ```

* Change the environment variables of the service 'connection-manager-ui' in the _'connection-manager/docker-compose.yml'_
  ```
    environment:
      - API_BASE_URL=http://localhost:5050
      - AUTH_ENABLED=TRUE
  ```


Now you can login with the username user1 in both testing toolkit UI and connection manager UI