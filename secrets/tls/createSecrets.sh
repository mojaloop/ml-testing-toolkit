OUTPUT_DIR="."

rm *.key *.pem *.csr *.crt *.srl

## Generating Server CA certificate
openssl genrsa -out "$OUTPUT_DIR/hub_server_cakey.key" 4096
openssl req -new -sha256 -config openssl.conf -nodes -x509 -days 10000 -extensions v3_ca -key "$OUTPUT_DIR/hub_server_cakey.key" -out "$OUTPUT_DIR/hub_server_cacert.pem" -subj '/CN=hubserverca/C=US/ST=Ohio/L=Columbus/O=Hub Server CA/OU=Payments'

## Generate server key
openssl genrsa -out "$OUTPUT_DIR/hub_server_key.key" 4096

## Generate server csr
openssl req -new -sha256 -config openssl.conf -key hub_server_cakey.key -subj "/C=US/ST=CA/O=Hub Server/CN=mojaloop-testing-toolkit" -out hub_server.csr

## Sign server cert
openssl x509 -req -days 3650 -sha256 -extfile openssl.conf -extensions v3_req -in hub_server.csr -signkey hub_server_key.key  -CA hub_server_cacert.pem -CAkey hub_server_cakey.key -CAcreateserial -out hub_server_cert.pem

## Generating Client CA certificate
openssl genrsa -out "$OUTPUT_DIR/hub_client_cakey.key" 4096
openssl req -new -sha256 -config openssl.conf -nodes -x509 -days 10000 -extensions v3_ca -key "$OUTPUT_DIR/hub_client_cakey.key" -out "$OUTPUT_DIR/hub_client_cacert.pem" -subj '/CN=hubclientca/C=US/ST=Ohio/L=Columbus/O=Hub Client CA/OU=Payments'

## Generate client key
openssl genrsa -out "$OUTPUT_DIR/hub_client_key.key" 4096

## Generate client csr
openssl req -new -sha256 -key hub_client_key.key -out "$OUTPUT_DIR/hub_client.csr" -subj '/CN=hubclient/C=US/ST=Ohio/L=Columbus/O=Hub Client/OU=Payments/emailAddress=admin@hubclient.com'


#openssl x509 -in hub_server_cert.pem -text -noout