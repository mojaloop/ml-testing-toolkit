DATA='{
    "displayName": "Jimmy",
    "firstName": "James",
    "middleName": "J",
    "lastName": "Murphy",
    "dateOfBirth": "1970-01-01",
    "idType": "MSISDN",
    "idValue": "27713803912"
}'

docker ps --format {{.Ports}} --filter ancestor=mojaloop/mojaloop-simulator:v11.2.1 |awk -F',' '{print $2}' |awk -F'->' '{print $1}' |awk -F ':' '{print $2}' |xargs -I{} curl -w '\n' -i -X POST -H 'content-type: application/json' localhost:{}/repository/parties --data "${DATA}"