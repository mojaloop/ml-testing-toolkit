# Users Guide Connection Manager

## _Mojaloop Testing Toolkit_

To incorporate security and authenticity validations between the testing DFSP and the _Mojaloop Switch_, the **Mojaloop Connection Manager** can be activated to integrate with the **Mojaloop Testing Toolkit**. This will allow the incorporation of TLS and JWS Certificates and Key validations as part of the process.

**Table of Contents**

0. [User Guide](/documents/User-Guide.md)

1. [Configure TLS](#11-configure-tls)

2. [Configure JWS](#2-configure-jws)

3. [Enabling TLS and JWS Verification](#3-enabling-tls-and-jws-cerification)

4. [Connection Manager Keys and Certificates](#4-connection-manager-keys-and-certificates)

    4.1 [Certificate Authorities](#41-certificate-authorities)

    4.2 [TSL Client Certificates](#42-tls-client-certificates)

    4.3 [TLS Server Certificates](#43-tls-server-certificates)

    4.4 [JWS Certificates](#44-jws-certificates)

5. [Alternative Set-ups](#5-alternative-set-ups)

### 1 Configure TLS

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

### 2 Configure JWS

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

### 3 Enabling TLS and JWS Verification

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


### 4 Connection Manager Keys and Certificates

Even though all the certificates for **Mojaloop Testing Toolkit** and **Mojaloop Simulator** have been pre-generated and placed in a folder, ready for use, some manual actions are required to enable the integration with **Mojaloop Connection Manager**. The sample demostration within this document, demostrates **Mojaloop Testing Toolkit** as the testing DFSP and interfacing with the **Mojaloop Simulator** simulating the _Mojaloop Switch_. **Mojaloop Connect Manager** set-up is from the DFSP perspective.

From the **Mojaloop Connect Manager** window, click on the _**TESTING-TOOL**_ environment button.

![MCM Environment Opening](/assets/images/mcm-environment-opening.png)

#### 4.1 Certificate Authorities

On the navigational tab on the left, navigate to _Certificates_ and select _Certificate Authorities_. Under the _DFSP Certificate Authority_ tab in the _Root Certificate_ box, click on _Choose file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_client_cacert.pem``` file. 

![dfsp_client_cacert](/assets/images/dfsp-client-cacert.png)

#### 4.2 TLS Client Certificates

Still under _Certificates_ on the navigational tab on the left, select _TLS Client Certificates_. Under the _CSR_ tab in the _CSR_ box, click on the _choose file_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_client.csr``` file. On submission of this CSR, the testing toolkit will automaticallly sign this and the signed certificate will be available in the _Sent CSR_ tab. Under normal circumstances, you can download this client certificate and provide it to your DFSP implementation. But for this demo, it is already placed in the simulator/tls folder for convinience.

![dfsp_client](/assets/images/dfsp-client.png)

Click on the _**√ Submit**_ button to send the file to the HUB signing.

![dfsp_client Submit](/assets/images/dfsp-client-submit.png)

Now select the _Unprocessed Hub CSRs_ tab. Under normal circumstances, we will download the CSR file and sign it with our _Certificate Authority (CA)_  by clicking on the _Download CSR_ button. For the demo as we already have the signed hub certificate in the folder, this is not necessary, and you can click on the _Upload Certificate_ button on the right of the main window. Navigate to ```/simulator/secrets/tls/``` and select ```hub_client_cert.pem``` file.

![hub_client_cert](/assets/images/hub-client-cert.png)

#### 4.3 TLS Server Certificates

Still under _Certificates_ on the navigational tab on the left, select _TSL Server Certificates_. Under the _DFSP Server certificates_ tab in the _Server certificate_ box, click on the _Choice File_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_server_cert.pem``` file.

![dfsp_server_cert](/assets/images/dfsp-server-cert.png)

Under the _DFSP Server certificates_ tab in the _Root certificate_ box, click on the _Choose File_ button. Navigate to ```/simulator/secrets/tls/``` and select ```dfsp_server_cacert.pem``` file.

![dfsp_server_cacert](/assets/images/dfsp-server-cacert.png)

Click on the _**√ Submit**_ button

![Server certificates submitted](/assets/images/server-certificates-submitted.png)

To do a quick verification that everything is still functioning as expected, you can repeat the simulator test done in 3.3 [Monitoring]( #3-monitoring).

#### 4.4 JWS Certificates

Still under _Certificates_ on the navigational tab on the left, select _JWS Certificates_. Under the _DFSP JWS Certificates_ tab in the _JWS Certificate_ box, click on the _Choose File_ button. Navigate to ```/simulator/secrets/jws/``` and select ```publickey.cer``` file.

![JWS Certificate](/assets/images/jws-certificate.png)

Click on the _**√ Submit**_ button to upload the JWS Public Key Certificate.

![dfsp_client Submit](/assets/images/jws-certificate-submit.png)


### 5 Alternative Set-ups

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
