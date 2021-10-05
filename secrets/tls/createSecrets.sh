OUTPUT_DIR="."
setopt +o nomatch
rm *.key *.pem *.csr *.crt *.srl

## Generating Server CA certificate
openssl req -x509 -config openssl-serverca.cnf -newkey rsa:4096 -sha256 -nodes -out hub_server_cacert.pem -outform PEM

## Generate server csr
openssl req -config openssl-server.cnf -newkey rsa:4096 -sha256 -nodes -out hub_server.csr -outform PEM

## Sign server cert
openssl ca -config openssl-serverca.cnf -policy signing_policy -extensions signing_req -out hub_server_cert.pem -infiles hub_server.csr

#####################

## Generating Client CA certificate
openssl req -x509 -config openssl-clientca.cnf -newkey rsa:4096 -sha256 -nodes -out hub_client_cacert.pem -outform PEM

## Generate client csr
openssl req -config openssl-client.cnf -newkey rsa:4096 -sha256 -nodes -out hub_client.csr -outform PEM
