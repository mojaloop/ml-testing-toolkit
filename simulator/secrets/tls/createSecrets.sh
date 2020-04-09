OUTPUT_DIR="."

rm *.key *.pem *.csr *.crt *.srl


## Generating Server CA certificate
openssl genrsa -out "$OUTPUT_DIR/dfsp_server_cakey.key" 4096
openssl req -new -sha256 -config openssl.conf -nodes -x509 -days 10000 -extensions v3_ca -key "$OUTPUT_DIR/dfsp_server_cakey.key" -out "$OUTPUT_DIR/dfsp_server_cacert.pem" -subj '/CN=dfspserverca/C=US/ST=Ohio/L=Columbus/O=DFSP Server CA/OU=Payments'

## Generate server key
openssl genrsa -out "$OUTPUT_DIR/dfsp_server_key.key" 4096

## Generate server csr
openssl req -new -sha256 -config openssl.conf -key dfsp_server_cakey.key -subj "/C=US/ST=CA/O=DFSP Server/CN=localhost" -out dfsp_server.csr

## Sign server cert
openssl x509 -req -days 3650 -sha256 -extfile openssl.conf -extensions v3_req -in dfsp_server.csr -signkey dfsp_server_key.key -CA dfsp_server_cacert.pem -CAkey dfsp_server_cakey.key -CAcreateserial -out dfsp_server_cert.pem

## Generating Client CA certificate
openssl genrsa -out "$OUTPUT_DIR/dfsp_client_cakey.key" 4096
openssl req -new -sha256 -config openssl.conf -nodes -x509 -days 10000 -extensions v3_ca -key "$OUTPUT_DIR/dfsp_client_cakey.key" -out "$OUTPUT_DIR/dfsp_client_cacert.pem" -subj '/CN=dfspclientca/C=US/ST=Ohio/L=Columbus/O=DFSP Client CA/OU=Payments'

## Generate client key
openssl genrsa -out "$OUTPUT_DIR/dfsp_client_key.key" 4096

## Generate client csr
openssl req -new -sha256 -key dfsp_client_key.key -out "$OUTPUT_DIR/dfsp_client.csr" -subj '/CN=dfspclient/C=US/ST=Ohio/L=Columbus/O=DFSP Client/OU=Payments/emailAddress=admin@userdfsp.com'

# Sign the hub client csr with clientca
# openssl x509 -req -days 3650 -sha256 -in hub_client.csr -CA dfsp_client_cacert.pem -CAkey dfsp_client_cakey.key -CAcreateserial -out hub_client_cert.pem





## Generating CA certificate
#openssl genrsa -out rootCA.key 2048
#openssl req -new -sha256 -key rootCA.key -nodes -out rootCA.csr -config ca_openssl.conf -subj '/CN=userdfspca/C=US/ST=Ohio/L=Columbus/O=User DFSP CA/OU=Payments'
#openssl x509 -req -days 3650 -extfile ca_openssl.conf -extensions v3_ca -in rootCA.csr -signkey rootCA.key -out rootCA.pem

#openssl req -new -config ca_openssl.conf -nodes -x509 -days 10000 -extensions v3_ca -keyout "$OUTPUT_DIR/clientcakey.pem" -out "$OUTPUT_DIR/clientcacert.pem" -subj '/CN=userdfspclientca/C=US/ST=Ohio/L=Columbus/O=User DFSP Client CA/OU=Payments'
#openssl req -new -config ca_openssl.conf -nodes -x509 -days 10000 -extensions v3_ca -keyout "$OUTPUT_DIR/servercakey.pem" -out "$OUTPUT_DIR/servercacert.pem" -subj '/CN=userdfspserverca/C=US/ST=Ohio/L=Columbus/O=User DFSP Server CA/OU=Payments'


## Generate client key
#openssl genrsa -out "$OUTPUT_DIR/clientkey.pem" 4096

## Generate client certificate signing request
#openssl req -new -key "$OUTPUT_DIR/clientkey.pem" -out "$OUTPUT_DIR/clientcsr.pem" -subj '/CN=userdfspclient/C=US/ST=Ohio/L=Columbus/O=User DFSP Client/OU=Payments/emailAddress=admin@userdfsp.com'




