#openssl genrsa -des3 -out privatekey.pem 2048
openssl genrsa -out privatekey.pem 2048
openssl req -new -x509 -key privatekey.pem -out publickey.cer -days 1825 -subj "/CN=testingtoolkitdfsp/C=US/ST=Ohio/L=Columbus/O=Testing Toolkit/OU=Payments"
#openssl rsa -in privatekey.pem -pubout -out publickey.cer
#openssl rsa -in privatekey.pem -out privatekey.pem
