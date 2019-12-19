# Mojaloop Self Testing Toolkit

A self testing tool to test the mojaloop implementations

## Prerequisite
The following softwares should be installed on your system to run the toolkit.

* Git
* Docker (Preferred way)
* NodeJS (Not required if you choose to run locally)
* Postman
* Newman (optional)

## Start the Mock Server
To run the server run the following commands

### Download the repository
```
git clone https://github.com/mojaloop/ml-self-testing-toolkit.git
cd ml-self-testing-toolkit
```

### Running locally
```bash
npm install
npm start
```

### Running in docker (preferred)
```bash
docker-compose up
```

The server will start and listen on port 5000. And you can get the web interface on http://localhost:5050/ui

## Sending Test Requests
Once the server is started on a perticular port, you can send api requests from the sample postman collection included in this repository or from your own DFSP implementation to validate the requests.

* **postman/mojaloop-pdp-testing-tool.postman_collection.json** - Import this file as a collection in the postman.
* **postman/mojaloop-pdp-testing-tool.postman_environment.json** - Import this file as environment in postman.

In postman, you can run the whole collection using the *"Runner"* button at the top.
