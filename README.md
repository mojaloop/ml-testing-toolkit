Mojaloop Self Testing Tooolkit
==============================

A self testing tool to test the mojaloop implementations.

Table of Contents
=================


  - [Running the toolkit](#running-the-toolkit)
    - [With Docker (Preferred way)](#with-docker)
    - [Running locally](#running-locally)
  - [Ports](#ports)
  - [Testing](#testing)
    - [With Postman](#with-postman)
    - [With Mojaloop Simulator](#with-mojaloop-simulator)
  - [Rules Engine](#rules)

## Running the toolkit

### With Docker

This is the easiest way to run the self testing toolkit.

The following softwares should be installed on your system to run the toolkit.

* Git
* Docker

Please execute the following lines to run the tool.

```bash
git clone https://github.com/mojaloop/ml-self-testing-toolkit
cd ml-self-testing-toolkit
docker-compose up
```

### Running locally

The following softwares should be installed on your system to run the toolkit.

* Git
* NodeJS
  
Please execute the following lines to run the tool.

```
git clone https://github.com/mojaloop/ml-self-testing-toolkit.git
cd ml-self-testing-toolkit
npm install
npm start
```

## Ports

The server will start and listen on port 5000. You can send the mojaloop api requests to this port number.

And you can get the web interface on http://localhost:5050/

## Testing

### With Postman

Once the server is started on a particular port, you can send api requests from the sample postman collection included in this repository to test the basic functionalities like schema validation and version negotiation.

* Install the postman tool
* **postman/mojaloop-pdp-testing-tool.postman_environment.json** - Import this file as environment in postman.
* **postman/mojaloop-pdp-testing-tool.postman_collection.json** - Import this file as a collection in the postman.
* Run this whole collection using the *"Runner"* button at the top.

### With Mojaloop Simulator

If you want to test the tool for the whole functionality like schema validation, additional validation and callback generation ..etc, you can initiate a transfer cycle from mojaloop simulator UI.

Please follow the below steps.

* Download the mojaloop-simulator repository
* Download the mojaloop-simulator-ui
* Configure the scheme adapter to point the PEER_ENDPOINT to the host running the self testing toolkit on 5000 port
* Run the mojaloop-simulator & scheme adapter using docker-compose script in mojaloop-simulator repository
* Run the mojaloop simulator UI
* Access the simulator UI from web browser
* Run the self testing toolkit and access the toolkit UI on 5050 port
* Send transfer from Oubound section
* Observe the logs in tookit UI


Mojaloop Simulator
```
git clone https://github.com/mojaloop/mojaloop-simulator.git
cd mojaloop-simulator/src
vi scheme-adapter.env (Change the PEER_ENDPOINT value to http://localhost:5000)
docker-compose up
```

Simulator UI
```
git clone https://github.com/modusbox/mojaloop-simulator-ui.git
cd mojaloop-simulator-ui
docker-compose up
```

Self Testing Toolkit
```
git clone https://github.com/mojaloop/ml-self-testing-toolkit
cd ml-self-testing-toolkit
docker-compose up
```

Open the following URLs in your browser and send a transfer from simulator and observe the toolkit logs in web frontend.

* http://localhost:5050
* http://localhost


### Rules

After you can send a successful transfer from mojaloop simulator, please observe the validation rules and callback generation rules in the front-end.

You can follow the following documentation and change the rules as per your needs.

[Rules Documentation](RULES_ENGINE.md)

****If you have your own DFSP implementation you can point the peer endpoint to self testing toolkit on port 5000 and try to send requests from your implementation instead of using mojaloop-simulator.**