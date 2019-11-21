sed -i -e 's/localhost/host.docker.internal/g' Mojaloop-PDP-Testing-Tool.postman_environment.json
newman run --delay-request=10  --environment='Mojaloop-PDP-Testing-Tool.postman_environment.json' 'Mojaloop-PDP-Testing-Tool.postman_collection.json'
