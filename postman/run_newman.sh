sed -i -e 's/localhost/host.docker.internal/g' mojaloop-pdp-testing-tool.postman_environment.json
newman run --delay-request=10  --environment='mojaloop-pdp-testing-tool.postman_environment.json' 'mojaloop-pdp-testing-tool.postman_collection.json'
