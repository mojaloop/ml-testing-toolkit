OUTPUT_DIR="."
setopt +o nomatch

rm -f *.key *.pem *.csr *.crt *.old *.attr

## Generating Server CA certificate
openssl req -x509 -config openssl-serverca.cnf -newkey rsa:4096 -sha256 -nodes -out dfsp_server_cacert.pem -outform PEM

## Generate server csr
openssl req -config openssl-server.cnf -newkey rsa:4096 -sha256 -nodes -out dfsp_server.csr -outform PEM

## Sign server cert
openssl ca -config openssl-serverca.cnf -policy signing_policy -extensions signing_req -out dfsp_server_cert.pem -infiles dfsp_server.csr

#####################

## Generating Client CA certificate
openssl req -x509 -config openssl-clientca.cnf -newkey rsa:4096 -sha256 -nodes -out dfsp_client_cacert.pem -outform PEM

## Generate client csr
openssl req -config openssl-client.cnf -newkey rsa:4096 -sha256 -nodes -out dfsp_client.csr -outform PEM


# Sign the hub client csr with clientca
# openssl ca -config openssl-clientca.cnf -policy signing_policy -extensions signing_req -out hub_client_cert.pem -infiles hub_client.csr


