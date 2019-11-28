
> ml-self-testing-toolkit@1.0.1 dev /Users/vijay/Work/mojaloop/pdp_testing_tool/ml-self-testing-toolkit
> nodemon src/index.js

[33m[nodemon] 1.19.4[39m
[33m[nodemon] to restart at any time, enter `rs`[39m
[33m[nodemon] watching dir(s): *.*[39m
[33m[nodemon] watching extensions: js,mjs,json[39m
[32m[nodemon] starting `node src/index.js`[39m
Server running on Vijays-MacBook-Pro.local:3000
[2019-11-28T12:51:23.912Z]  INFO: ml-self-testing-toolkit/42624 on Vijays-MacBook-Pro.local: Request: Method: post Path: /quotes Query: {}
    request: {
      "headers": {
        "accept": "application/vnd.interoperability.quotes+json;version=1",
        "date": "Wed, 06 Nov 2019 12:45:50 GMT",
        "fspiop-source": "payerfsp",
        "fspiop-destination": "payeefsp",
        "user-agent": "PostmanRuntime/7.20.1",
        "cache-control": "no-cache",
        "postman-token": "c6ce3a4d-2390-4aa3-a028-57584438dc8e",
        "host": "localhost:3000",
        "accept-encoding": "gzip, deflate",
        "content-length": "791",
        "connection": "keep-alive"
      }
    }
[2019-11-28T12:51:23.921Z]  INFO: ml-self-testing-toolkit/42624 on Vijays-MacBook-Pro.local: Response: {"errorInformation":{"errorCode":"3100","errorDescription":"should have required property 'content-type'","extensionList":[{"key":"keyword","value":"required"},{"key":"dataPath","value":".header"},{"key":"missingProperty","value":"content-type"}]}} Status: 400
    response: {
      "headers": {
        "app": {},
        "headers": {},
        "plugins": {},
        "request": {
          "_allowInternals": false,
          "_core": {
            "root": {
              "_core": "[Circular]",
              "app": {},
              "auth": {},
              "decorations": {
                "handler": [],
                "request": [],
                "server": [],
                "toolkit": []
              },
              "events": {
                "_eventListeners": {
                  "log": {
                    "handlers": null,
                    "flags": {
                      "name": "log",
                      "channels": [
                        "app",
                        "internal"
                      ],
                      "tags": true
                    }
                  },
                  "request": {
                    "handlers": [
                      {
                        "name": "request",
                        "filter": {
                          "tags": [
                            "implementation"
                          ]
                        }
                      }
                    ],
                    "flags": {
                      "name": "request",
                      "channels": [
                        "app",
                        "internal",
                        "error"
                      ],
                      "tags": true,
                      "spread": true
                    }
                  },
                  "response": {
                    "handlers": null,
                    "flags": {
                      "name": "response"
                    }
                  },
                  "route": {
                    "handlers": null,
                    "flags": {
                      "name": "route"
                    }
                  },
                  "start": {
                    "handlers": null,
                    "flags": {
                      "name": "start"
                    }
                  },
                  "stop": {
                    "handlers": null,
                    "flags": {
                      "name": "stop"
                    }
                  }
                },
                "_notificationsQueue": [],
                "_eventsProcessing": false,
                "_sourcePodiums": []
              },
              "info": {
                "created": 1574945481096,
                "started": 1574945481107,
                "host": "Vijays-MacBook-Pro.local",
                "port": 3000,
                "protocol": "http",
                "id": "Vijays-MacBook-Pro.local:42624:k3ipviq0",
                "uri": "http://Vijays-MacBook-Pro.local:3000",
                "address": "0.0.0.0"
              },
              "listener": {
                "_events": {
                  "connection": [
                    null,
                    null
                  ]
                },
                "_eventsCount": 4,
                "_connections": 1,
                "_handle": {
                  "reading": false,
                  "onread": null
                },
                "_usingWorkers": false,
                "_workers": [],
                "_unref": false,
                "allowHalfOpen": true,
                "pauseOnConnect": false,
                "httpAllowHalfOpen": false,
                "timeout": 120000,
                "keepAliveTimeout": 5000,
                "_pendingResponseData": 0,
                "maxHeadersCount": null,
                "headersTimeout": 40000,
                "_connectionKey": "4:0.0.0.0:3000"
              },
              "load": {
                "eventLoopDelay": 0,
                "heapUsed": 0,
                "rss": 0
              },
              "methods": {},
              "mime": {
                "_byType": {
                  "application/1d-interleaved-parityfec": {
                    "source": "iana",
                    "type": "application/1d-interleaved-parityfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/3gpdash-qoe-report+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/3gpdash-qoe-report+xml",
                    "extensions": []
                  },
                  "application/3gpp-ims+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/3gpp-ims+xml",
                    "extensions": []
                  },
                  "application/a2l": {
                    "source": "iana",
                    "type": "application/a2l",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/activemessage": {
                    "source": "iana",
                    "type": "application/activemessage",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/activity+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/activity+json",
                    "extensions": []
                  },
                  "application/alto-costmap+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-costmap+json",
                    "extensions": []
                  },
                  "application/alto-costmapfilter+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-costmapfilter+json",
                    "extensions": []
                  },
                  "application/alto-directory+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-directory+json",
                    "extensions": []
                  },
                  "application/alto-endpointcost+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-endpointcost+json",
                    "extensions": []
                  },
                  "application/alto-endpointcostparams+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-endpointcostparams+json",
                    "extensions": []
                  },
                  "application/alto-endpointprop+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-endpointprop+json",
                    "extensions": []
                  },
                  "application/alto-endpointpropparams+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-endpointpropparams+json",
                    "extensions": []
                  },
                  "application/alto-error+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-error+json",
                    "extensions": []
                  },
                  "application/alto-networkmap+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-networkmap+json",
                    "extensions": []
                  },
                  "application/alto-networkmapfilter+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/alto-networkmapfilter+json",
                    "extensions": []
                  },
                  "application/aml": {
                    "source": "iana",
                    "type": "application/aml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/andrew-inset": {
                    "source": "iana",
                    "extensions": [
                      "ez"
                    ],
                    "type": "application/andrew-inset",
                    "compressible": false
                  },
                  "application/applefile": {
                    "source": "iana",
                    "type": "application/applefile",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/applixware": {
                    "source": "apache",
                    "extensions": [
                      "aw"
                    ],
                    "type": "application/applixware",
                    "compressible": false
                  },
                  "application/atf": {
                    "source": "iana",
                    "type": "application/atf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/atfx": {
                    "source": "iana",
                    "type": "application/atfx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/atom+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "atom"
                    ],
                    "type": "application/atom+xml"
                  },
                  "application/atomcat+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "atomcat"
                    ],
                    "type": "application/atomcat+xml"
                  },
                  "application/atomdeleted+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/atomdeleted+xml",
                    "extensions": []
                  },
                  "application/atomicmail": {
                    "source": "iana",
                    "type": "application/atomicmail",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/atomsvc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "atomsvc"
                    ],
                    "type": "application/atomsvc+xml"
                  },
                  "application/atsc-dwd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/atsc-dwd+xml",
                    "extensions": []
                  },
                  "application/atsc-held+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/atsc-held+xml",
                    "extensions": []
                  },
                  "application/atsc-rsat+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/atsc-rsat+xml",
                    "extensions": []
                  },
                  "application/atxml": {
                    "source": "iana",
                    "type": "application/atxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/auth-policy+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/auth-policy+xml",
                    "extensions": []
                  },
                  "application/bacnet-xdd+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/bacnet-xdd+zip",
                    "extensions": []
                  },
                  "application/batch-smtp": {
                    "source": "iana",
                    "type": "application/batch-smtp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/bdoc": {
                    "compressible": false,
                    "extensions": [
                      "bdoc"
                    ],
                    "type": "application/bdoc",
                    "source": "mime-db"
                  },
                  "application/beep+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/beep+xml",
                    "extensions": []
                  },
                  "application/calendar+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/calendar+json",
                    "extensions": []
                  },
                  "application/calendar+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/calendar+xml",
                    "extensions": []
                  },
                  "application/call-completion": {
                    "source": "iana",
                    "type": "application/call-completion",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cals-1840": {
                    "source": "iana",
                    "type": "application/cals-1840",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cbor": {
                    "source": "iana",
                    "type": "application/cbor",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cccex": {
                    "source": "iana",
                    "type": "application/cccex",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/ccmp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/ccmp+xml",
                    "extensions": []
                  },
                  "application/ccxml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "ccxml"
                    ],
                    "type": "application/ccxml+xml"
                  },
                  "application/cdfx+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/cdfx+xml",
                    "extensions": []
                  },
                  "application/cdmi-capability": {
                    "source": "iana",
                    "extensions": [
                      "cdmia"
                    ],
                    "type": "application/cdmi-capability",
                    "compressible": false
                  },
                  "application/cdmi-container": {
                    "source": "iana",
                    "extensions": [
                      "cdmic"
                    ],
                    "type": "application/cdmi-container",
                    "compressible": false
                  },
                  "application/cdmi-domain": {
                    "source": "iana",
                    "extensions": [
                      "cdmid"
                    ],
                    "type": "application/cdmi-domain",
                    "compressible": false
                  },
                  "application/cdmi-object": {
                    "source": "iana",
                    "extensions": [
                      "cdmio"
                    ],
                    "type": "application/cdmi-object",
                    "compressible": false
                  },
                  "application/cdmi-queue": {
                    "source": "iana",
                    "extensions": [
                      "cdmiq"
                    ],
                    "type": "application/cdmi-queue",
                    "compressible": false
                  },
                  "application/cdni": {
                    "source": "iana",
                    "type": "application/cdni",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cea": {
                    "source": "iana",
                    "type": "application/cea",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cea-2018+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/cea-2018+xml",
                    "extensions": []
                  },
                  "application/cellml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/cellml+xml",
                    "extensions": []
                  },
                  "application/cfw": {
                    "source": "iana",
                    "type": "application/cfw",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/clue_info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/clue_info+xml",
                    "extensions": []
                  },
                  "application/cms": {
                    "source": "iana",
                    "type": "application/cms",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cnrp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/cnrp+xml",
                    "extensions": []
                  },
                  "application/coap-group+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/coap-group+json",
                    "extensions": []
                  },
                  "application/coap-payload": {
                    "source": "iana",
                    "type": "application/coap-payload",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/commonground": {
                    "source": "iana",
                    "type": "application/commonground",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/conference-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/conference-info+xml",
                    "extensions": []
                  },
                  "application/cose": {
                    "source": "iana",
                    "type": "application/cose",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cose-key": {
                    "source": "iana",
                    "type": "application/cose-key",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cose-key-set": {
                    "source": "iana",
                    "type": "application/cose-key-set",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cpl+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/cpl+xml",
                    "extensions": []
                  },
                  "application/csrattrs": {
                    "source": "iana",
                    "type": "application/csrattrs",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/csta+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/csta+xml",
                    "extensions": []
                  },
                  "application/cstadata+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/cstadata+xml",
                    "extensions": []
                  },
                  "application/csvm+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/csvm+json",
                    "extensions": []
                  },
                  "application/cu-seeme": {
                    "source": "apache",
                    "extensions": [
                      "cu"
                    ],
                    "type": "application/cu-seeme",
                    "compressible": false
                  },
                  "application/cwt": {
                    "source": "iana",
                    "type": "application/cwt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/cybercash": {
                    "source": "iana",
                    "type": "application/cybercash",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dart": {
                    "compressible": true,
                    "type": "application/dart",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "application/dash+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mpd"
                    ],
                    "type": "application/dash+xml"
                  },
                  "application/dashdelta": {
                    "source": "iana",
                    "type": "application/dashdelta",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/davmount+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "davmount"
                    ],
                    "type": "application/davmount+xml"
                  },
                  "application/dca-rft": {
                    "source": "iana",
                    "type": "application/dca-rft",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dcd": {
                    "source": "iana",
                    "type": "application/dcd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dec-dx": {
                    "source": "iana",
                    "type": "application/dec-dx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dialog-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/dialog-info+xml",
                    "extensions": []
                  },
                  "application/dicom": {
                    "source": "iana",
                    "type": "application/dicom",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dicom+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/dicom+json",
                    "extensions": []
                  },
                  "application/dicom+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/dicom+xml",
                    "extensions": []
                  },
                  "application/dii": {
                    "source": "iana",
                    "type": "application/dii",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dit": {
                    "source": "iana",
                    "type": "application/dit",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dns": {
                    "source": "iana",
                    "type": "application/dns",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/dns+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/dns+json",
                    "extensions": []
                  },
                  "application/dns-message": {
                    "source": "iana",
                    "type": "application/dns-message",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/docbook+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "dbk"
                    ],
                    "type": "application/docbook+xml"
                  },
                  "application/dskpp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/dskpp+xml",
                    "extensions": []
                  },
                  "application/dssc+der": {
                    "source": "iana",
                    "extensions": [
                      "dssc"
                    ],
                    "type": "application/dssc+der",
                    "compressible": false
                  },
                  "application/dssc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xdssc"
                    ],
                    "type": "application/dssc+xml"
                  },
                  "application/dvcs": {
                    "source": "iana",
                    "type": "application/dvcs",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/ecmascript": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "ecma",
                      "es"
                    ],
                    "type": "application/ecmascript"
                  },
                  "application/edi-consent": {
                    "source": "iana",
                    "type": "application/edi-consent",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/edi-x12": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/edi-x12",
                    "extensions": []
                  },
                  "application/edifact": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/edifact",
                    "extensions": []
                  },
                  "application/efi": {
                    "source": "iana",
                    "type": "application/efi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/emergencycalldata.comment+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emergencycalldata.comment+xml",
                    "extensions": []
                  },
                  "application/emergencycalldata.control+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emergencycalldata.control+xml",
                    "extensions": []
                  },
                  "application/emergencycalldata.deviceinfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emergencycalldata.deviceinfo+xml",
                    "extensions": []
                  },
                  "application/emergencycalldata.ecall.msd": {
                    "source": "iana",
                    "type": "application/emergencycalldata.ecall.msd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/emergencycalldata.providerinfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emergencycalldata.providerinfo+xml",
                    "extensions": []
                  },
                  "application/emergencycalldata.serviceinfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emergencycalldata.serviceinfo+xml",
                    "extensions": []
                  },
                  "application/emergencycalldata.subscriberinfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emergencycalldata.subscriberinfo+xml",
                    "extensions": []
                  },
                  "application/emergencycalldata.veds+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emergencycalldata.veds+xml",
                    "extensions": []
                  },
                  "application/emma+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "emma"
                    ],
                    "type": "application/emma+xml"
                  },
                  "application/emotionml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/emotionml+xml",
                    "extensions": []
                  },
                  "application/encaprtp": {
                    "source": "iana",
                    "type": "application/encaprtp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/epp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/epp+xml",
                    "extensions": []
                  },
                  "application/epub+zip": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "epub"
                    ],
                    "type": "application/epub+zip"
                  },
                  "application/eshop": {
                    "source": "iana",
                    "type": "application/eshop",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/exi": {
                    "source": "iana",
                    "extensions": [
                      "exi"
                    ],
                    "type": "application/exi",
                    "compressible": false
                  },
                  "application/expect-ct-report+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/expect-ct-report+json",
                    "extensions": []
                  },
                  "application/fastinfoset": {
                    "source": "iana",
                    "type": "application/fastinfoset",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/fastsoap": {
                    "source": "iana",
                    "type": "application/fastsoap",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/fdt+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/fdt+xml",
                    "extensions": []
                  },
                  "application/fhir+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/fhir+json",
                    "extensions": []
                  },
                  "application/fhir+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/fhir+xml",
                    "extensions": []
                  },
                  "application/fido.trusted-apps+json": {
                    "compressible": true,
                    "type": "application/fido.trusted-apps+json",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "application/fits": {
                    "source": "iana",
                    "type": "application/fits",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/flexfec": {
                    "source": "iana",
                    "type": "application/flexfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/font-sfnt": {
                    "source": "iana",
                    "type": "application/font-sfnt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/font-tdpfr": {
                    "source": "iana",
                    "extensions": [
                      "pfr"
                    ],
                    "type": "application/font-tdpfr",
                    "compressible": false
                  },
                  "application/font-woff": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/font-woff",
                    "extensions": []
                  },
                  "application/framework-attributes+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/framework-attributes+xml",
                    "extensions": []
                  },
                  "application/geo+json": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "geojson"
                    ],
                    "type": "application/geo+json"
                  },
                  "application/geo+json-seq": {
                    "source": "iana",
                    "type": "application/geo+json-seq",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/geopackage+sqlite3": {
                    "source": "iana",
                    "type": "application/geopackage+sqlite3",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/geoxacml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/geoxacml+xml",
                    "extensions": []
                  },
                  "application/gltf-buffer": {
                    "source": "iana",
                    "type": "application/gltf-buffer",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/gml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "gml"
                    ],
                    "type": "application/gml+xml"
                  },
                  "application/gpx+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "gpx"
                    ],
                    "type": "application/gpx+xml"
                  },
                  "application/gxf": {
                    "source": "apache",
                    "extensions": [
                      "gxf"
                    ],
                    "type": "application/gxf",
                    "compressible": false
                  },
                  "application/gzip": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "gz"
                    ],
                    "type": "application/gzip"
                  },
                  "application/h224": {
                    "source": "iana",
                    "type": "application/h224",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/held+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/held+xml",
                    "extensions": []
                  },
                  "application/hjson": {
                    "extensions": [
                      "hjson"
                    ],
                    "type": "application/hjson",
                    "source": "mime-db",
                    "compressible": false
                  },
                  "application/http": {
                    "source": "iana",
                    "type": "application/http",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/hyperstudio": {
                    "source": "iana",
                    "extensions": [
                      "stk"
                    ],
                    "type": "application/hyperstudio",
                    "compressible": false
                  },
                  "application/ibe-key-request+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/ibe-key-request+xml",
                    "extensions": []
                  },
                  "application/ibe-pkg-reply+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/ibe-pkg-reply+xml",
                    "extensions": []
                  },
                  "application/ibe-pp-data": {
                    "source": "iana",
                    "type": "application/ibe-pp-data",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/iges": {
                    "source": "iana",
                    "type": "application/iges",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/im-iscomposing+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/im-iscomposing+xml",
                    "extensions": []
                  },
                  "application/index": {
                    "source": "iana",
                    "type": "application/index",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/index.cmd": {
                    "source": "iana",
                    "type": "application/index.cmd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/index.obj": {
                    "source": "iana",
                    "type": "application/index.obj",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/index.response": {
                    "source": "iana",
                    "type": "application/index.response",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/index.vnd": {
                    "source": "iana",
                    "type": "application/index.vnd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/inkml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "ink",
                      "inkml"
                    ],
                    "type": "application/inkml+xml"
                  },
                  "application/iotp": {
                    "source": "iana",
                    "type": "application/iotp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/ipfix": {
                    "source": "iana",
                    "extensions": [
                      "ipfix"
                    ],
                    "type": "application/ipfix",
                    "compressible": false
                  },
                  "application/ipp": {
                    "source": "iana",
                    "type": "application/ipp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/isup": {
                    "source": "iana",
                    "type": "application/isup",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/its+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/its+xml",
                    "extensions": []
                  },
                  "application/java-archive": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "jar",
                      "war",
                      "ear"
                    ],
                    "type": "application/java-archive"
                  },
                  "application/java-serialized-object": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "ser"
                    ],
                    "type": "application/java-serialized-object"
                  },
                  "application/java-vm": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "class"
                    ],
                    "type": "application/java-vm"
                  },
                  "application/javascript": {
                    "source": "iana",
                    "charset": "UTF-8",
                    "compressible": true,
                    "extensions": [
                      "js",
                      "mjs"
                    ],
                    "type": "application/javascript"
                  },
                  "application/jf2feed+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/jf2feed+json",
                    "extensions": []
                  },
                  "application/jose": {
                    "source": "iana",
                    "type": "application/jose",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/jose+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/jose+json",
                    "extensions": []
                  },
                  "application/jrd+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/jrd+json",
                    "extensions": []
                  },
                  "application/json": {
                    "source": "iana",
                    "charset": "UTF-8",
                    "compressible": true,
                    "extensions": [
                      "json",
                      "map"
                    ],
                    "type": "application/json"
                  },
                  "application/json-patch+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/json-patch+json",
                    "extensions": []
                  },
                  "application/json-seq": {
                    "source": "iana",
                    "type": "application/json-seq",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/json5": {
                    "extensions": [
                      "json5"
                    ],
                    "type": "application/json5",
                    "source": "mime-db",
                    "compressible": false
                  },
                  "application/jsonml+json": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "jsonml"
                    ],
                    "type": "application/jsonml+json"
                  },
                  "application/jwk+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/jwk+json",
                    "extensions": []
                  },
                  "application/jwk-set+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/jwk-set+json",
                    "extensions": []
                  },
                  "application/jwt": {
                    "source": "iana",
                    "type": "application/jwt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/kpml-request+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/kpml-request+xml",
                    "extensions": []
                  },
                  "application/kpml-response+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/kpml-response+xml",
                    "extensions": []
                  },
                  "application/ld+json": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "jsonld"
                    ],
                    "type": "application/ld+json"
                  },
                  "application/lgr+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/lgr+xml",
                    "extensions": []
                  },
                  "application/link-format": {
                    "source": "iana",
                    "type": "application/link-format",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/load-control+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/load-control+xml",
                    "extensions": []
                  },
                  "application/lost+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "lostxml"
                    ],
                    "type": "application/lost+xml"
                  },
                  "application/lostsync+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/lostsync+xml",
                    "extensions": []
                  },
                  "application/lxf": {
                    "source": "iana",
                    "type": "application/lxf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mac-binhex40": {
                    "source": "iana",
                    "extensions": [
                      "hqx"
                    ],
                    "type": "application/mac-binhex40",
                    "compressible": false
                  },
                  "application/mac-compactpro": {
                    "source": "apache",
                    "extensions": [
                      "cpt"
                    ],
                    "type": "application/mac-compactpro",
                    "compressible": false
                  },
                  "application/macwriteii": {
                    "source": "iana",
                    "type": "application/macwriteii",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mads+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mads"
                    ],
                    "type": "application/mads+xml"
                  },
                  "application/manifest+json": {
                    "charset": "UTF-8",
                    "compressible": true,
                    "extensions": [
                      "webmanifest"
                    ],
                    "type": "application/manifest+json",
                    "source": "mime-db"
                  },
                  "application/marc": {
                    "source": "iana",
                    "extensions": [
                      "mrc"
                    ],
                    "type": "application/marc",
                    "compressible": false
                  },
                  "application/marcxml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mrcx"
                    ],
                    "type": "application/marcxml+xml"
                  },
                  "application/mathematica": {
                    "source": "iana",
                    "extensions": [
                      "ma",
                      "nb",
                      "mb"
                    ],
                    "type": "application/mathematica",
                    "compressible": false
                  },
                  "application/mathml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mathml"
                    ],
                    "type": "application/mathml+xml"
                  },
                  "application/mathml-content+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mathml-content+xml",
                    "extensions": []
                  },
                  "application/mathml-presentation+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mathml-presentation+xml",
                    "extensions": []
                  },
                  "application/mbms-associated-procedure-description+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-associated-procedure-description+xml",
                    "extensions": []
                  },
                  "application/mbms-deregister+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-deregister+xml",
                    "extensions": []
                  },
                  "application/mbms-envelope+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-envelope+xml",
                    "extensions": []
                  },
                  "application/mbms-msk+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-msk+xml",
                    "extensions": []
                  },
                  "application/mbms-msk-response+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-msk-response+xml",
                    "extensions": []
                  },
                  "application/mbms-protection-description+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-protection-description+xml",
                    "extensions": []
                  },
                  "application/mbms-reception-report+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-reception-report+xml",
                    "extensions": []
                  },
                  "application/mbms-register+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-register+xml",
                    "extensions": []
                  },
                  "application/mbms-register-response+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-register-response+xml",
                    "extensions": []
                  },
                  "application/mbms-schedule+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-schedule+xml",
                    "extensions": []
                  },
                  "application/mbms-user-service-description+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mbms-user-service-description+xml",
                    "extensions": []
                  },
                  "application/mbox": {
                    "source": "iana",
                    "extensions": [
                      "mbox"
                    ],
                    "type": "application/mbox",
                    "compressible": false
                  },
                  "application/media-policy-dataset+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/media-policy-dataset+xml",
                    "extensions": []
                  },
                  "application/media_control+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/media_control+xml",
                    "extensions": []
                  },
                  "application/mediaservercontrol+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mscml"
                    ],
                    "type": "application/mediaservercontrol+xml"
                  },
                  "application/merge-patch+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/merge-patch+json",
                    "extensions": []
                  },
                  "application/metalink+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "metalink"
                    ],
                    "type": "application/metalink+xml"
                  },
                  "application/metalink4+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "meta4"
                    ],
                    "type": "application/metalink4+xml"
                  },
                  "application/mets+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mets"
                    ],
                    "type": "application/mets+xml"
                  },
                  "application/mf4": {
                    "source": "iana",
                    "type": "application/mf4",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mikey": {
                    "source": "iana",
                    "type": "application/mikey",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mipc": {
                    "source": "iana",
                    "type": "application/mipc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mmt-aei+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mmt-aei+xml",
                    "extensions": []
                  },
                  "application/mmt-usd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mmt-usd+xml",
                    "extensions": []
                  },
                  "application/mods+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mods"
                    ],
                    "type": "application/mods+xml"
                  },
                  "application/moss-keys": {
                    "source": "iana",
                    "type": "application/moss-keys",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/moss-signature": {
                    "source": "iana",
                    "type": "application/moss-signature",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mosskey-data": {
                    "source": "iana",
                    "type": "application/mosskey-data",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mosskey-request": {
                    "source": "iana",
                    "type": "application/mosskey-request",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mp21": {
                    "source": "iana",
                    "extensions": [
                      "m21",
                      "mp21"
                    ],
                    "type": "application/mp21",
                    "compressible": false
                  },
                  "application/mp4": {
                    "source": "iana",
                    "extensions": [
                      "mp4s",
                      "m4p"
                    ],
                    "type": "application/mp4",
                    "compressible": false
                  },
                  "application/mpeg4-generic": {
                    "source": "iana",
                    "type": "application/mpeg4-generic",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mpeg4-iod": {
                    "source": "iana",
                    "type": "application/mpeg4-iod",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mpeg4-iod-xmt": {
                    "source": "iana",
                    "type": "application/mpeg4-iod-xmt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/mrb-consumer+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mrb-consumer+xml",
                    "extensions": []
                  },
                  "application/mrb-publish+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mrb-publish+xml",
                    "extensions": []
                  },
                  "application/msc-ivr+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/msc-ivr+xml",
                    "extensions": []
                  },
                  "application/msc-mixer+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/msc-mixer+xml",
                    "extensions": []
                  },
                  "application/msword": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "doc",
                      "dot"
                    ],
                    "type": "application/msword"
                  },
                  "application/mud+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/mud+json",
                    "extensions": []
                  },
                  "application/mxf": {
                    "source": "iana",
                    "extensions": [
                      "mxf"
                    ],
                    "type": "application/mxf",
                    "compressible": false
                  },
                  "application/n-quads": {
                    "source": "iana",
                    "extensions": [
                      "nq"
                    ],
                    "type": "application/n-quads",
                    "compressible": false
                  },
                  "application/n-triples": {
                    "source": "iana",
                    "extensions": [
                      "nt"
                    ],
                    "type": "application/n-triples",
                    "compressible": false
                  },
                  "application/nasdata": {
                    "source": "iana",
                    "type": "application/nasdata",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/news-checkgroups": {
                    "source": "iana",
                    "type": "application/news-checkgroups",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/news-groupinfo": {
                    "source": "iana",
                    "type": "application/news-groupinfo",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/news-transmission": {
                    "source": "iana",
                    "type": "application/news-transmission",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/nlsml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/nlsml+xml",
                    "extensions": []
                  },
                  "application/node": {
                    "source": "iana",
                    "type": "application/node",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/nss": {
                    "source": "iana",
                    "type": "application/nss",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/ocsp-request": {
                    "source": "iana",
                    "type": "application/ocsp-request",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/ocsp-response": {
                    "source": "iana",
                    "type": "application/ocsp-response",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/octet-stream": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "bin",
                      "dms",
                      "lrf",
                      "mar",
                      "so",
                      "dist",
                      "distz",
                      "pkg",
                      "bpk",
                      "dump",
                      "elc",
                      "deploy",
                      "exe",
                      "dll",
                      "deb",
                      "dmg",
                      "iso",
                      "img",
                      "msi",
                      "msp",
                      "msm",
                      "buffer"
                    ],
                    "type": "application/octet-stream"
                  },
                  "application/oda": {
                    "source": "iana",
                    "extensions": [
                      "oda"
                    ],
                    "type": "application/oda",
                    "compressible": false
                  },
                  "application/odm+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/odm+xml",
                    "extensions": []
                  },
                  "application/odx": {
                    "source": "iana",
                    "type": "application/odx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/oebps-package+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "opf"
                    ],
                    "type": "application/oebps-package+xml"
                  },
                  "application/ogg": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "ogx"
                    ],
                    "type": "application/ogg"
                  },
                  "application/omdoc+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "omdoc"
                    ],
                    "type": "application/omdoc+xml"
                  },
                  "application/onenote": {
                    "source": "apache",
                    "extensions": [
                      "onetoc",
                      "onetoc2",
                      "onetmp",
                      "onepkg"
                    ],
                    "type": "application/onenote",
                    "compressible": false
                  },
                  "application/oscore": {
                    "source": "iana",
                    "type": "application/oscore",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/oxps": {
                    "source": "iana",
                    "extensions": [
                      "oxps"
                    ],
                    "type": "application/oxps",
                    "compressible": false
                  },
                  "application/p2p-overlay+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/p2p-overlay+xml",
                    "extensions": []
                  },
                  "application/parityfec": {
                    "source": "iana",
                    "type": "application/parityfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/passport": {
                    "source": "iana",
                    "type": "application/passport",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/patch-ops-error+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xer"
                    ],
                    "type": "application/patch-ops-error+xml"
                  },
                  "application/pdf": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "pdf"
                    ],
                    "type": "application/pdf"
                  },
                  "application/pdx": {
                    "source": "iana",
                    "type": "application/pdx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/pem-certificate-chain": {
                    "source": "iana",
                    "type": "application/pem-certificate-chain",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/pgp-encrypted": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "pgp"
                    ],
                    "type": "application/pgp-encrypted"
                  },
                  "application/pgp-keys": {
                    "source": "iana",
                    "type": "application/pgp-keys",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/pgp-signature": {
                    "source": "iana",
                    "extensions": [
                      "asc",
                      "sig"
                    ],
                    "type": "application/pgp-signature",
                    "compressible": false
                  },
                  "application/pics-rules": {
                    "source": "apache",
                    "extensions": [
                      "prf"
                    ],
                    "type": "application/pics-rules",
                    "compressible": false
                  },
                  "application/pidf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/pidf+xml",
                    "extensions": []
                  },
                  "application/pidf-diff+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/pidf-diff+xml",
                    "extensions": []
                  },
                  "application/pkcs10": {
                    "source": "iana",
                    "extensions": [
                      "p10"
                    ],
                    "type": "application/pkcs10",
                    "compressible": false
                  },
                  "application/pkcs12": {
                    "source": "iana",
                    "type": "application/pkcs12",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/pkcs7-mime": {
                    "source": "iana",
                    "extensions": [
                      "p7m",
                      "p7c"
                    ],
                    "type": "application/pkcs7-mime",
                    "compressible": false
                  },
                  "application/pkcs7-signature": {
                    "source": "iana",
                    "extensions": [
                      "p7s"
                    ],
                    "type": "application/pkcs7-signature",
                    "compressible": false
                  },
                  "application/pkcs8": {
                    "source": "iana",
                    "extensions": [
                      "p8"
                    ],
                    "type": "application/pkcs8",
                    "compressible": false
                  },
                  "application/pkcs8-encrypted": {
                    "source": "iana",
                    "type": "application/pkcs8-encrypted",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/pkix-attr-cert": {
                    "source": "iana",
                    "extensions": [
                      "ac"
                    ],
                    "type": "application/pkix-attr-cert",
                    "compressible": false
                  },
                  "application/pkix-cert": {
                    "source": "iana",
                    "extensions": [
                      "cer"
                    ],
                    "type": "application/pkix-cert",
                    "compressible": false
                  },
                  "application/pkix-crl": {
                    "source": "iana",
                    "extensions": [
                      "crl"
                    ],
                    "type": "application/pkix-crl",
                    "compressible": false
                  },
                  "application/pkix-pkipath": {
                    "source": "iana",
                    "extensions": [
                      "pkipath"
                    ],
                    "type": "application/pkix-pkipath",
                    "compressible": false
                  },
                  "application/pkixcmp": {
                    "source": "iana",
                    "extensions": [
                      "pki"
                    ],
                    "type": "application/pkixcmp",
                    "compressible": false
                  },
                  "application/pls+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "pls"
                    ],
                    "type": "application/pls+xml"
                  },
                  "application/poc-settings+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/poc-settings+xml",
                    "extensions": []
                  },
                  "application/postscript": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "ai",
                      "eps",
                      "ps"
                    ],
                    "type": "application/postscript"
                  },
                  "application/ppsp-tracker+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/ppsp-tracker+json",
                    "extensions": []
                  },
                  "application/problem+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/problem+json",
                    "extensions": []
                  },
                  "application/problem+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/problem+xml",
                    "extensions": []
                  },
                  "application/provenance+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/provenance+xml",
                    "extensions": []
                  },
                  "application/prs.alvestrand.titrax-sheet": {
                    "source": "iana",
                    "type": "application/prs.alvestrand.titrax-sheet",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/prs.cww": {
                    "source": "iana",
                    "extensions": [
                      "cww"
                    ],
                    "type": "application/prs.cww",
                    "compressible": false
                  },
                  "application/prs.hpub+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/prs.hpub+zip",
                    "extensions": []
                  },
                  "application/prs.nprend": {
                    "source": "iana",
                    "type": "application/prs.nprend",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/prs.plucker": {
                    "source": "iana",
                    "type": "application/prs.plucker",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/prs.rdf-xml-crypt": {
                    "source": "iana",
                    "type": "application/prs.rdf-xml-crypt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/prs.xsf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/prs.xsf+xml",
                    "extensions": []
                  },
                  "application/pskc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "pskcxml"
                    ],
                    "type": "application/pskc+xml"
                  },
                  "application/qsig": {
                    "source": "iana",
                    "type": "application/qsig",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/raml+yaml": {
                    "compressible": true,
                    "extensions": [
                      "raml"
                    ],
                    "type": "application/raml+yaml",
                    "source": "mime-db"
                  },
                  "application/raptorfec": {
                    "source": "iana",
                    "type": "application/raptorfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/rdap+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/rdap+json",
                    "extensions": []
                  },
                  "application/rdf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rdf",
                      "owl"
                    ],
                    "type": "application/rdf+xml"
                  },
                  "application/reginfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rif"
                    ],
                    "type": "application/reginfo+xml"
                  },
                  "application/relax-ng-compact-syntax": {
                    "source": "iana",
                    "extensions": [
                      "rnc"
                    ],
                    "type": "application/relax-ng-compact-syntax",
                    "compressible": false
                  },
                  "application/remote-printing": {
                    "source": "iana",
                    "type": "application/remote-printing",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/reputon+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/reputon+json",
                    "extensions": []
                  },
                  "application/resource-lists+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rl"
                    ],
                    "type": "application/resource-lists+xml"
                  },
                  "application/resource-lists-diff+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rld"
                    ],
                    "type": "application/resource-lists-diff+xml"
                  },
                  "application/rfc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/rfc+xml",
                    "extensions": []
                  },
                  "application/riscos": {
                    "source": "iana",
                    "type": "application/riscos",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/rlmi+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/rlmi+xml",
                    "extensions": []
                  },
                  "application/rls-services+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rs"
                    ],
                    "type": "application/rls-services+xml"
                  },
                  "application/route-apd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/route-apd+xml",
                    "extensions": []
                  },
                  "application/route-s-tsid+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/route-s-tsid+xml",
                    "extensions": []
                  },
                  "application/route-usd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/route-usd+xml",
                    "extensions": []
                  },
                  "application/rpki-ghostbusters": {
                    "source": "iana",
                    "extensions": [
                      "gbr"
                    ],
                    "type": "application/rpki-ghostbusters",
                    "compressible": false
                  },
                  "application/rpki-manifest": {
                    "source": "iana",
                    "extensions": [
                      "mft"
                    ],
                    "type": "application/rpki-manifest",
                    "compressible": false
                  },
                  "application/rpki-publication": {
                    "source": "iana",
                    "type": "application/rpki-publication",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/rpki-roa": {
                    "source": "iana",
                    "extensions": [
                      "roa"
                    ],
                    "type": "application/rpki-roa",
                    "compressible": false
                  },
                  "application/rpki-updown": {
                    "source": "iana",
                    "type": "application/rpki-updown",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/rsd+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "rsd"
                    ],
                    "type": "application/rsd+xml"
                  },
                  "application/rss+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "rss"
                    ],
                    "type": "application/rss+xml"
                  },
                  "application/rtf": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rtf"
                    ],
                    "type": "application/rtf"
                  },
                  "application/rtploopback": {
                    "source": "iana",
                    "type": "application/rtploopback",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/rtx": {
                    "source": "iana",
                    "type": "application/rtx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/samlassertion+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/samlassertion+xml",
                    "extensions": []
                  },
                  "application/samlmetadata+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/samlmetadata+xml",
                    "extensions": []
                  },
                  "application/sbml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "sbml"
                    ],
                    "type": "application/sbml+xml"
                  },
                  "application/scaip+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/scaip+xml",
                    "extensions": []
                  },
                  "application/scim+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/scim+json",
                    "extensions": []
                  },
                  "application/scvp-cv-request": {
                    "source": "iana",
                    "extensions": [
                      "scq"
                    ],
                    "type": "application/scvp-cv-request",
                    "compressible": false
                  },
                  "application/scvp-cv-response": {
                    "source": "iana",
                    "extensions": [
                      "scs"
                    ],
                    "type": "application/scvp-cv-response",
                    "compressible": false
                  },
                  "application/scvp-vp-request": {
                    "source": "iana",
                    "extensions": [
                      "spq"
                    ],
                    "type": "application/scvp-vp-request",
                    "compressible": false
                  },
                  "application/scvp-vp-response": {
                    "source": "iana",
                    "extensions": [
                      "spp"
                    ],
                    "type": "application/scvp-vp-response",
                    "compressible": false
                  },
                  "application/sdp": {
                    "source": "iana",
                    "extensions": [
                      "sdp"
                    ],
                    "type": "application/sdp",
                    "compressible": false
                  },
                  "application/secevent+jwt": {
                    "source": "iana",
                    "type": "application/secevent+jwt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/senml+cbor": {
                    "source": "iana",
                    "type": "application/senml+cbor",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/senml+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/senml+json",
                    "extensions": []
                  },
                  "application/senml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/senml+xml",
                    "extensions": []
                  },
                  "application/senml-exi": {
                    "source": "iana",
                    "type": "application/senml-exi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/sensml+cbor": {
                    "source": "iana",
                    "type": "application/sensml+cbor",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/sensml+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/sensml+json",
                    "extensions": []
                  },
                  "application/sensml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/sensml+xml",
                    "extensions": []
                  },
                  "application/sensml-exi": {
                    "source": "iana",
                    "type": "application/sensml-exi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/sep+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/sep+xml",
                    "extensions": []
                  },
                  "application/sep-exi": {
                    "source": "iana",
                    "type": "application/sep-exi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/session-info": {
                    "source": "iana",
                    "type": "application/session-info",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/set-payment": {
                    "source": "iana",
                    "type": "application/set-payment",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/set-payment-initiation": {
                    "source": "iana",
                    "extensions": [
                      "setpay"
                    ],
                    "type": "application/set-payment-initiation",
                    "compressible": false
                  },
                  "application/set-registration": {
                    "source": "iana",
                    "type": "application/set-registration",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/set-registration-initiation": {
                    "source": "iana",
                    "extensions": [
                      "setreg"
                    ],
                    "type": "application/set-registration-initiation",
                    "compressible": false
                  },
                  "application/sgml": {
                    "source": "iana",
                    "type": "application/sgml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/sgml-open-catalog": {
                    "source": "iana",
                    "type": "application/sgml-open-catalog",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/shf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "shf"
                    ],
                    "type": "application/shf+xml"
                  },
                  "application/sieve": {
                    "source": "iana",
                    "extensions": [
                      "siv",
                      "sieve"
                    ],
                    "type": "application/sieve",
                    "compressible": false
                  },
                  "application/simple-filter+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/simple-filter+xml",
                    "extensions": []
                  },
                  "application/simple-message-summary": {
                    "source": "iana",
                    "type": "application/simple-message-summary",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/simplesymbolcontainer": {
                    "source": "iana",
                    "type": "application/simplesymbolcontainer",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/sipc": {
                    "source": "iana",
                    "type": "application/sipc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/slate": {
                    "source": "iana",
                    "type": "application/slate",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/smil": {
                    "source": "iana",
                    "type": "application/smil",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/smil+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "smi",
                      "smil"
                    ],
                    "type": "application/smil+xml"
                  },
                  "application/smpte336m": {
                    "source": "iana",
                    "type": "application/smpte336m",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/soap+fastinfoset": {
                    "source": "iana",
                    "type": "application/soap+fastinfoset",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/soap+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/soap+xml",
                    "extensions": []
                  },
                  "application/sparql-query": {
                    "source": "iana",
                    "extensions": [
                      "rq"
                    ],
                    "type": "application/sparql-query",
                    "compressible": false
                  },
                  "application/sparql-results+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "srx"
                    ],
                    "type": "application/sparql-results+xml"
                  },
                  "application/spirits-event+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/spirits-event+xml",
                    "extensions": []
                  },
                  "application/sql": {
                    "source": "iana",
                    "type": "application/sql",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/srgs": {
                    "source": "iana",
                    "extensions": [
                      "gram"
                    ],
                    "type": "application/srgs",
                    "compressible": false
                  },
                  "application/srgs+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "grxml"
                    ],
                    "type": "application/srgs+xml"
                  },
                  "application/sru+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "sru"
                    ],
                    "type": "application/sru+xml"
                  },
                  "application/ssdl+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "ssdl"
                    ],
                    "type": "application/ssdl+xml"
                  },
                  "application/ssml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "ssml"
                    ],
                    "type": "application/ssml+xml"
                  },
                  "application/stix+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/stix+json",
                    "extensions": []
                  },
                  "application/swid+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/swid+xml",
                    "extensions": []
                  },
                  "application/tamp-apex-update": {
                    "source": "iana",
                    "type": "application/tamp-apex-update",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-apex-update-confirm": {
                    "source": "iana",
                    "type": "application/tamp-apex-update-confirm",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-community-update": {
                    "source": "iana",
                    "type": "application/tamp-community-update",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-community-update-confirm": {
                    "source": "iana",
                    "type": "application/tamp-community-update-confirm",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-error": {
                    "source": "iana",
                    "type": "application/tamp-error",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-sequence-adjust": {
                    "source": "iana",
                    "type": "application/tamp-sequence-adjust",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-sequence-adjust-confirm": {
                    "source": "iana",
                    "type": "application/tamp-sequence-adjust-confirm",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-status-query": {
                    "source": "iana",
                    "type": "application/tamp-status-query",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-status-response": {
                    "source": "iana",
                    "type": "application/tamp-status-response",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-update": {
                    "source": "iana",
                    "type": "application/tamp-update",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tamp-update-confirm": {
                    "source": "iana",
                    "type": "application/tamp-update-confirm",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tar": {
                    "compressible": true,
                    "type": "application/tar",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "application/taxii+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/taxii+json",
                    "extensions": []
                  },
                  "application/tei+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "tei",
                      "teicorpus"
                    ],
                    "type": "application/tei+xml"
                  },
                  "application/tetra_isi": {
                    "source": "iana",
                    "type": "application/tetra_isi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/thraud+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "tfi"
                    ],
                    "type": "application/thraud+xml"
                  },
                  "application/timestamp-query": {
                    "source": "iana",
                    "type": "application/timestamp-query",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/timestamp-reply": {
                    "source": "iana",
                    "type": "application/timestamp-reply",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/timestamped-data": {
                    "source": "iana",
                    "extensions": [
                      "tsd"
                    ],
                    "type": "application/timestamped-data",
                    "compressible": false
                  },
                  "application/tlsrpt+gzip": {
                    "source": "iana",
                    "type": "application/tlsrpt+gzip",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tlsrpt+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/tlsrpt+json",
                    "extensions": []
                  },
                  "application/tnauthlist": {
                    "source": "iana",
                    "type": "application/tnauthlist",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/toml": {
                    "compressible": true,
                    "extensions": [
                      "toml"
                    ],
                    "type": "application/toml",
                    "source": "mime-db"
                  },
                  "application/trickle-ice-sdpfrag": {
                    "source": "iana",
                    "type": "application/trickle-ice-sdpfrag",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/trig": {
                    "source": "iana",
                    "type": "application/trig",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/ttml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/ttml+xml",
                    "extensions": []
                  },
                  "application/tve-trigger": {
                    "source": "iana",
                    "type": "application/tve-trigger",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tzif": {
                    "source": "iana",
                    "type": "application/tzif",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/tzif-leap": {
                    "source": "iana",
                    "type": "application/tzif-leap",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/ulpfec": {
                    "source": "iana",
                    "type": "application/ulpfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/urc-grpsheet+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/urc-grpsheet+xml",
                    "extensions": []
                  },
                  "application/urc-ressheet+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/urc-ressheet+xml",
                    "extensions": []
                  },
                  "application/urc-targetdesc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/urc-targetdesc+xml",
                    "extensions": []
                  },
                  "application/urc-uisocketdesc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/urc-uisocketdesc+xml",
                    "extensions": []
                  },
                  "application/vcard+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vcard+json",
                    "extensions": []
                  },
                  "application/vcard+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vcard+xml",
                    "extensions": []
                  },
                  "application/vemmi": {
                    "source": "iana",
                    "type": "application/vemmi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vividence.scriptfile": {
                    "source": "apache",
                    "type": "application/vividence.scriptfile",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.1000minds.decision-model+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.1000minds.decision-model+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp-prose+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp-prose+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp-prose-pc3ch+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp-prose-pc3ch+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp-v2x-local-service-information": {
                    "source": "iana",
                    "type": "application/vnd.3gpp-v2x-local-service-information",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.3gpp.access-transfer-events+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.access-transfer-events+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.bsf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.bsf+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.gmop+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.gmop+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mc-signalling-ear": {
                    "source": "iana",
                    "type": "application/vnd.3gpp.mc-signalling-ear",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.3gpp.mcdata-affiliation-command+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcdata-affiliation-command+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcdata-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcdata-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcdata-payload": {
                    "source": "iana",
                    "type": "application/vnd.3gpp.mcdata-payload",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.3gpp.mcdata-service-config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcdata-service-config+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcdata-signalling": {
                    "source": "iana",
                    "type": "application/vnd.3gpp.mcdata-signalling",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.3gpp.mcdata-ue-config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcdata-ue-config+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcdata-user-profile+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcdata-user-profile+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-affiliation-command+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-affiliation-command+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-floor-request+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-floor-request+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-location-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-location-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-mbms-usage-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-service-config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-service-config+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-signed+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-signed+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-ue-config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-ue-config+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-ue-init-config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-ue-init-config+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcptt-user-profile+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcptt-user-profile+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-affiliation-command+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-affiliation-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-location-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-location-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-mbms-usage-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-service-config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-service-config+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-transmission-request+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-transmission-request+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-ue-config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-ue-config+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mcvideo-user-profile+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mcvideo-user-profile+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.mid-call+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.mid-call+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.pic-bw-large": {
                    "source": "iana",
                    "extensions": [
                      "plb"
                    ],
                    "type": "application/vnd.3gpp.pic-bw-large",
                    "compressible": false
                  },
                  "application/vnd.3gpp.pic-bw-small": {
                    "source": "iana",
                    "extensions": [
                      "psb"
                    ],
                    "type": "application/vnd.3gpp.pic-bw-small",
                    "compressible": false
                  },
                  "application/vnd.3gpp.pic-bw-var": {
                    "source": "iana",
                    "extensions": [
                      "pvb"
                    ],
                    "type": "application/vnd.3gpp.pic-bw-var",
                    "compressible": false
                  },
                  "application/vnd.3gpp.sms": {
                    "source": "iana",
                    "type": "application/vnd.3gpp.sms",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.3gpp.sms+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.sms+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.srvcc-ext+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.srvcc-ext+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.srvcc-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.srvcc-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.state-and-event-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.state-and-event-info+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp.ussd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp.ussd+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp2.bcmcsinfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.3gpp2.bcmcsinfo+xml",
                    "extensions": []
                  },
                  "application/vnd.3gpp2.sms": {
                    "source": "iana",
                    "type": "application/vnd.3gpp2.sms",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.3gpp2.tcap": {
                    "source": "iana",
                    "extensions": [
                      "tcap"
                    ],
                    "type": "application/vnd.3gpp2.tcap",
                    "compressible": false
                  },
                  "application/vnd.3lightssoftware.imagescal": {
                    "source": "iana",
                    "type": "application/vnd.3lightssoftware.imagescal",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.3m.post-it-notes": {
                    "source": "iana",
                    "extensions": [
                      "pwn"
                    ],
                    "type": "application/vnd.3m.post-it-notes",
                    "compressible": false
                  },
                  "application/vnd.accpac.simply.aso": {
                    "source": "iana",
                    "extensions": [
                      "aso"
                    ],
                    "type": "application/vnd.accpac.simply.aso",
                    "compressible": false
                  },
                  "application/vnd.accpac.simply.imp": {
                    "source": "iana",
                    "extensions": [
                      "imp"
                    ],
                    "type": "application/vnd.accpac.simply.imp",
                    "compressible": false
                  },
                  "application/vnd.acucobol": {
                    "source": "iana",
                    "extensions": [
                      "acu"
                    ],
                    "type": "application/vnd.acucobol",
                    "compressible": false
                  },
                  "application/vnd.acucorp": {
                    "source": "iana",
                    "extensions": [
                      "atc",
                      "acutc"
                    ],
                    "type": "application/vnd.acucorp",
                    "compressible": false
                  },
                  "application/vnd.adobe.air-application-installer-package+zip": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "air"
                    ],
                    "type": "application/vnd.adobe.air-application-installer-package+zip"
                  },
                  "application/vnd.adobe.flash.movie": {
                    "source": "iana",
                    "type": "application/vnd.adobe.flash.movie",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.adobe.formscentral.fcdt": {
                    "source": "iana",
                    "extensions": [
                      "fcdt"
                    ],
                    "type": "application/vnd.adobe.formscentral.fcdt",
                    "compressible": false
                  },
                  "application/vnd.adobe.fxp": {
                    "source": "iana",
                    "extensions": [
                      "fxp",
                      "fxpl"
                    ],
                    "type": "application/vnd.adobe.fxp",
                    "compressible": false
                  },
                  "application/vnd.adobe.partial-upload": {
                    "source": "iana",
                    "type": "application/vnd.adobe.partial-upload",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.adobe.xdp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xdp"
                    ],
                    "type": "application/vnd.adobe.xdp+xml"
                  },
                  "application/vnd.adobe.xfdf": {
                    "source": "iana",
                    "extensions": [
                      "xfdf"
                    ],
                    "type": "application/vnd.adobe.xfdf",
                    "compressible": false
                  },
                  "application/vnd.aether.imp": {
                    "source": "iana",
                    "type": "application/vnd.aether.imp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.afpc.afplinedata": {
                    "source": "iana",
                    "type": "application/vnd.afpc.afplinedata",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.afpc.modca": {
                    "source": "iana",
                    "type": "application/vnd.afpc.modca",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ah-barcode": {
                    "source": "iana",
                    "type": "application/vnd.ah-barcode",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ahead.space": {
                    "source": "iana",
                    "extensions": [
                      "ahead"
                    ],
                    "type": "application/vnd.ahead.space",
                    "compressible": false
                  },
                  "application/vnd.airzip.filesecure.azf": {
                    "source": "iana",
                    "extensions": [
                      "azf"
                    ],
                    "type": "application/vnd.airzip.filesecure.azf",
                    "compressible": false
                  },
                  "application/vnd.airzip.filesecure.azs": {
                    "source": "iana",
                    "extensions": [
                      "azs"
                    ],
                    "type": "application/vnd.airzip.filesecure.azs",
                    "compressible": false
                  },
                  "application/vnd.amadeus+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.amadeus+json",
                    "extensions": []
                  },
                  "application/vnd.amazon.ebook": {
                    "source": "apache",
                    "extensions": [
                      "azw"
                    ],
                    "type": "application/vnd.amazon.ebook",
                    "compressible": false
                  },
                  "application/vnd.amazon.mobi8-ebook": {
                    "source": "iana",
                    "type": "application/vnd.amazon.mobi8-ebook",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.americandynamics.acc": {
                    "source": "iana",
                    "extensions": [
                      "acc"
                    ],
                    "type": "application/vnd.americandynamics.acc",
                    "compressible": false
                  },
                  "application/vnd.amiga.ami": {
                    "source": "iana",
                    "extensions": [
                      "ami"
                    ],
                    "type": "application/vnd.amiga.ami",
                    "compressible": false
                  },
                  "application/vnd.amundsen.maze+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.amundsen.maze+xml",
                    "extensions": []
                  },
                  "application/vnd.android.ota": {
                    "source": "iana",
                    "type": "application/vnd.android.ota",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.android.package-archive": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "apk"
                    ],
                    "type": "application/vnd.android.package-archive"
                  },
                  "application/vnd.anki": {
                    "source": "iana",
                    "type": "application/vnd.anki",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.anser-web-certificate-issue-initiation": {
                    "source": "iana",
                    "extensions": [
                      "cii"
                    ],
                    "type": "application/vnd.anser-web-certificate-issue-initiation",
                    "compressible": false
                  },
                  "application/vnd.anser-web-funds-transfer-initiation": {
                    "source": "apache",
                    "extensions": [
                      "fti"
                    ],
                    "type": "application/vnd.anser-web-funds-transfer-initiation",
                    "compressible": false
                  },
                  "application/vnd.antix.game-component": {
                    "source": "iana",
                    "extensions": [
                      "atx"
                    ],
                    "type": "application/vnd.antix.game-component",
                    "compressible": false
                  },
                  "application/vnd.apache.thrift.binary": {
                    "source": "iana",
                    "type": "application/vnd.apache.thrift.binary",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.apache.thrift.compact": {
                    "source": "iana",
                    "type": "application/vnd.apache.thrift.compact",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.apache.thrift.json": {
                    "source": "iana",
                    "type": "application/vnd.apache.thrift.json",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.api+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.api+json",
                    "extensions": []
                  },
                  "application/vnd.apothekende.reservation+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.apothekende.reservation+json",
                    "extensions": []
                  },
                  "application/vnd.apple.installer+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mpkg"
                    ],
                    "type": "application/vnd.apple.installer+xml"
                  },
                  "application/vnd.apple.keynote": {
                    "source": "iana",
                    "extensions": [
                      "keynote"
                    ],
                    "type": "application/vnd.apple.keynote",
                    "compressible": false
                  },
                  "application/vnd.apple.mpegurl": {
                    "source": "iana",
                    "extensions": [
                      "m3u8"
                    ],
                    "type": "application/vnd.apple.mpegurl",
                    "compressible": false
                  },
                  "application/vnd.apple.numbers": {
                    "source": "iana",
                    "extensions": [
                      "numbers"
                    ],
                    "type": "application/vnd.apple.numbers",
                    "compressible": false
                  },
                  "application/vnd.apple.pages": {
                    "source": "iana",
                    "extensions": [
                      "pages"
                    ],
                    "type": "application/vnd.apple.pages",
                    "compressible": false
                  },
                  "application/vnd.apple.pkpass": {
                    "compressible": false,
                    "extensions": [
                      "pkpass"
                    ],
                    "type": "application/vnd.apple.pkpass",
                    "source": "mime-db"
                  },
                  "application/vnd.arastra.swi": {
                    "source": "iana",
                    "type": "application/vnd.arastra.swi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.aristanetworks.swi": {
                    "source": "iana",
                    "extensions": [
                      "swi"
                    ],
                    "type": "application/vnd.aristanetworks.swi",
                    "compressible": false
                  },
                  "application/vnd.artisan+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.artisan+json",
                    "extensions": []
                  },
                  "application/vnd.artsquare": {
                    "source": "iana",
                    "type": "application/vnd.artsquare",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.astraea-software.iota": {
                    "source": "iana",
                    "extensions": [
                      "iota"
                    ],
                    "type": "application/vnd.astraea-software.iota",
                    "compressible": false
                  },
                  "application/vnd.audiograph": {
                    "source": "iana",
                    "extensions": [
                      "aep"
                    ],
                    "type": "application/vnd.audiograph",
                    "compressible": false
                  },
                  "application/vnd.autopackage": {
                    "source": "iana",
                    "type": "application/vnd.autopackage",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.avalon+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.avalon+json",
                    "extensions": []
                  },
                  "application/vnd.avistar+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.avistar+xml",
                    "extensions": []
                  },
                  "application/vnd.balsamiq.bmml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.balsamiq.bmml+xml",
                    "extensions": []
                  },
                  "application/vnd.balsamiq.bmpr": {
                    "source": "iana",
                    "type": "application/vnd.balsamiq.bmpr",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.banana-accounting": {
                    "source": "iana",
                    "type": "application/vnd.banana-accounting",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.bbf.usp.error": {
                    "source": "iana",
                    "type": "application/vnd.bbf.usp.error",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.bbf.usp.msg": {
                    "source": "iana",
                    "type": "application/vnd.bbf.usp.msg",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.bbf.usp.msg+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.bbf.usp.msg+json",
                    "extensions": []
                  },
                  "application/vnd.bekitzur-stech+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.bekitzur-stech+json",
                    "extensions": []
                  },
                  "application/vnd.bint.med-content": {
                    "source": "iana",
                    "type": "application/vnd.bint.med-content",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.biopax.rdf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.biopax.rdf+xml",
                    "extensions": []
                  },
                  "application/vnd.blink-idb-value-wrapper": {
                    "source": "iana",
                    "type": "application/vnd.blink-idb-value-wrapper",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.blueice.multipass": {
                    "source": "iana",
                    "extensions": [
                      "mpm"
                    ],
                    "type": "application/vnd.blueice.multipass",
                    "compressible": false
                  },
                  "application/vnd.bluetooth.ep.oob": {
                    "source": "iana",
                    "type": "application/vnd.bluetooth.ep.oob",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.bluetooth.le.oob": {
                    "source": "iana",
                    "type": "application/vnd.bluetooth.le.oob",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.bmi": {
                    "source": "iana",
                    "extensions": [
                      "bmi"
                    ],
                    "type": "application/vnd.bmi",
                    "compressible": false
                  },
                  "application/vnd.bpf": {
                    "source": "iana",
                    "type": "application/vnd.bpf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.bpf3": {
                    "source": "iana",
                    "type": "application/vnd.bpf3",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.businessobjects": {
                    "source": "iana",
                    "extensions": [
                      "rep"
                    ],
                    "type": "application/vnd.businessobjects",
                    "compressible": false
                  },
                  "application/vnd.byu.uapi+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.byu.uapi+json",
                    "extensions": []
                  },
                  "application/vnd.cab-jscript": {
                    "source": "iana",
                    "type": "application/vnd.cab-jscript",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.canon-cpdl": {
                    "source": "iana",
                    "type": "application/vnd.canon-cpdl",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.canon-lips": {
                    "source": "iana",
                    "type": "application/vnd.canon-lips",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.capasystems-pg+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.capasystems-pg+json",
                    "extensions": []
                  },
                  "application/vnd.cendio.thinlinc.clientconf": {
                    "source": "iana",
                    "type": "application/vnd.cendio.thinlinc.clientconf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.century-systems.tcp_stream": {
                    "source": "iana",
                    "type": "application/vnd.century-systems.tcp_stream",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.chemdraw+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "cdxml"
                    ],
                    "type": "application/vnd.chemdraw+xml"
                  },
                  "application/vnd.chess-pgn": {
                    "source": "iana",
                    "type": "application/vnd.chess-pgn",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.chipnuts.karaoke-mmd": {
                    "source": "iana",
                    "extensions": [
                      "mmd"
                    ],
                    "type": "application/vnd.chipnuts.karaoke-mmd",
                    "compressible": false
                  },
                  "application/vnd.ciedi": {
                    "source": "iana",
                    "type": "application/vnd.ciedi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.cinderella": {
                    "source": "iana",
                    "extensions": [
                      "cdy"
                    ],
                    "type": "application/vnd.cinderella",
                    "compressible": false
                  },
                  "application/vnd.cirpack.isdn-ext": {
                    "source": "iana",
                    "type": "application/vnd.cirpack.isdn-ext",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.citationstyles.style+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "csl"
                    ],
                    "type": "application/vnd.citationstyles.style+xml"
                  },
                  "application/vnd.claymore": {
                    "source": "iana",
                    "extensions": [
                      "cla"
                    ],
                    "type": "application/vnd.claymore",
                    "compressible": false
                  },
                  "application/vnd.cloanto.rp9": {
                    "source": "iana",
                    "extensions": [
                      "rp9"
                    ],
                    "type": "application/vnd.cloanto.rp9",
                    "compressible": false
                  },
                  "application/vnd.clonk.c4group": {
                    "source": "iana",
                    "extensions": [
                      "c4g",
                      "c4d",
                      "c4f",
                      "c4p",
                      "c4u"
                    ],
                    "type": "application/vnd.clonk.c4group",
                    "compressible": false
                  },
                  "application/vnd.cluetrust.cartomobile-config": {
                    "source": "iana",
                    "extensions": [
                      "c11amc"
                    ],
                    "type": "application/vnd.cluetrust.cartomobile-config",
                    "compressible": false
                  },
                  "application/vnd.cluetrust.cartomobile-config-pkg": {
                    "source": "iana",
                    "extensions": [
                      "c11amz"
                    ],
                    "type": "application/vnd.cluetrust.cartomobile-config-pkg",
                    "compressible": false
                  },
                  "application/vnd.coffeescript": {
                    "source": "iana",
                    "type": "application/vnd.coffeescript",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.collabio.xodocuments.document": {
                    "source": "iana",
                    "type": "application/vnd.collabio.xodocuments.document",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.collabio.xodocuments.document-template": {
                    "source": "iana",
                    "type": "application/vnd.collabio.xodocuments.document-template",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.collabio.xodocuments.presentation": {
                    "source": "iana",
                    "type": "application/vnd.collabio.xodocuments.presentation",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.collabio.xodocuments.presentation-template": {
                    "source": "iana",
                    "type": "application/vnd.collabio.xodocuments.presentation-template",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.collabio.xodocuments.spreadsheet": {
                    "source": "iana",
                    "type": "application/vnd.collabio.xodocuments.spreadsheet",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.collabio.xodocuments.spreadsheet-template": {
                    "source": "iana",
                    "type": "application/vnd.collabio.xodocuments.spreadsheet-template",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.collection+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.collection+json",
                    "extensions": []
                  },
                  "application/vnd.collection.doc+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.collection.doc+json",
                    "extensions": []
                  },
                  "application/vnd.collection.next+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.collection.next+json",
                    "extensions": []
                  },
                  "application/vnd.comicbook+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.comicbook+zip",
                    "extensions": []
                  },
                  "application/vnd.comicbook-rar": {
                    "source": "iana",
                    "type": "application/vnd.comicbook-rar",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.commerce-battelle": {
                    "source": "iana",
                    "type": "application/vnd.commerce-battelle",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.commonspace": {
                    "source": "iana",
                    "extensions": [
                      "csp"
                    ],
                    "type": "application/vnd.commonspace",
                    "compressible": false
                  },
                  "application/vnd.contact.cmsg": {
                    "source": "iana",
                    "extensions": [
                      "cdbcmsg"
                    ],
                    "type": "application/vnd.contact.cmsg",
                    "compressible": false
                  },
                  "application/vnd.coreos.ignition+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.coreos.ignition+json",
                    "extensions": []
                  },
                  "application/vnd.cosmocaller": {
                    "source": "iana",
                    "extensions": [
                      "cmc"
                    ],
                    "type": "application/vnd.cosmocaller",
                    "compressible": false
                  },
                  "application/vnd.crick.clicker": {
                    "source": "iana",
                    "extensions": [
                      "clkx"
                    ],
                    "type": "application/vnd.crick.clicker",
                    "compressible": false
                  },
                  "application/vnd.crick.clicker.keyboard": {
                    "source": "iana",
                    "extensions": [
                      "clkk"
                    ],
                    "type": "application/vnd.crick.clicker.keyboard",
                    "compressible": false
                  },
                  "application/vnd.crick.clicker.palette": {
                    "source": "iana",
                    "extensions": [
                      "clkp"
                    ],
                    "type": "application/vnd.crick.clicker.palette",
                    "compressible": false
                  },
                  "application/vnd.crick.clicker.template": {
                    "source": "iana",
                    "extensions": [
                      "clkt"
                    ],
                    "type": "application/vnd.crick.clicker.template",
                    "compressible": false
                  },
                  "application/vnd.crick.clicker.wordbank": {
                    "source": "iana",
                    "extensions": [
                      "clkw"
                    ],
                    "type": "application/vnd.crick.clicker.wordbank",
                    "compressible": false
                  },
                  "application/vnd.criticaltools.wbs+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "wbs"
                    ],
                    "type": "application/vnd.criticaltools.wbs+xml"
                  },
                  "application/vnd.cryptii.pipe+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.cryptii.pipe+json",
                    "extensions": []
                  },
                  "application/vnd.crypto-shade-file": {
                    "source": "iana",
                    "type": "application/vnd.crypto-shade-file",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ctc-posml": {
                    "source": "iana",
                    "extensions": [
                      "pml"
                    ],
                    "type": "application/vnd.ctc-posml",
                    "compressible": false
                  },
                  "application/vnd.ctct.ws+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ctct.ws+xml",
                    "extensions": []
                  },
                  "application/vnd.cups-pdf": {
                    "source": "iana",
                    "type": "application/vnd.cups-pdf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.cups-postscript": {
                    "source": "iana",
                    "type": "application/vnd.cups-postscript",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.cups-ppd": {
                    "source": "iana",
                    "extensions": [
                      "ppd"
                    ],
                    "type": "application/vnd.cups-ppd",
                    "compressible": false
                  },
                  "application/vnd.cups-raster": {
                    "source": "iana",
                    "type": "application/vnd.cups-raster",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.cups-raw": {
                    "source": "iana",
                    "type": "application/vnd.cups-raw",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.curl": {
                    "source": "iana",
                    "type": "application/vnd.curl",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.curl.car": {
                    "source": "apache",
                    "extensions": [
                      "car"
                    ],
                    "type": "application/vnd.curl.car",
                    "compressible": false
                  },
                  "application/vnd.curl.pcurl": {
                    "source": "apache",
                    "extensions": [
                      "pcurl"
                    ],
                    "type": "application/vnd.curl.pcurl",
                    "compressible": false
                  },
                  "application/vnd.cyan.dean.root+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.cyan.dean.root+xml",
                    "extensions": []
                  },
                  "application/vnd.cybank": {
                    "source": "iana",
                    "type": "application/vnd.cybank",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.d2l.coursepackage1p0+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.d2l.coursepackage1p0+zip",
                    "extensions": []
                  },
                  "application/vnd.dart": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "dart"
                    ],
                    "type": "application/vnd.dart"
                  },
                  "application/vnd.data-vision.rdz": {
                    "source": "iana",
                    "extensions": [
                      "rdz"
                    ],
                    "type": "application/vnd.data-vision.rdz",
                    "compressible": false
                  },
                  "application/vnd.datapackage+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.datapackage+json",
                    "extensions": []
                  },
                  "application/vnd.dataresource+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dataresource+json",
                    "extensions": []
                  },
                  "application/vnd.debian.binary-package": {
                    "source": "iana",
                    "type": "application/vnd.debian.binary-package",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dece.data": {
                    "source": "iana",
                    "extensions": [
                      "uvf",
                      "uvvf",
                      "uvd",
                      "uvvd"
                    ],
                    "type": "application/vnd.dece.data",
                    "compressible": false
                  },
                  "application/vnd.dece.ttml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "uvt",
                      "uvvt"
                    ],
                    "type": "application/vnd.dece.ttml+xml"
                  },
                  "application/vnd.dece.unspecified": {
                    "source": "iana",
                    "extensions": [
                      "uvx",
                      "uvvx"
                    ],
                    "type": "application/vnd.dece.unspecified",
                    "compressible": false
                  },
                  "application/vnd.dece.zip": {
                    "source": "iana",
                    "extensions": [
                      "uvz",
                      "uvvz"
                    ],
                    "type": "application/vnd.dece.zip",
                    "compressible": false
                  },
                  "application/vnd.denovo.fcselayout-link": {
                    "source": "iana",
                    "extensions": [
                      "fe_launch"
                    ],
                    "type": "application/vnd.denovo.fcselayout-link",
                    "compressible": false
                  },
                  "application/vnd.desmume.movie": {
                    "source": "iana",
                    "type": "application/vnd.desmume.movie",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dir-bi.plate-dl-nosuffix": {
                    "source": "iana",
                    "type": "application/vnd.dir-bi.plate-dl-nosuffix",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dm.delegation+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dm.delegation+xml",
                    "extensions": []
                  },
                  "application/vnd.dna": {
                    "source": "iana",
                    "extensions": [
                      "dna"
                    ],
                    "type": "application/vnd.dna",
                    "compressible": false
                  },
                  "application/vnd.document+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.document+json",
                    "extensions": []
                  },
                  "application/vnd.dolby.mlp": {
                    "source": "apache",
                    "extensions": [
                      "mlp"
                    ],
                    "type": "application/vnd.dolby.mlp",
                    "compressible": false
                  },
                  "application/vnd.dolby.mobile.1": {
                    "source": "iana",
                    "type": "application/vnd.dolby.mobile.1",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dolby.mobile.2": {
                    "source": "iana",
                    "type": "application/vnd.dolby.mobile.2",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.doremir.scorecloud-binary-document": {
                    "source": "iana",
                    "type": "application/vnd.doremir.scorecloud-binary-document",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dpgraph": {
                    "source": "iana",
                    "extensions": [
                      "dpg"
                    ],
                    "type": "application/vnd.dpgraph",
                    "compressible": false
                  },
                  "application/vnd.dreamfactory": {
                    "source": "iana",
                    "extensions": [
                      "dfac"
                    ],
                    "type": "application/vnd.dreamfactory",
                    "compressible": false
                  },
                  "application/vnd.drive+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.drive+json",
                    "extensions": []
                  },
                  "application/vnd.ds-keypoint": {
                    "source": "apache",
                    "extensions": [
                      "kpxx"
                    ],
                    "type": "application/vnd.ds-keypoint",
                    "compressible": false
                  },
                  "application/vnd.dtg.local": {
                    "source": "iana",
                    "type": "application/vnd.dtg.local",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dtg.local.flash": {
                    "source": "iana",
                    "type": "application/vnd.dtg.local.flash",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dtg.local.html": {
                    "source": "iana",
                    "type": "application/vnd.dtg.local.html",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.ait": {
                    "source": "iana",
                    "extensions": [
                      "ait"
                    ],
                    "type": "application/vnd.dvb.ait",
                    "compressible": false
                  },
                  "application/vnd.dvb.dvbj": {
                    "source": "iana",
                    "type": "application/vnd.dvb.dvbj",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.esgcontainer": {
                    "source": "iana",
                    "type": "application/vnd.dvb.esgcontainer",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.ipdcdftnotifaccess": {
                    "source": "iana",
                    "type": "application/vnd.dvb.ipdcdftnotifaccess",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.ipdcesgaccess": {
                    "source": "iana",
                    "type": "application/vnd.dvb.ipdcesgaccess",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.ipdcesgaccess2": {
                    "source": "iana",
                    "type": "application/vnd.dvb.ipdcesgaccess2",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.ipdcesgpdd": {
                    "source": "iana",
                    "type": "application/vnd.dvb.ipdcesgpdd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.ipdcroaming": {
                    "source": "iana",
                    "type": "application/vnd.dvb.ipdcroaming",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.iptv.alfec-base": {
                    "source": "iana",
                    "type": "application/vnd.dvb.iptv.alfec-base",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.iptv.alfec-enhancement": {
                    "source": "iana",
                    "type": "application/vnd.dvb.iptv.alfec-enhancement",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.notif-aggregate-root+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dvb.notif-aggregate-root+xml",
                    "extensions": []
                  },
                  "application/vnd.dvb.notif-container+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dvb.notif-container+xml",
                    "extensions": []
                  },
                  "application/vnd.dvb.notif-generic+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dvb.notif-generic+xml",
                    "extensions": []
                  },
                  "application/vnd.dvb.notif-ia-msglist+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dvb.notif-ia-msglist+xml",
                    "extensions": []
                  },
                  "application/vnd.dvb.notif-ia-registration-request+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dvb.notif-ia-registration-request+xml",
                    "extensions": []
                  },
                  "application/vnd.dvb.notif-ia-registration-response+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dvb.notif-ia-registration-response+xml",
                    "extensions": []
                  },
                  "application/vnd.dvb.notif-init+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.dvb.notif-init+xml",
                    "extensions": []
                  },
                  "application/vnd.dvb.pfr": {
                    "source": "iana",
                    "type": "application/vnd.dvb.pfr",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dvb.service": {
                    "source": "iana",
                    "extensions": [
                      "svc"
                    ],
                    "type": "application/vnd.dvb.service",
                    "compressible": false
                  },
                  "application/vnd.dxr": {
                    "source": "iana",
                    "type": "application/vnd.dxr",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.dynageo": {
                    "source": "iana",
                    "extensions": [
                      "geo"
                    ],
                    "type": "application/vnd.dynageo",
                    "compressible": false
                  },
                  "application/vnd.dzr": {
                    "source": "iana",
                    "type": "application/vnd.dzr",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.easykaraoke.cdgdownload": {
                    "source": "iana",
                    "type": "application/vnd.easykaraoke.cdgdownload",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ecdis-update": {
                    "source": "iana",
                    "type": "application/vnd.ecdis-update",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ecip.rlp": {
                    "source": "iana",
                    "type": "application/vnd.ecip.rlp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ecowin.chart": {
                    "source": "iana",
                    "extensions": [
                      "mag"
                    ],
                    "type": "application/vnd.ecowin.chart",
                    "compressible": false
                  },
                  "application/vnd.ecowin.filerequest": {
                    "source": "iana",
                    "type": "application/vnd.ecowin.filerequest",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ecowin.fileupdate": {
                    "source": "iana",
                    "type": "application/vnd.ecowin.fileupdate",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ecowin.series": {
                    "source": "iana",
                    "type": "application/vnd.ecowin.series",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ecowin.seriesrequest": {
                    "source": "iana",
                    "type": "application/vnd.ecowin.seriesrequest",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ecowin.seriesupdate": {
                    "source": "iana",
                    "type": "application/vnd.ecowin.seriesupdate",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.efi.img": {
                    "source": "iana",
                    "type": "application/vnd.efi.img",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.efi.iso": {
                    "source": "iana",
                    "type": "application/vnd.efi.iso",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.emclient.accessrequest+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.emclient.accessrequest+xml",
                    "extensions": []
                  },
                  "application/vnd.enliven": {
                    "source": "iana",
                    "extensions": [
                      "nml"
                    ],
                    "type": "application/vnd.enliven",
                    "compressible": false
                  },
                  "application/vnd.enphase.envoy": {
                    "source": "iana",
                    "type": "application/vnd.enphase.envoy",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.eprints.data+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.eprints.data+xml",
                    "extensions": []
                  },
                  "application/vnd.epson.esf": {
                    "source": "iana",
                    "extensions": [
                      "esf"
                    ],
                    "type": "application/vnd.epson.esf",
                    "compressible": false
                  },
                  "application/vnd.epson.msf": {
                    "source": "iana",
                    "extensions": [
                      "msf"
                    ],
                    "type": "application/vnd.epson.msf",
                    "compressible": false
                  },
                  "application/vnd.epson.quickanime": {
                    "source": "iana",
                    "extensions": [
                      "qam"
                    ],
                    "type": "application/vnd.epson.quickanime",
                    "compressible": false
                  },
                  "application/vnd.epson.salt": {
                    "source": "iana",
                    "extensions": [
                      "slt"
                    ],
                    "type": "application/vnd.epson.salt",
                    "compressible": false
                  },
                  "application/vnd.epson.ssf": {
                    "source": "iana",
                    "extensions": [
                      "ssf"
                    ],
                    "type": "application/vnd.epson.ssf",
                    "compressible": false
                  },
                  "application/vnd.ericsson.quickcall": {
                    "source": "iana",
                    "type": "application/vnd.ericsson.quickcall",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.espass-espass+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.espass-espass+zip",
                    "extensions": []
                  },
                  "application/vnd.eszigno3+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "es3",
                      "et3"
                    ],
                    "type": "application/vnd.eszigno3+xml"
                  },
                  "application/vnd.etsi.aoc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.aoc+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.asic-e+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.etsi.asic-e+zip",
                    "extensions": []
                  },
                  "application/vnd.etsi.asic-s+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.etsi.asic-s+zip",
                    "extensions": []
                  },
                  "application/vnd.etsi.cug+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.cug+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvcommand+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvcommand+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvdiscovery+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvdiscovery+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvprofile+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvprofile+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvsad-bc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvsad-bc+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvsad-cod+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvsad-cod+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvsad-npvr+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvsad-npvr+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvservice+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvservice+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvsync+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvsync+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.iptvueprofile+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.iptvueprofile+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.mcid+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.mcid+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.mheg5": {
                    "source": "iana",
                    "type": "application/vnd.etsi.mheg5",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.etsi.overload-control-policy-dataset+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.overload-control-policy-dataset+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.pstn+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.pstn+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.sci+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.sci+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.simservs+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.simservs+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.timestamp-token": {
                    "source": "iana",
                    "type": "application/vnd.etsi.timestamp-token",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.etsi.tsl+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.etsi.tsl+xml",
                    "extensions": []
                  },
                  "application/vnd.etsi.tsl.der": {
                    "source": "iana",
                    "type": "application/vnd.etsi.tsl.der",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.eudora.data": {
                    "source": "iana",
                    "type": "application/vnd.eudora.data",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.evolv.ecig.profile": {
                    "source": "iana",
                    "type": "application/vnd.evolv.ecig.profile",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.evolv.ecig.settings": {
                    "source": "iana",
                    "type": "application/vnd.evolv.ecig.settings",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.evolv.ecig.theme": {
                    "source": "iana",
                    "type": "application/vnd.evolv.ecig.theme",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.exstream-empower+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.exstream-empower+zip",
                    "extensions": []
                  },
                  "application/vnd.exstream-package": {
                    "source": "iana",
                    "type": "application/vnd.exstream-package",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ezpix-album": {
                    "source": "iana",
                    "extensions": [
                      "ez2"
                    ],
                    "type": "application/vnd.ezpix-album",
                    "compressible": false
                  },
                  "application/vnd.ezpix-package": {
                    "source": "iana",
                    "extensions": [
                      "ez3"
                    ],
                    "type": "application/vnd.ezpix-package",
                    "compressible": false
                  },
                  "application/vnd.f-secure.mobile": {
                    "source": "iana",
                    "type": "application/vnd.f-secure.mobile",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.fastcopy-disk-image": {
                    "source": "iana",
                    "type": "application/vnd.fastcopy-disk-image",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.fdf": {
                    "source": "iana",
                    "extensions": [
                      "fdf"
                    ],
                    "type": "application/vnd.fdf",
                    "compressible": false
                  },
                  "application/vnd.fdsn.mseed": {
                    "source": "iana",
                    "extensions": [
                      "mseed"
                    ],
                    "type": "application/vnd.fdsn.mseed",
                    "compressible": false
                  },
                  "application/vnd.fdsn.seed": {
                    "source": "iana",
                    "extensions": [
                      "seed",
                      "dataless"
                    ],
                    "type": "application/vnd.fdsn.seed",
                    "compressible": false
                  },
                  "application/vnd.ffsns": {
                    "source": "iana",
                    "type": "application/vnd.ffsns",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ficlab.flb+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.ficlab.flb+zip",
                    "extensions": []
                  },
                  "application/vnd.filmit.zfc": {
                    "source": "iana",
                    "type": "application/vnd.filmit.zfc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.fints": {
                    "source": "iana",
                    "type": "application/vnd.fints",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.firemonkeys.cloudcell": {
                    "source": "iana",
                    "type": "application/vnd.firemonkeys.cloudcell",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.flographit": {
                    "source": "iana",
                    "extensions": [
                      "gph"
                    ],
                    "type": "application/vnd.flographit",
                    "compressible": false
                  },
                  "application/vnd.fluxtime.clip": {
                    "source": "iana",
                    "extensions": [
                      "ftc"
                    ],
                    "type": "application/vnd.fluxtime.clip",
                    "compressible": false
                  },
                  "application/vnd.font-fontforge-sfd": {
                    "source": "iana",
                    "type": "application/vnd.font-fontforge-sfd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.framemaker": {
                    "source": "iana",
                    "extensions": [
                      "fm",
                      "frame",
                      "maker",
                      "book"
                    ],
                    "type": "application/vnd.framemaker",
                    "compressible": false
                  },
                  "application/vnd.frogans.fnc": {
                    "source": "iana",
                    "extensions": [
                      "fnc"
                    ],
                    "type": "application/vnd.frogans.fnc",
                    "compressible": false
                  },
                  "application/vnd.frogans.ltf": {
                    "source": "iana",
                    "extensions": [
                      "ltf"
                    ],
                    "type": "application/vnd.frogans.ltf",
                    "compressible": false
                  },
                  "application/vnd.fsc.weblaunch": {
                    "source": "iana",
                    "extensions": [
                      "fsc"
                    ],
                    "type": "application/vnd.fsc.weblaunch",
                    "compressible": false
                  },
                  "application/vnd.fujitsu.oasys": {
                    "source": "iana",
                    "extensions": [
                      "oas"
                    ],
                    "type": "application/vnd.fujitsu.oasys",
                    "compressible": false
                  },
                  "application/vnd.fujitsu.oasys2": {
                    "source": "iana",
                    "extensions": [
                      "oa2"
                    ],
                    "type": "application/vnd.fujitsu.oasys2",
                    "compressible": false
                  },
                  "application/vnd.fujitsu.oasys3": {
                    "source": "iana",
                    "extensions": [
                      "oa3"
                    ],
                    "type": "application/vnd.fujitsu.oasys3",
                    "compressible": false
                  },
                  "application/vnd.fujitsu.oasysgp": {
                    "source": "iana",
                    "extensions": [
                      "fg5"
                    ],
                    "type": "application/vnd.fujitsu.oasysgp",
                    "compressible": false
                  },
                  "application/vnd.fujitsu.oasysprs": {
                    "source": "iana",
                    "extensions": [
                      "bh2"
                    ],
                    "type": "application/vnd.fujitsu.oasysprs",
                    "compressible": false
                  },
                  "application/vnd.fujixerox.art-ex": {
                    "source": "iana",
                    "type": "application/vnd.fujixerox.art-ex",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.fujixerox.art4": {
                    "source": "iana",
                    "type": "application/vnd.fujixerox.art4",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.fujixerox.ddd": {
                    "source": "iana",
                    "extensions": [
                      "ddd"
                    ],
                    "type": "application/vnd.fujixerox.ddd",
                    "compressible": false
                  },
                  "application/vnd.fujixerox.docuworks": {
                    "source": "iana",
                    "extensions": [
                      "xdw"
                    ],
                    "type": "application/vnd.fujixerox.docuworks",
                    "compressible": false
                  },
                  "application/vnd.fujixerox.docuworks.binder": {
                    "source": "iana",
                    "extensions": [
                      "xbd"
                    ],
                    "type": "application/vnd.fujixerox.docuworks.binder",
                    "compressible": false
                  },
                  "application/vnd.fujixerox.docuworks.container": {
                    "source": "iana",
                    "type": "application/vnd.fujixerox.docuworks.container",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.fujixerox.hbpl": {
                    "source": "iana",
                    "type": "application/vnd.fujixerox.hbpl",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.fut-misnet": {
                    "source": "iana",
                    "type": "application/vnd.fut-misnet",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.futoin+cbor": {
                    "source": "iana",
                    "type": "application/vnd.futoin+cbor",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.futoin+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.futoin+json",
                    "extensions": []
                  },
                  "application/vnd.fuzzysheet": {
                    "source": "iana",
                    "extensions": [
                      "fzs"
                    ],
                    "type": "application/vnd.fuzzysheet",
                    "compressible": false
                  },
                  "application/vnd.genomatix.tuxedo": {
                    "source": "iana",
                    "extensions": [
                      "txd"
                    ],
                    "type": "application/vnd.genomatix.tuxedo",
                    "compressible": false
                  },
                  "application/vnd.geo+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.geo+json",
                    "extensions": []
                  },
                  "application/vnd.geocube+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.geocube+xml",
                    "extensions": []
                  },
                  "application/vnd.geogebra.file": {
                    "source": "iana",
                    "extensions": [
                      "ggb"
                    ],
                    "type": "application/vnd.geogebra.file",
                    "compressible": false
                  },
                  "application/vnd.geogebra.tool": {
                    "source": "iana",
                    "extensions": [
                      "ggt"
                    ],
                    "type": "application/vnd.geogebra.tool",
                    "compressible": false
                  },
                  "application/vnd.geometry-explorer": {
                    "source": "iana",
                    "extensions": [
                      "gex",
                      "gre"
                    ],
                    "type": "application/vnd.geometry-explorer",
                    "compressible": false
                  },
                  "application/vnd.geonext": {
                    "source": "iana",
                    "extensions": [
                      "gxt"
                    ],
                    "type": "application/vnd.geonext",
                    "compressible": false
                  },
                  "application/vnd.geoplan": {
                    "source": "iana",
                    "extensions": [
                      "g2w"
                    ],
                    "type": "application/vnd.geoplan",
                    "compressible": false
                  },
                  "application/vnd.geospace": {
                    "source": "iana",
                    "extensions": [
                      "g3w"
                    ],
                    "type": "application/vnd.geospace",
                    "compressible": false
                  },
                  "application/vnd.gerber": {
                    "source": "iana",
                    "type": "application/vnd.gerber",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.globalplatform.card-content-mgt": {
                    "source": "iana",
                    "type": "application/vnd.globalplatform.card-content-mgt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.globalplatform.card-content-mgt-response": {
                    "source": "iana",
                    "type": "application/vnd.globalplatform.card-content-mgt-response",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.gmx": {
                    "source": "iana",
                    "extensions": [
                      "gmx"
                    ],
                    "type": "application/vnd.gmx",
                    "compressible": false
                  },
                  "application/vnd.google-apps.document": {
                    "compressible": false,
                    "extensions": [
                      "gdoc"
                    ],
                    "type": "application/vnd.google-apps.document",
                    "source": "mime-db"
                  },
                  "application/vnd.google-apps.presentation": {
                    "compressible": false,
                    "extensions": [
                      "gslides"
                    ],
                    "type": "application/vnd.google-apps.presentation",
                    "source": "mime-db"
                  },
                  "application/vnd.google-apps.spreadsheet": {
                    "compressible": false,
                    "extensions": [
                      "gsheet"
                    ],
                    "type": "application/vnd.google-apps.spreadsheet",
                    "source": "mime-db"
                  },
                  "application/vnd.google-earth.kml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "kml"
                    ],
                    "type": "application/vnd.google-earth.kml+xml"
                  },
                  "application/vnd.google-earth.kmz": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "kmz"
                    ],
                    "type": "application/vnd.google-earth.kmz"
                  },
                  "application/vnd.gov.sk.e-form+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.gov.sk.e-form+xml",
                    "extensions": []
                  },
                  "application/vnd.gov.sk.e-form+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.gov.sk.e-form+zip",
                    "extensions": []
                  },
                  "application/vnd.gov.sk.xmldatacontainer+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.gov.sk.xmldatacontainer+xml",
                    "extensions": []
                  },
                  "application/vnd.grafeq": {
                    "source": "iana",
                    "extensions": [
                      "gqf",
                      "gqs"
                    ],
                    "type": "application/vnd.grafeq",
                    "compressible": false
                  },
                  "application/vnd.gridmp": {
                    "source": "iana",
                    "type": "application/vnd.gridmp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.groove-account": {
                    "source": "iana",
                    "extensions": [
                      "gac"
                    ],
                    "type": "application/vnd.groove-account",
                    "compressible": false
                  },
                  "application/vnd.groove-help": {
                    "source": "iana",
                    "extensions": [
                      "ghf"
                    ],
                    "type": "application/vnd.groove-help",
                    "compressible": false
                  },
                  "application/vnd.groove-identity-message": {
                    "source": "iana",
                    "extensions": [
                      "gim"
                    ],
                    "type": "application/vnd.groove-identity-message",
                    "compressible": false
                  },
                  "application/vnd.groove-injector": {
                    "source": "iana",
                    "extensions": [
                      "grv"
                    ],
                    "type": "application/vnd.groove-injector",
                    "compressible": false
                  },
                  "application/vnd.groove-tool-message": {
                    "source": "iana",
                    "extensions": [
                      "gtm"
                    ],
                    "type": "application/vnd.groove-tool-message",
                    "compressible": false
                  },
                  "application/vnd.groove-tool-template": {
                    "source": "iana",
                    "extensions": [
                      "tpl"
                    ],
                    "type": "application/vnd.groove-tool-template",
                    "compressible": false
                  },
                  "application/vnd.groove-vcard": {
                    "source": "iana",
                    "extensions": [
                      "vcg"
                    ],
                    "type": "application/vnd.groove-vcard",
                    "compressible": false
                  },
                  "application/vnd.hal+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.hal+json",
                    "extensions": []
                  },
                  "application/vnd.hal+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "hal"
                    ],
                    "type": "application/vnd.hal+xml"
                  },
                  "application/vnd.handheld-entertainment+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "zmm"
                    ],
                    "type": "application/vnd.handheld-entertainment+xml"
                  },
                  "application/vnd.hbci": {
                    "source": "iana",
                    "extensions": [
                      "hbci"
                    ],
                    "type": "application/vnd.hbci",
                    "compressible": false
                  },
                  "application/vnd.hc+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.hc+json",
                    "extensions": []
                  },
                  "application/vnd.hcl-bireports": {
                    "source": "iana",
                    "type": "application/vnd.hcl-bireports",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.hdt": {
                    "source": "iana",
                    "type": "application/vnd.hdt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.heroku+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.heroku+json",
                    "extensions": []
                  },
                  "application/vnd.hhe.lesson-player": {
                    "source": "iana",
                    "extensions": [
                      "les"
                    ],
                    "type": "application/vnd.hhe.lesson-player",
                    "compressible": false
                  },
                  "application/vnd.hp-hpgl": {
                    "source": "iana",
                    "extensions": [
                      "hpgl"
                    ],
                    "type": "application/vnd.hp-hpgl",
                    "compressible": false
                  },
                  "application/vnd.hp-hpid": {
                    "source": "iana",
                    "extensions": [
                      "hpid"
                    ],
                    "type": "application/vnd.hp-hpid",
                    "compressible": false
                  },
                  "application/vnd.hp-hps": {
                    "source": "iana",
                    "extensions": [
                      "hps"
                    ],
                    "type": "application/vnd.hp-hps",
                    "compressible": false
                  },
                  "application/vnd.hp-jlyt": {
                    "source": "iana",
                    "extensions": [
                      "jlt"
                    ],
                    "type": "application/vnd.hp-jlyt",
                    "compressible": false
                  },
                  "application/vnd.hp-pcl": {
                    "source": "iana",
                    "extensions": [
                      "pcl"
                    ],
                    "type": "application/vnd.hp-pcl",
                    "compressible": false
                  },
                  "application/vnd.hp-pclxl": {
                    "source": "iana",
                    "extensions": [
                      "pclxl"
                    ],
                    "type": "application/vnd.hp-pclxl",
                    "compressible": false
                  },
                  "application/vnd.httphone": {
                    "source": "iana",
                    "type": "application/vnd.httphone",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.hydrostatix.sof-data": {
                    "source": "iana",
                    "extensions": [
                      "sfd-hdstx"
                    ],
                    "type": "application/vnd.hydrostatix.sof-data",
                    "compressible": false
                  },
                  "application/vnd.hyper+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.hyper+json",
                    "extensions": []
                  },
                  "application/vnd.hyper-item+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.hyper-item+json",
                    "extensions": []
                  },
                  "application/vnd.hyperdrive+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.hyperdrive+json",
                    "extensions": []
                  },
                  "application/vnd.hzn-3d-crossword": {
                    "source": "iana",
                    "type": "application/vnd.hzn-3d-crossword",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ibm.afplinedata": {
                    "source": "iana",
                    "type": "application/vnd.ibm.afplinedata",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ibm.electronic-media": {
                    "source": "iana",
                    "type": "application/vnd.ibm.electronic-media",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ibm.minipay": {
                    "source": "iana",
                    "extensions": [
                      "mpy"
                    ],
                    "type": "application/vnd.ibm.minipay",
                    "compressible": false
                  },
                  "application/vnd.ibm.modcap": {
                    "source": "iana",
                    "extensions": [
                      "afp",
                      "listafp",
                      "list3820"
                    ],
                    "type": "application/vnd.ibm.modcap",
                    "compressible": false
                  },
                  "application/vnd.ibm.rights-management": {
                    "source": "iana",
                    "extensions": [
                      "irm"
                    ],
                    "type": "application/vnd.ibm.rights-management",
                    "compressible": false
                  },
                  "application/vnd.ibm.secure-container": {
                    "source": "iana",
                    "extensions": [
                      "sc"
                    ],
                    "type": "application/vnd.ibm.secure-container",
                    "compressible": false
                  },
                  "application/vnd.iccprofile": {
                    "source": "iana",
                    "extensions": [
                      "icc",
                      "icm"
                    ],
                    "type": "application/vnd.iccprofile",
                    "compressible": false
                  },
                  "application/vnd.ieee.1905": {
                    "source": "iana",
                    "type": "application/vnd.ieee.1905",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.igloader": {
                    "source": "iana",
                    "extensions": [
                      "igl"
                    ],
                    "type": "application/vnd.igloader",
                    "compressible": false
                  },
                  "application/vnd.imagemeter.folder+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.imagemeter.folder+zip",
                    "extensions": []
                  },
                  "application/vnd.imagemeter.image+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.imagemeter.image+zip",
                    "extensions": []
                  },
                  "application/vnd.immervision-ivp": {
                    "source": "iana",
                    "extensions": [
                      "ivp"
                    ],
                    "type": "application/vnd.immervision-ivp",
                    "compressible": false
                  },
                  "application/vnd.immervision-ivu": {
                    "source": "iana",
                    "extensions": [
                      "ivu"
                    ],
                    "type": "application/vnd.immervision-ivu",
                    "compressible": false
                  },
                  "application/vnd.ims.imsccv1p1": {
                    "source": "iana",
                    "type": "application/vnd.ims.imsccv1p1",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ims.imsccv1p2": {
                    "source": "iana",
                    "type": "application/vnd.ims.imsccv1p2",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ims.imsccv1p3": {
                    "source": "iana",
                    "type": "application/vnd.ims.imsccv1p3",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ims.lis.v2.result+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ims.lis.v2.result+json",
                    "extensions": []
                  },
                  "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ims.lti.v2.toolconsumerprofile+json",
                    "extensions": []
                  },
                  "application/vnd.ims.lti.v2.toolproxy+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ims.lti.v2.toolproxy+json",
                    "extensions": []
                  },
                  "application/vnd.ims.lti.v2.toolproxy.id+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ims.lti.v2.toolproxy.id+json",
                    "extensions": []
                  },
                  "application/vnd.ims.lti.v2.toolsettings+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ims.lti.v2.toolsettings+json",
                    "extensions": []
                  },
                  "application/vnd.ims.lti.v2.toolsettings.simple+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ims.lti.v2.toolsettings.simple+json",
                    "extensions": []
                  },
                  "application/vnd.informedcontrol.rms+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.informedcontrol.rms+xml",
                    "extensions": []
                  },
                  "application/vnd.informix-visionary": {
                    "source": "iana",
                    "type": "application/vnd.informix-visionary",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.infotech.project": {
                    "source": "iana",
                    "type": "application/vnd.infotech.project",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.infotech.project+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.infotech.project+xml",
                    "extensions": []
                  },
                  "application/vnd.innopath.wamp.notification": {
                    "source": "iana",
                    "type": "application/vnd.innopath.wamp.notification",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.insors.igm": {
                    "source": "iana",
                    "extensions": [
                      "igm"
                    ],
                    "type": "application/vnd.insors.igm",
                    "compressible": false
                  },
                  "application/vnd.intercon.formnet": {
                    "source": "iana",
                    "extensions": [
                      "xpw",
                      "xpx"
                    ],
                    "type": "application/vnd.intercon.formnet",
                    "compressible": false
                  },
                  "application/vnd.intergeo": {
                    "source": "iana",
                    "extensions": [
                      "i2g"
                    ],
                    "type": "application/vnd.intergeo",
                    "compressible": false
                  },
                  "application/vnd.intertrust.digibox": {
                    "source": "iana",
                    "type": "application/vnd.intertrust.digibox",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.intertrust.nncp": {
                    "source": "iana",
                    "type": "application/vnd.intertrust.nncp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.intu.qbo": {
                    "source": "iana",
                    "extensions": [
                      "qbo"
                    ],
                    "type": "application/vnd.intu.qbo",
                    "compressible": false
                  },
                  "application/vnd.intu.qfx": {
                    "source": "iana",
                    "extensions": [
                      "qfx"
                    ],
                    "type": "application/vnd.intu.qfx",
                    "compressible": false
                  },
                  "application/vnd.iptc.g2.catalogitem+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.iptc.g2.catalogitem+xml",
                    "extensions": []
                  },
                  "application/vnd.iptc.g2.conceptitem+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.iptc.g2.conceptitem+xml",
                    "extensions": []
                  },
                  "application/vnd.iptc.g2.knowledgeitem+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.iptc.g2.knowledgeitem+xml",
                    "extensions": []
                  },
                  "application/vnd.iptc.g2.newsitem+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.iptc.g2.newsitem+xml",
                    "extensions": []
                  },
                  "application/vnd.iptc.g2.newsmessage+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.iptc.g2.newsmessage+xml",
                    "extensions": []
                  },
                  "application/vnd.iptc.g2.packageitem+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.iptc.g2.packageitem+xml",
                    "extensions": []
                  },
                  "application/vnd.iptc.g2.planningitem+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.iptc.g2.planningitem+xml",
                    "extensions": []
                  },
                  "application/vnd.ipunplugged.rcprofile": {
                    "source": "iana",
                    "extensions": [
                      "rcprofile"
                    ],
                    "type": "application/vnd.ipunplugged.rcprofile",
                    "compressible": false
                  },
                  "application/vnd.irepository.package+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "irp"
                    ],
                    "type": "application/vnd.irepository.package+xml"
                  },
                  "application/vnd.is-xpr": {
                    "source": "iana",
                    "extensions": [
                      "xpr"
                    ],
                    "type": "application/vnd.is-xpr",
                    "compressible": false
                  },
                  "application/vnd.isac.fcs": {
                    "source": "iana",
                    "extensions": [
                      "fcs"
                    ],
                    "type": "application/vnd.isac.fcs",
                    "compressible": false
                  },
                  "application/vnd.iso11783-10+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.iso11783-10+zip",
                    "extensions": []
                  },
                  "application/vnd.jam": {
                    "source": "iana",
                    "extensions": [
                      "jam"
                    ],
                    "type": "application/vnd.jam",
                    "compressible": false
                  },
                  "application/vnd.japannet-directory-service": {
                    "source": "iana",
                    "type": "application/vnd.japannet-directory-service",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.japannet-jpnstore-wakeup": {
                    "source": "iana",
                    "type": "application/vnd.japannet-jpnstore-wakeup",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.japannet-payment-wakeup": {
                    "source": "iana",
                    "type": "application/vnd.japannet-payment-wakeup",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.japannet-registration": {
                    "source": "iana",
                    "type": "application/vnd.japannet-registration",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.japannet-registration-wakeup": {
                    "source": "iana",
                    "type": "application/vnd.japannet-registration-wakeup",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.japannet-setstore-wakeup": {
                    "source": "iana",
                    "type": "application/vnd.japannet-setstore-wakeup",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.japannet-verification": {
                    "source": "iana",
                    "type": "application/vnd.japannet-verification",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.japannet-verification-wakeup": {
                    "source": "iana",
                    "type": "application/vnd.japannet-verification-wakeup",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.jcp.javame.midlet-rms": {
                    "source": "iana",
                    "extensions": [
                      "rms"
                    ],
                    "type": "application/vnd.jcp.javame.midlet-rms",
                    "compressible": false
                  },
                  "application/vnd.jisp": {
                    "source": "iana",
                    "extensions": [
                      "jisp"
                    ],
                    "type": "application/vnd.jisp",
                    "compressible": false
                  },
                  "application/vnd.joost.joda-archive": {
                    "source": "iana",
                    "extensions": [
                      "joda"
                    ],
                    "type": "application/vnd.joost.joda-archive",
                    "compressible": false
                  },
                  "application/vnd.jsk.isdn-ngn": {
                    "source": "iana",
                    "type": "application/vnd.jsk.isdn-ngn",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.kahootz": {
                    "source": "iana",
                    "extensions": [
                      "ktz",
                      "ktr"
                    ],
                    "type": "application/vnd.kahootz",
                    "compressible": false
                  },
                  "application/vnd.kde.karbon": {
                    "source": "iana",
                    "extensions": [
                      "karbon"
                    ],
                    "type": "application/vnd.kde.karbon",
                    "compressible": false
                  },
                  "application/vnd.kde.kchart": {
                    "source": "iana",
                    "extensions": [
                      "chrt"
                    ],
                    "type": "application/vnd.kde.kchart",
                    "compressible": false
                  },
                  "application/vnd.kde.kformula": {
                    "source": "iana",
                    "extensions": [
                      "kfo"
                    ],
                    "type": "application/vnd.kde.kformula",
                    "compressible": false
                  },
                  "application/vnd.kde.kivio": {
                    "source": "iana",
                    "extensions": [
                      "flw"
                    ],
                    "type": "application/vnd.kde.kivio",
                    "compressible": false
                  },
                  "application/vnd.kde.kontour": {
                    "source": "iana",
                    "extensions": [
                      "kon"
                    ],
                    "type": "application/vnd.kde.kontour",
                    "compressible": false
                  },
                  "application/vnd.kde.kpresenter": {
                    "source": "iana",
                    "extensions": [
                      "kpr",
                      "kpt"
                    ],
                    "type": "application/vnd.kde.kpresenter",
                    "compressible": false
                  },
                  "application/vnd.kde.kspread": {
                    "source": "iana",
                    "extensions": [
                      "ksp"
                    ],
                    "type": "application/vnd.kde.kspread",
                    "compressible": false
                  },
                  "application/vnd.kde.kword": {
                    "source": "iana",
                    "extensions": [
                      "kwd",
                      "kwt"
                    ],
                    "type": "application/vnd.kde.kword",
                    "compressible": false
                  },
                  "application/vnd.kenameaapp": {
                    "source": "iana",
                    "extensions": [
                      "htke"
                    ],
                    "type": "application/vnd.kenameaapp",
                    "compressible": false
                  },
                  "application/vnd.kidspiration": {
                    "source": "iana",
                    "extensions": [
                      "kia"
                    ],
                    "type": "application/vnd.kidspiration",
                    "compressible": false
                  },
                  "application/vnd.kinar": {
                    "source": "iana",
                    "extensions": [
                      "kne",
                      "knp"
                    ],
                    "type": "application/vnd.kinar",
                    "compressible": false
                  },
                  "application/vnd.koan": {
                    "source": "iana",
                    "extensions": [
                      "skp",
                      "skd",
                      "skt",
                      "skm"
                    ],
                    "type": "application/vnd.koan",
                    "compressible": false
                  },
                  "application/vnd.kodak-descriptor": {
                    "source": "iana",
                    "extensions": [
                      "sse"
                    ],
                    "type": "application/vnd.kodak-descriptor",
                    "compressible": false
                  },
                  "application/vnd.las": {
                    "source": "iana",
                    "type": "application/vnd.las",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.las.las+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.las.las+json",
                    "extensions": []
                  },
                  "application/vnd.las.las+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "lasxml"
                    ],
                    "type": "application/vnd.las.las+xml"
                  },
                  "application/vnd.laszip": {
                    "source": "iana",
                    "type": "application/vnd.laszip",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.leap+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.leap+json",
                    "extensions": []
                  },
                  "application/vnd.liberty-request+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.liberty-request+xml",
                    "extensions": []
                  },
                  "application/vnd.llamagraphics.life-balance.desktop": {
                    "source": "iana",
                    "extensions": [
                      "lbd"
                    ],
                    "type": "application/vnd.llamagraphics.life-balance.desktop",
                    "compressible": false
                  },
                  "application/vnd.llamagraphics.life-balance.exchange+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "lbe"
                    ],
                    "type": "application/vnd.llamagraphics.life-balance.exchange+xml"
                  },
                  "application/vnd.logipipe.circuit+zip": {
                    "source": "iana",
                    "compressible": false,
                    "type": "application/vnd.logipipe.circuit+zip",
                    "extensions": []
                  },
                  "application/vnd.loom": {
                    "source": "iana",
                    "type": "application/vnd.loom",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.lotus-1-2-3": {
                    "source": "iana",
                    "extensions": [
                      "123"
                    ],
                    "type": "application/vnd.lotus-1-2-3",
                    "compressible": false
                  },
                  "application/vnd.lotus-approach": {
                    "source": "iana",
                    "extensions": [
                      "apr"
                    ],
                    "type": "application/vnd.lotus-approach",
                    "compressible": false
                  },
                  "application/vnd.lotus-freelance": {
                    "source": "iana",
                    "extensions": [
                      "pre"
                    ],
                    "type": "application/vnd.lotus-freelance",
                    "compressible": false
                  },
                  "application/vnd.lotus-notes": {
                    "source": "iana",
                    "extensions": [
                      "nsf"
                    ],
                    "type": "application/vnd.lotus-notes",
                    "compressible": false
                  },
                  "application/vnd.lotus-organizer": {
                    "source": "iana",
                    "extensions": [
                      "org"
                    ],
                    "type": "application/vnd.lotus-organizer",
                    "compressible": false
                  },
                  "application/vnd.lotus-screencam": {
                    "source": "iana",
                    "extensions": [
                      "scm"
                    ],
                    "type": "application/vnd.lotus-screencam",
                    "compressible": false
                  },
                  "application/vnd.lotus-wordpro": {
                    "source": "iana",
                    "extensions": [
                      "lwp"
                    ],
                    "type": "application/vnd.lotus-wordpro",
                    "compressible": false
                  },
                  "application/vnd.macports.portpkg": {
                    "source": "iana",
                    "extensions": [
                      "portpkg"
                    ],
                    "type": "application/vnd.macports.portpkg",
                    "compressible": false
                  },
                  "application/vnd.mapbox-vector-tile": {
                    "source": "iana",
                    "type": "application/vnd.mapbox-vector-tile",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.marlin.drm.actiontoken+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.marlin.drm.actiontoken+xml",
                    "extensions": []
                  },
                  "application/vnd.marlin.drm.conftoken+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.marlin.drm.conftoken+xml",
                    "extensions": []
                  },
                  "application/vnd.marlin.drm.license+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.marlin.drm.license+xml",
                    "extensions": []
                  },
                  "application/vnd.marlin.drm.mdcf": {
                    "source": "iana",
                    "type": "application/vnd.marlin.drm.mdcf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.mason+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.mason+json",
                    "extensions": []
                  },
                  "application/vnd.maxmind.maxmind-db": {
                    "source": "iana",
                    "type": "application/vnd.maxmind.maxmind-db",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.mcd": {
                    "source": "iana",
                    "extensions": [
                      "mcd"
                    ],
                    "type": "application/vnd.mcd",
                    "compressible": false
                  },
                  "application/vnd.medcalcdata": {
                    "source": "iana",
                    "extensions": [
                      "mc1"
                    ],
                    "type": "application/vnd.medcalcdata",
                    "compressible": false
                  },
                  "application/vnd.mediastation.cdkey": {
                    "source": "iana",
                    "extensions": [
                      "cdkey"
                    ],
                    "type": "application/vnd.mediastation.cdkey",
                    "compressible": false
                  },
                  "application/vnd.meridian-slingshot": {
                    "source": "iana",
                    "type": "application/vnd.meridian-slingshot",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.mfer": {
                    "source": "iana",
                    "extensions": [
                      "mwf"
                    ],
                    "type": "application/vnd.mfer",
                    "compressible": false
                  },
                  "application/vnd.mfmp": {
                    "source": "iana",
                    "extensions": [
                      "mfm"
                    ],
                    "type": "application/vnd.mfmp",
                    "compressible": false
                  },
                  "application/vnd.micro+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.micro+json",
                    "extensions": []
                  },
                  "application/vnd.micrografx.flo": {
                    "source": "iana",
                    "extensions": [
                      "flo"
                    ],
                    "type": "application/vnd.micrografx.flo",
                    "compressible": false
                  },
                  "application/vnd.micrografx.igx": {
                    "source": "iana",
                    "extensions": [
                      "igx"
                    ],
                    "type": "application/vnd.micrografx.igx",
                    "compressible": false
                  },
                  "application/vnd.microsoft.portable-executable": {
                    "source": "iana",
                    "type": "application/vnd.microsoft.portable-executable",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.microsoft.windows.thumbnail-cache": {
                    "source": "iana",
                    "type": "application/vnd.microsoft.windows.thumbnail-cache",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.miele+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.miele+json",
                    "extensions": []
                  },
                  "application/vnd.mif": {
                    "source": "iana",
                    "extensions": [
                      "mif"
                    ],
                    "type": "application/vnd.mif",
                    "compressible": false
                  },
                  "application/vnd.minisoft-hp3000-save": {
                    "source": "iana",
                    "type": "application/vnd.minisoft-hp3000-save",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.mitsubishi.misty-guard.trustweb": {
                    "source": "iana",
                    "type": "application/vnd.mitsubishi.misty-guard.trustweb",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.mobius.daf": {
                    "source": "iana",
                    "extensions": [
                      "daf"
                    ],
                    "type": "application/vnd.mobius.daf",
                    "compressible": false
                  },
                  "application/vnd.mobius.dis": {
                    "source": "iana",
                    "extensions": [
                      "dis"
                    ],
                    "type": "application/vnd.mobius.dis",
                    "compressible": false
                  },
                  "application/vnd.mobius.mbk": {
                    "source": "iana",
                    "extensions": [
                      "mbk"
                    ],
                    "type": "application/vnd.mobius.mbk",
                    "compressible": false
                  },
                  "application/vnd.mobius.mqy": {
                    "source": "iana",
                    "extensions": [
                      "mqy"
                    ],
                    "type": "application/vnd.mobius.mqy",
                    "compressible": false
                  },
                  "application/vnd.mobius.msl": {
                    "source": "iana",
                    "extensions": [
                      "msl"
                    ],
                    "type": "application/vnd.mobius.msl",
                    "compressible": false
                  },
                  "application/vnd.mobius.plc": {
                    "source": "iana",
                    "extensions": [
                      "plc"
                    ],
                    "type": "application/vnd.mobius.plc",
                    "compressible": false
                  },
                  "application/vnd.mobius.txf": {
                    "source": "iana",
                    "extensions": [
                      "txf"
                    ],
                    "type": "application/vnd.mobius.txf",
                    "compressible": false
                  },
                  "application/vnd.mophun.application": {
                    "source": "iana",
                    "extensions": [
                      "mpn"
                    ],
                    "type": "application/vnd.mophun.application",
                    "compressible": false
                  },
                  "application/vnd.mophun.certificate": {
                    "source": "iana",
                    "extensions": [
                      "mpc"
                    ],
                    "type": "application/vnd.mophun.certificate",
                    "compressible": false
                  },
                  "application/vnd.motorola.flexsuite": {
                    "source": "iana",
                    "type": "application/vnd.motorola.flexsuite",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.motorola.flexsuite.adsi": {
                    "source": "iana",
                    "type": "application/vnd.motorola.flexsuite.adsi",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.motorola.flexsuite.fis": {
                    "source": "iana",
                    "type": "application/vnd.motorola.flexsuite.fis",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.motorola.flexsuite.gotap": {
                    "source": "iana",
                    "type": "application/vnd.motorola.flexsuite.gotap",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.motorola.flexsuite.kmr": {
                    "source": "iana",
                    "type": "application/vnd.motorola.flexsuite.kmr",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.motorola.flexsuite.ttc": {
                    "source": "iana",
                    "type": "application/vnd.motorola.flexsuite.ttc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.motorola.flexsuite.wem": {
                    "source": "iana",
                    "type": "application/vnd.motorola.flexsuite.wem",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.motorola.iprm": {
                    "source": "iana",
                    "type": "application/vnd.motorola.iprm",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.mozilla.xul+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xul"
                    ],
                    "type": "application/vnd.mozilla.xul+xml"
                  },
                  "application/vnd.ms-3mfdocument": {
                    "source": "iana",
                    "type": "application/vnd.ms-3mfdocument",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-artgalry": {
                    "source": "iana",
                    "extensions": [
                      "cil"
                    ],
                    "type": "application/vnd.ms-artgalry",
                    "compressible": false
                  },
                  "application/vnd.ms-asf": {
                    "source": "iana",
                    "type": "application/vnd.ms-asf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-cab-compressed": {
                    "source": "iana",
                    "extensions": [
                      "cab"
                    ],
                    "type": "application/vnd.ms-cab-compressed",
                    "compressible": false
                  },
                  "application/vnd.ms-color.iccprofile": {
                    "source": "apache",
                    "type": "application/vnd.ms-color.iccprofile",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-excel": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "xls",
                      "xlm",
                      "xla",
                      "xlc",
                      "xlt",
                      "xlw"
                    ],
                    "type": "application/vnd.ms-excel"
                  },
                  "application/vnd.ms-excel.addin.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "xlam"
                    ],
                    "type": "application/vnd.ms-excel.addin.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "xlsb"
                    ],
                    "type": "application/vnd.ms-excel.sheet.binary.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-excel.sheet.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "xlsm"
                    ],
                    "type": "application/vnd.ms-excel.sheet.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-excel.template.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "xltm"
                    ],
                    "type": "application/vnd.ms-excel.template.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-fontobject": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "eot"
                    ],
                    "type": "application/vnd.ms-fontobject"
                  },
                  "application/vnd.ms-htmlhelp": {
                    "source": "iana",
                    "extensions": [
                      "chm"
                    ],
                    "type": "application/vnd.ms-htmlhelp",
                    "compressible": false
                  },
                  "application/vnd.ms-ims": {
                    "source": "iana",
                    "extensions": [
                      "ims"
                    ],
                    "type": "application/vnd.ms-ims",
                    "compressible": false
                  },
                  "application/vnd.ms-lrm": {
                    "source": "iana",
                    "extensions": [
                      "lrm"
                    ],
                    "type": "application/vnd.ms-lrm",
                    "compressible": false
                  },
                  "application/vnd.ms-office.activex+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ms-office.activex+xml",
                    "extensions": []
                  },
                  "application/vnd.ms-officetheme": {
                    "source": "iana",
                    "extensions": [
                      "thmx"
                    ],
                    "type": "application/vnd.ms-officetheme",
                    "compressible": false
                  },
                  "application/vnd.ms-opentype": {
                    "source": "apache",
                    "compressible": true,
                    "type": "application/vnd.ms-opentype",
                    "extensions": []
                  },
                  "application/vnd.ms-outlook": {
                    "compressible": false,
                    "extensions": [
                      "msg"
                    ],
                    "type": "application/vnd.ms-outlook",
                    "source": "mime-db"
                  },
                  "application/vnd.ms-package.obfuscated-opentype": {
                    "source": "apache",
                    "type": "application/vnd.ms-package.obfuscated-opentype",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-pki.seccat": {
                    "source": "apache",
                    "extensions": [
                      "cat"
                    ],
                    "type": "application/vnd.ms-pki.seccat",
                    "compressible": false
                  },
                  "application/vnd.ms-pki.stl": {
                    "source": "apache",
                    "extensions": [
                      "stl"
                    ],
                    "type": "application/vnd.ms-pki.stl",
                    "compressible": false
                  },
                  "application/vnd.ms-playready.initiator+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ms-playready.initiator+xml",
                    "extensions": []
                  },
                  "application/vnd.ms-powerpoint": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "ppt",
                      "pps",
                      "pot"
                    ],
                    "type": "application/vnd.ms-powerpoint"
                  },
                  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "ppam"
                    ],
                    "type": "application/vnd.ms-powerpoint.addin.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "pptm"
                    ],
                    "type": "application/vnd.ms-powerpoint.presentation.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "sldm"
                    ],
                    "type": "application/vnd.ms-powerpoint.slide.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "ppsm"
                    ],
                    "type": "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-powerpoint.template.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "potm"
                    ],
                    "type": "application/vnd.ms-powerpoint.template.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-printdevicecapabilities+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ms-printdevicecapabilities+xml",
                    "extensions": []
                  },
                  "application/vnd.ms-printing.printticket+xml": {
                    "source": "apache",
                    "compressible": true,
                    "type": "application/vnd.ms-printing.printticket+xml",
                    "extensions": []
                  },
                  "application/vnd.ms-printschematicket+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.ms-printschematicket+xml",
                    "extensions": []
                  },
                  "application/vnd.ms-project": {
                    "source": "iana",
                    "extensions": [
                      "mpp",
                      "mpt"
                    ],
                    "type": "application/vnd.ms-project",
                    "compressible": false
                  },
                  "application/vnd.ms-tnef": {
                    "source": "iana",
                    "type": "application/vnd.ms-tnef",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-windows.devicepairing": {
                    "source": "iana",
                    "type": "application/vnd.ms-windows.devicepairing",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-windows.nwprinting.oob": {
                    "source": "iana",
                    "type": "application/vnd.ms-windows.nwprinting.oob",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-windows.printerpairing": {
                    "source": "iana",
                    "type": "application/vnd.ms-windows.printerpairing",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-windows.wsd.oob": {
                    "source": "iana",
                    "type": "application/vnd.ms-windows.wsd.oob",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-wmdrm.lic-chlg-req": {
                    "source": "iana",
                    "type": "application/vnd.ms-wmdrm.lic-chlg-req",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-wmdrm.lic-resp": {
                    "source": "iana",
                    "type": "application/vnd.ms-wmdrm.lic-resp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-wmdrm.meter-chlg-req": {
                    "source": "iana",
                    "type": "application/vnd.ms-wmdrm.meter-chlg-req",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-wmdrm.meter-resp": {
                    "source": "iana",
                    "type": "application/vnd.ms-wmdrm.meter-resp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ms-word.document.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "docm"
                    ],
                    "type": "application/vnd.ms-word.document.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-word.template.macroenabled.12": {
                    "source": "iana",
                    "extensions": [
                      "dotm"
                    ],
                    "type": "application/vnd.ms-word.template.macroenabled.12",
                    "compressible": false
                  },
                  "application/vnd.ms-works": {
                    "source": "iana",
                    "extensions": [
                      "wps",
                      "wks",
                      "wcm",
                      "wdb"
                    ],
                    "type": "application/vnd.ms-works",
                    "compressible": false
                  },
                  "application/vnd.ms-wpl": {
                    "source": "iana",
                    "extensions": [
                      "wpl"
                    ],
                    "type": "application/vnd.ms-wpl",
                    "compressible": false
                  },
                  "application/vnd.ms-xpsdocument": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "xps"
                    ],
                    "type": "application/vnd.ms-xpsdocument"
                  },
                  "application/vnd.msa-disk-image": {
                    "source": "iana",
                    "type": "application/vnd.msa-disk-image",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.mseq": {
                    "source": "iana",
                    "extensions": [
                      "mseq"
                    ],
                    "type": "application/vnd.mseq",
                    "compressible": false
                  },
                  "application/vnd.msign": {
                    "source": "iana",
                    "type": "application/vnd.msign",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.multiad.creator": {
                    "source": "iana",
                    "type": "application/vnd.multiad.creator",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.multiad.creator.cif": {
                    "source": "iana",
                    "type": "application/vnd.multiad.creator.cif",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.music-niff": {
                    "source": "iana",
                    "type": "application/vnd.music-niff",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.musician": {
                    "source": "iana",
                    "extensions": [
                      "mus"
                    ],
                    "type": "application/vnd.musician",
                    "compressible": false
                  },
                  "application/vnd.muvee.style": {
                    "source": "iana",
                    "extensions": [
                      "msty"
                    ],
                    "type": "application/vnd.muvee.style",
                    "compressible": false
                  },
                  "application/vnd.mynfc": {
                    "source": "iana",
                    "extensions": [
                      "taglet"
                    ],
                    "type": "application/vnd.mynfc",
                    "compressible": false
                  },
                  "application/vnd.ncd.control": {
                    "source": "iana",
                    "type": "application/vnd.ncd.control",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ncd.reference": {
                    "source": "iana",
                    "type": "application/vnd.ncd.reference",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nearst.inv+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.nearst.inv+json",
                    "extensions": []
                  },
                  "application/vnd.nervana": {
                    "source": "iana",
                    "type": "application/vnd.nervana",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.netfpx": {
                    "source": "iana",
                    "type": "application/vnd.netfpx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.neurolanguage.nlu": {
                    "source": "iana",
                    "extensions": [
                      "nlu"
                    ],
                    "type": "application/vnd.neurolanguage.nlu",
                    "compressible": false
                  },
                  "application/vnd.nimn": {
                    "source": "iana",
                    "type": "application/vnd.nimn",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nintendo.nitro.rom": {
                    "source": "iana",
                    "type": "application/vnd.nintendo.nitro.rom",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nintendo.snes.rom": {
                    "source": "iana",
                    "type": "application/vnd.nintendo.snes.rom",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nitf": {
                    "source": "iana",
                    "extensions": [
                      "ntf",
                      "nitf"
                    ],
                    "type": "application/vnd.nitf",
                    "compressible": false
                  },
                  "application/vnd.noblenet-directory": {
                    "source": "iana",
                    "extensions": [
                      "nnd"
                    ],
                    "type": "application/vnd.noblenet-directory",
                    "compressible": false
                  },
                  "application/vnd.noblenet-sealer": {
                    "source": "iana",
                    "extensions": [
                      "nns"
                    ],
                    "type": "application/vnd.noblenet-sealer",
                    "compressible": false
                  },
                  "application/vnd.noblenet-web": {
                    "source": "iana",
                    "extensions": [
                      "nnw"
                    ],
                    "type": "application/vnd.noblenet-web",
                    "compressible": false
                  },
                  "application/vnd.nokia.catalogs": {
                    "source": "iana",
                    "type": "application/vnd.nokia.catalogs",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nokia.conml+wbxml": {
                    "source": "iana",
                    "type": "application/vnd.nokia.conml+wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nokia.conml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.nokia.conml+xml",
                    "extensions": []
                  },
                  "application/vnd.nokia.iptv.config+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.nokia.iptv.config+xml",
                    "extensions": []
                  },
                  "application/vnd.nokia.isds-radio-presets": {
                    "source": "iana",
                    "type": "application/vnd.nokia.isds-radio-presets",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nokia.landmark+wbxml": {
                    "source": "iana",
                    "type": "application/vnd.nokia.landmark+wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nokia.landmark+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.nokia.landmark+xml",
                    "extensions": []
                  },
                  "application/vnd.nokia.landmarkcollection+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.nokia.landmarkcollection+xml",
                    "extensions": []
                  },
                  "application/vnd.nokia.n-gage.ac+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.nokia.n-gage.ac+xml",
                    "extensions": []
                  },
                  "application/vnd.nokia.n-gage.data": {
                    "source": "iana",
                    "extensions": [
                      "ngdat"
                    ],
                    "type": "application/vnd.nokia.n-gage.data",
                    "compressible": false
                  },
                  "application/vnd.nokia.n-gage.symbian.install": {
                    "source": "iana",
                    "extensions": [
                      "n-gage"
                    ],
                    "type": "application/vnd.nokia.n-gage.symbian.install",
                    "compressible": false
                  },
                  "application/vnd.nokia.ncd": {
                    "source": "iana",
                    "type": "application/vnd.nokia.ncd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nokia.pcd+wbxml": {
                    "source": "iana",
                    "type": "application/vnd.nokia.pcd+wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.nokia.pcd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.nokia.pcd+xml",
                    "extensions": []
                  },
                  "application/vnd.nokia.radio-preset": {
                    "source": "iana",
                    "extensions": [
                      "rpst"
                    ],
                    "type": "application/vnd.nokia.radio-preset",
                    "compressible": false
                  },
                  "application/vnd.nokia.radio-presets": {
                    "source": "iana",
                    "extensions": [
                      "rpss"
                    ],
                    "type": "application/vnd.nokia.radio-presets",
                    "compressible": false
                  },
                  "application/vnd.novadigm.edm": {
                    "source": "iana",
                    "extensions": [
                      "edm"
                    ],
                    "type": "application/vnd.novadigm.edm",
                    "compressible": false
                  },
                  "application/vnd.novadigm.edx": {
                    "source": "iana",
                    "extensions": [
                      "edx"
                    ],
                    "type": "application/vnd.novadigm.edx",
                    "compressible": false
                  },
                  "application/vnd.novadigm.ext": {
                    "source": "iana",
                    "extensions": [
                      "ext"
                    ],
                    "type": "application/vnd.novadigm.ext",
                    "compressible": false
                  },
                  "application/vnd.ntt-local.content-share": {
                    "source": "iana",
                    "type": "application/vnd.ntt-local.content-share",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ntt-local.file-transfer": {
                    "source": "iana",
                    "type": "application/vnd.ntt-local.file-transfer",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ntt-local.ogw_remote-access": {
                    "source": "iana",
                    "type": "application/vnd.ntt-local.ogw_remote-access",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ntt-local.sip-ta_remote": {
                    "source": "iana",
                    "type": "application/vnd.ntt-local.sip-ta_remote",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ntt-local.sip-ta_tcp_stream": {
                    "source": "iana",
                    "type": "application/vnd.ntt-local.sip-ta_tcp_stream",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.chart": {
                    "source": "iana",
                    "extensions": [
                      "odc"
                    ],
                    "type": "application/vnd.oasis.opendocument.chart",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.chart-template": {
                    "source": "iana",
                    "extensions": [
                      "otc"
                    ],
                    "type": "application/vnd.oasis.opendocument.chart-template",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.database": {
                    "source": "iana",
                    "extensions": [
                      "odb"
                    ],
                    "type": "application/vnd.oasis.opendocument.database",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.formula": {
                    "source": "iana",
                    "extensions": [
                      "odf"
                    ],
                    "type": "application/vnd.oasis.opendocument.formula",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.formula-template": {
                    "source": "iana",
                    "extensions": [
                      "odft"
                    ],
                    "type": "application/vnd.oasis.opendocument.formula-template",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.graphics": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "odg"
                    ],
                    "type": "application/vnd.oasis.opendocument.graphics"
                  },
                  "application/vnd.oasis.opendocument.graphics-template": {
                    "source": "iana",
                    "extensions": [
                      "otg"
                    ],
                    "type": "application/vnd.oasis.opendocument.graphics-template",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.image": {
                    "source": "iana",
                    "extensions": [
                      "odi"
                    ],
                    "type": "application/vnd.oasis.opendocument.image",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.image-template": {
                    "source": "iana",
                    "extensions": [
                      "oti"
                    ],
                    "type": "application/vnd.oasis.opendocument.image-template",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.presentation": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "odp"
                    ],
                    "type": "application/vnd.oasis.opendocument.presentation"
                  },
                  "application/vnd.oasis.opendocument.presentation-template": {
                    "source": "iana",
                    "extensions": [
                      "otp"
                    ],
                    "type": "application/vnd.oasis.opendocument.presentation-template",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.spreadsheet": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "ods"
                    ],
                    "type": "application/vnd.oasis.opendocument.spreadsheet"
                  },
                  "application/vnd.oasis.opendocument.spreadsheet-template": {
                    "source": "iana",
                    "extensions": [
                      "ots"
                    ],
                    "type": "application/vnd.oasis.opendocument.spreadsheet-template",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.text": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "odt"
                    ],
                    "type": "application/vnd.oasis.opendocument.text"
                  },
                  "application/vnd.oasis.opendocument.text-master": {
                    "source": "iana",
                    "extensions": [
                      "odm"
                    ],
                    "type": "application/vnd.oasis.opendocument.text-master",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.text-template": {
                    "source": "iana",
                    "extensions": [
                      "ott"
                    ],
                    "type": "application/vnd.oasis.opendocument.text-template",
                    "compressible": false
                  },
                  "application/vnd.oasis.opendocument.text-web": {
                    "source": "iana",
                    "extensions": [
                      "oth"
                    ],
                    "type": "application/vnd.oasis.opendocument.text-web",
                    "compressible": false
                  },
                  "application/vnd.obn": {
                    "source": "iana",
                    "type": "application/vnd.obn",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ocf+cbor": {
                    "source": "iana",
                    "type": "application/vnd.ocf+cbor",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oftn.l10n+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oftn.l10n+json",
                    "extensions": []
                  },
                  "application/vnd.oipf.contentaccessdownload+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.contentaccessdownload+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.contentaccessstreaming+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.contentaccessstreaming+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.cspg-hexbinary": {
                    "source": "iana",
                    "type": "application/vnd.oipf.cspg-hexbinary",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oipf.dae.svg+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.dae.svg+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.dae.xhtml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.dae.xhtml+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.mippvcontrolmessage+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.mippvcontrolmessage+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.pae.gem": {
                    "source": "iana",
                    "type": "application/vnd.oipf.pae.gem",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oipf.spdiscovery+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.spdiscovery+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.spdlist+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.spdlist+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.ueprofile+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.ueprofile+xml",
                    "extensions": []
                  },
                  "application/vnd.oipf.userprofile+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oipf.userprofile+xml",
                    "extensions": []
                  },
                  "application/vnd.olpc-sugar": {
                    "source": "iana",
                    "extensions": [
                      "xo"
                    ],
                    "type": "application/vnd.olpc-sugar",
                    "compressible": false
                  },
                  "application/vnd.oma-scws-config": {
                    "source": "iana",
                    "type": "application/vnd.oma-scws-config",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma-scws-http-request": {
                    "source": "iana",
                    "type": "application/vnd.oma-scws-http-request",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma-scws-http-response": {
                    "source": "iana",
                    "type": "application/vnd.oma-scws-http-response",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.bcast.associated-procedure-parameter+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.bcast.drm-trigger+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.bcast.drm-trigger+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.bcast.imd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.bcast.imd+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.bcast.ltkm": {
                    "source": "iana",
                    "type": "application/vnd.oma.bcast.ltkm",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.bcast.notification+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.bcast.notification+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.bcast.provisioningtrigger": {
                    "source": "iana",
                    "type": "application/vnd.oma.bcast.provisioningtrigger",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.bcast.sgboot": {
                    "source": "iana",
                    "type": "application/vnd.oma.bcast.sgboot",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.bcast.sgdd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.bcast.sgdd+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.bcast.sgdu": {
                    "source": "iana",
                    "type": "application/vnd.oma.bcast.sgdu",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.bcast.simple-symbol-container": {
                    "source": "iana",
                    "type": "application/vnd.oma.bcast.simple-symbol-container",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.bcast.smartcard-trigger+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.bcast.smartcard-trigger+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.bcast.sprov+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.bcast.sprov+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.bcast.stkm": {
                    "source": "iana",
                    "type": "application/vnd.oma.bcast.stkm",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.cab-address-book+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.cab-address-book+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.cab-feature-handler+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.cab-feature-handler+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.cab-pcc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.cab-pcc+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.cab-subs-invite+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.cab-subs-invite+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.cab-user-prefs+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.cab-user-prefs+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.dcd": {
                    "source": "iana",
                    "type": "application/vnd.oma.dcd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.dcdc": {
                    "source": "iana",
                    "type": "application/vnd.oma.dcdc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.dd2+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "dd2"
                    ],
                    "type": "application/vnd.oma.dd2+xml"
                  },
                  "application/vnd.oma.drm.risd+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.drm.risd+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.group-usage-list+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.group-usage-list+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.lwm2m+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.lwm2m+json",
                    "extensions": []
                  },
                  "application/vnd.oma.lwm2m+tlv": {
                    "source": "iana",
                    "type": "application/vnd.oma.lwm2m+tlv",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.pal+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.pal+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.poc.detailed-progress-report+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.poc.detailed-progress-report+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.poc.final-report+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.poc.final-report+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.poc.groups+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.poc.groups+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.poc.invocation-descriptor+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.poc.invocation-descriptor+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.poc.optimized-progress-report+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.poc.optimized-progress-report+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.push": {
                    "source": "iana",
                    "type": "application/vnd.oma.push",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.oma.scidm.messages+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.scidm.messages+xml",
                    "extensions": []
                  },
                  "application/vnd.oma.xcap-directory+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oma.xcap-directory+xml",
                    "extensions": []
                  },
                  "application/vnd.omads-email+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.omads-email+xml",
                    "extensions": []
                  },
                  "application/vnd.omads-file+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.omads-file+xml",
                    "extensions": []
                  },
                  "application/vnd.omads-folder+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.omads-folder+xml",
                    "extensions": []
                  },
                  "application/vnd.omaloc-supl-init": {
                    "source": "iana",
                    "type": "application/vnd.omaloc-supl-init",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.onepager": {
                    "source": "iana",
                    "type": "application/vnd.onepager",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.onepagertamp": {
                    "source": "iana",
                    "type": "application/vnd.onepagertamp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.onepagertamx": {
                    "source": "iana",
                    "type": "application/vnd.onepagertamx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.onepagertat": {
                    "source": "iana",
                    "type": "application/vnd.onepagertat",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.onepagertatp": {
                    "source": "iana",
                    "type": "application/vnd.onepagertatp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.onepagertatx": {
                    "source": "iana",
                    "type": "application/vnd.onepagertatx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.openblox.game+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openblox.game+xml",
                    "extensions": []
                  },
                  "application/vnd.openblox.game-binary": {
                    "source": "iana",
                    "type": "application/vnd.openblox.game-binary",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.openeye.oeb": {
                    "source": "iana",
                    "type": "application/vnd.openeye.oeb",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.openofficeorg.extension": {
                    "source": "apache",
                    "extensions": [
                      "oxt"
                    ],
                    "type": "application/vnd.openofficeorg.extension",
                    "compressible": false
                  },
                  "application/vnd.openstreetmap.data+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openstreetmap.data+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.custom-properties+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.customxmlproperties+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.drawing+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.drawing+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.drawingml.chart+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.extended-properties+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.comments+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "pptx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
                    "source": "iana",
                    "extensions": [
                      "sldx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.slide",
                    "compressible": false
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.slide+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
                    "source": "iana",
                    "extensions": [
                      "ppsx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
                    "compressible": false
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.tags+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.template": {
                    "source": "iana",
                    "extensions": [
                      "potx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.template",
                    "compressible": false
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "xlsx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
                    "source": "iana",
                    "extensions": [
                      "xltx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
                    "compressible": false
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.theme+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.theme+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.themeoverride+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.vmldrawing": {
                    "source": "iana",
                    "type": "application/vnd.openxmlformats-officedocument.vmldrawing",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "docx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
                    "source": "iana",
                    "extensions": [
                      "dotx"
                    ],
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
                    "compressible": false
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-package.core-properties+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-package.core-properties+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml",
                    "extensions": []
                  },
                  "application/vnd.openxmlformats-package.relationships+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.openxmlformats-package.relationships+xml",
                    "extensions": []
                  },
                  "application/vnd.oracle.resource+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.oracle.resource+json",
                    "extensions": []
                  },
                  "application/vnd.orange.indata": {
                    "source": "iana",
                    "type": "application/vnd.orange.indata",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.osa.netdeploy": {
                    "source": "iana",
                    "type": "application/vnd.osa.netdeploy",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.osgeo.mapguide.package": {
                    "source": "iana",
                    "extensions": [
                      "mgp"
                    ],
                    "type": "application/vnd.osgeo.mapguide.package",
                    "compressible": false
                  },
                  "application/vnd.osgi.bundle": {
                    "source": "iana",
                    "type": "application/vnd.osgi.bundle",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.osgi.dp": {
                    "source": "iana",
                    "extensions": [
                      "dp"
                    ],
                    "type": "application/vnd.osgi.dp",
                    "compressible": false
                  },
                  "application/vnd.osgi.subsystem": {
                    "source": "iana",
                    "extensions": [
                      "esa"
                    ],
                    "type": "application/vnd.osgi.subsystem",
                    "compressible": false
                  },
                  "application/vnd.otps.ct-kip+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.otps.ct-kip+xml",
                    "extensions": []
                  },
                  "application/vnd.oxli.countgraph": {
                    "source": "iana",
                    "type": "application/vnd.oxli.countgraph",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.pagerduty+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.pagerduty+json",
                    "extensions": []
                  },
                  "application/vnd.palm": {
                    "source": "iana",
                    "extensions": [
                      "pdb",
                      "pqa",
                      "oprc"
                    ],
                    "type": "application/vnd.palm",
                    "compressible": false
                  },
                  "application/vnd.panoply": {
                    "source": "iana",
                    "type": "application/vnd.panoply",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.paos.xml": {
                    "source": "iana",
                    "type": "application/vnd.paos.xml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.patentdive": {
                    "source": "iana",
                    "type": "application/vnd.patentdive",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.patientecommsdoc": {
                    "source": "iana",
                    "type": "application/vnd.patientecommsdoc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.pawaafile": {
                    "source": "iana",
                    "extensions": [
                      "paw"
                    ],
                    "type": "application/vnd.pawaafile",
                    "compressible": false
                  },
                  "application/vnd.pcos": {
                    "source": "iana",
                    "type": "application/vnd.pcos",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.pg.format": {
                    "source": "iana",
                    "extensions": [
                      "str"
                    ],
                    "type": "application/vnd.pg.format",
                    "compressible": false
                  },
                  "application/vnd.pg.osasli": {
                    "source": "iana",
                    "extensions": [
                      "ei6"
                    ],
                    "type": "application/vnd.pg.osasli",
                    "compressible": false
                  },
                  "application/vnd.piaccess.application-licence": {
                    "source": "iana",
                    "type": "application/vnd.piaccess.application-licence",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.picsel": {
                    "source": "iana",
                    "extensions": [
                      "efif"
                    ],
                    "type": "application/vnd.picsel",
                    "compressible": false
                  },
                  "application/vnd.pmi.widget": {
                    "source": "iana",
                    "extensions": [
                      "wg"
                    ],
                    "type": "application/vnd.pmi.widget",
                    "compressible": false
                  },
                  "application/vnd.poc.group-advertisement+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.poc.group-advertisement+xml",
                    "extensions": []
                  },
                  "application/vnd.pocketlearn": {
                    "source": "iana",
                    "extensions": [
                      "plf"
                    ],
                    "type": "application/vnd.pocketlearn",
                    "compressible": false
                  },
                  "application/vnd.powerbuilder6": {
                    "source": "iana",
                    "extensions": [
                      "pbd"
                    ],
                    "type": "application/vnd.powerbuilder6",
                    "compressible": false
                  },
                  "application/vnd.powerbuilder6-s": {
                    "source": "iana",
                    "type": "application/vnd.powerbuilder6-s",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.powerbuilder7": {
                    "source": "iana",
                    "type": "application/vnd.powerbuilder7",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.powerbuilder7-s": {
                    "source": "iana",
                    "type": "application/vnd.powerbuilder7-s",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.powerbuilder75": {
                    "source": "iana",
                    "type": "application/vnd.powerbuilder75",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.powerbuilder75-s": {
                    "source": "iana",
                    "type": "application/vnd.powerbuilder75-s",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.preminet": {
                    "source": "iana",
                    "type": "application/vnd.preminet",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.previewsystems.box": {
                    "source": "iana",
                    "extensions": [
                      "box"
                    ],
                    "type": "application/vnd.previewsystems.box",
                    "compressible": false
                  },
                  "application/vnd.proteus.magazine": {
                    "source": "iana",
                    "extensions": [
                      "mgz"
                    ],
                    "type": "application/vnd.proteus.magazine",
                    "compressible": false
                  },
                  "application/vnd.psfs": {
                    "source": "iana",
                    "type": "application/vnd.psfs",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.publishare-delta-tree": {
                    "source": "iana",
                    "extensions": [
                      "qps"
                    ],
                    "type": "application/vnd.publishare-delta-tree",
                    "compressible": false
                  },
                  "application/vnd.pvi.ptid1": {
                    "source": "iana",
                    "extensions": [
                      "ptid"
                    ],
                    "type": "application/vnd.pvi.ptid1",
                    "compressible": false
                  },
                  "application/vnd.pwg-multiplexed": {
                    "source": "iana",
                    "type": "application/vnd.pwg-multiplexed",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.pwg-xhtml-print+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.pwg-xhtml-print+xml",
                    "extensions": []
                  },
                  "application/vnd.qualcomm.brew-app-res": {
                    "source": "iana",
                    "type": "application/vnd.qualcomm.brew-app-res",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.quarantainenet": {
                    "source": "iana",
                    "type": "application/vnd.quarantainenet",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.quark.quarkxpress": {
                    "source": "iana",
                    "extensions": [
                      "qxd",
                      "qxt",
                      "qwd",
                      "qwt",
                      "qxl",
                      "qxb"
                    ],
                    "type": "application/vnd.quark.quarkxpress",
                    "compressible": false
                  },
                  "application/vnd.quobject-quoxdocument": {
                    "source": "iana",
                    "type": "application/vnd.quobject-quoxdocument",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.radisys.moml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.moml+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-audit+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-audit+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-audit-conf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-audit-conf+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-audit-conn+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-audit-conn+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-audit-dialog+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-audit-dialog+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-audit-stream+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-audit-stream+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-conf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-conf+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-dialog+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-dialog+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-dialog-base+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-dialog-base+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-dialog-fax-detect+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-dialog-fax-detect+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-dialog-fax-sendrecv+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-dialog-group+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-dialog-group+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-dialog-speech+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-dialog-speech+xml",
                    "extensions": []
                  },
                  "application/vnd.radisys.msml-dialog-transform+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.radisys.msml-dialog-transform+xml",
                    "extensions": []
                  },
                  "application/vnd.rainstor.data": {
                    "source": "iana",
                    "type": "application/vnd.rainstor.data",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.rapid": {
                    "source": "iana",
                    "type": "application/vnd.rapid",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.rar": {
                    "source": "iana",
                    "type": "application/vnd.rar",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.realvnc.bed": {
                    "source": "iana",
                    "extensions": [
                      "bed"
                    ],
                    "type": "application/vnd.realvnc.bed",
                    "compressible": false
                  },
                  "application/vnd.recordare.musicxml": {
                    "source": "iana",
                    "extensions": [
                      "mxl"
                    ],
                    "type": "application/vnd.recordare.musicxml",
                    "compressible": false
                  },
                  "application/vnd.recordare.musicxml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "musicxml"
                    ],
                    "type": "application/vnd.recordare.musicxml+xml"
                  },
                  "application/vnd.renlearn.rlprint": {
                    "source": "iana",
                    "type": "application/vnd.renlearn.rlprint",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.restful+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.restful+json",
                    "extensions": []
                  },
                  "application/vnd.rig.cryptonote": {
                    "source": "iana",
                    "extensions": [
                      "cryptonote"
                    ],
                    "type": "application/vnd.rig.cryptonote",
                    "compressible": false
                  },
                  "application/vnd.rim.cod": {
                    "source": "apache",
                    "extensions": [
                      "cod"
                    ],
                    "type": "application/vnd.rim.cod",
                    "compressible": false
                  },
                  "application/vnd.rn-realmedia": {
                    "source": "apache",
                    "extensions": [
                      "rm"
                    ],
                    "type": "application/vnd.rn-realmedia",
                    "compressible": false
                  },
                  "application/vnd.rn-realmedia-vbr": {
                    "source": "apache",
                    "extensions": [
                      "rmvb"
                    ],
                    "type": "application/vnd.rn-realmedia-vbr",
                    "compressible": false
                  },
                  "application/vnd.route66.link66+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "link66"
                    ],
                    "type": "application/vnd.route66.link66+xml"
                  },
                  "application/vnd.rs-274x": {
                    "source": "iana",
                    "type": "application/vnd.rs-274x",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ruckus.download": {
                    "source": "iana",
                    "type": "application/vnd.ruckus.download",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.s3sms": {
                    "source": "iana",
                    "type": "application/vnd.s3sms",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sailingtracker.track": {
                    "source": "iana",
                    "extensions": [
                      "st"
                    ],
                    "type": "application/vnd.sailingtracker.track",
                    "compressible": false
                  },
                  "application/vnd.sbm.cid": {
                    "source": "iana",
                    "type": "application/vnd.sbm.cid",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sbm.mid2": {
                    "source": "iana",
                    "type": "application/vnd.sbm.mid2",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.scribus": {
                    "source": "iana",
                    "type": "application/vnd.scribus",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.3df": {
                    "source": "iana",
                    "type": "application/vnd.sealed.3df",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.csf": {
                    "source": "iana",
                    "type": "application/vnd.sealed.csf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.doc": {
                    "source": "iana",
                    "type": "application/vnd.sealed.doc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.eml": {
                    "source": "iana",
                    "type": "application/vnd.sealed.eml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.mht": {
                    "source": "iana",
                    "type": "application/vnd.sealed.mht",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.net": {
                    "source": "iana",
                    "type": "application/vnd.sealed.net",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.ppt": {
                    "source": "iana",
                    "type": "application/vnd.sealed.ppt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.tiff": {
                    "source": "iana",
                    "type": "application/vnd.sealed.tiff",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealed.xls": {
                    "source": "iana",
                    "type": "application/vnd.sealed.xls",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealedmedia.softseal.html": {
                    "source": "iana",
                    "type": "application/vnd.sealedmedia.softseal.html",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sealedmedia.softseal.pdf": {
                    "source": "iana",
                    "type": "application/vnd.sealedmedia.softseal.pdf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.seemail": {
                    "source": "iana",
                    "extensions": [
                      "see"
                    ],
                    "type": "application/vnd.seemail",
                    "compressible": false
                  },
                  "application/vnd.sema": {
                    "source": "iana",
                    "extensions": [
                      "sema"
                    ],
                    "type": "application/vnd.sema",
                    "compressible": false
                  },
                  "application/vnd.semd": {
                    "source": "iana",
                    "extensions": [
                      "semd"
                    ],
                    "type": "application/vnd.semd",
                    "compressible": false
                  },
                  "application/vnd.semf": {
                    "source": "iana",
                    "extensions": [
                      "semf"
                    ],
                    "type": "application/vnd.semf",
                    "compressible": false
                  },
                  "application/vnd.shade-save-file": {
                    "source": "iana",
                    "type": "application/vnd.shade-save-file",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.shana.informed.formdata": {
                    "source": "iana",
                    "extensions": [
                      "ifm"
                    ],
                    "type": "application/vnd.shana.informed.formdata",
                    "compressible": false
                  },
                  "application/vnd.shana.informed.formtemplate": {
                    "source": "iana",
                    "extensions": [
                      "itp"
                    ],
                    "type": "application/vnd.shana.informed.formtemplate",
                    "compressible": false
                  },
                  "application/vnd.shana.informed.interchange": {
                    "source": "iana",
                    "extensions": [
                      "iif"
                    ],
                    "type": "application/vnd.shana.informed.interchange",
                    "compressible": false
                  },
                  "application/vnd.shana.informed.package": {
                    "source": "iana",
                    "extensions": [
                      "ipk"
                    ],
                    "type": "application/vnd.shana.informed.package",
                    "compressible": false
                  },
                  "application/vnd.shootproof+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.shootproof+json",
                    "extensions": []
                  },
                  "application/vnd.shopkick+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.shopkick+json",
                    "extensions": []
                  },
                  "application/vnd.sigrok.session": {
                    "source": "iana",
                    "type": "application/vnd.sigrok.session",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.simtech-mindmapper": {
                    "source": "iana",
                    "extensions": [
                      "twd",
                      "twds"
                    ],
                    "type": "application/vnd.simtech-mindmapper",
                    "compressible": false
                  },
                  "application/vnd.siren+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.siren+json",
                    "extensions": []
                  },
                  "application/vnd.smaf": {
                    "source": "iana",
                    "extensions": [
                      "mmf"
                    ],
                    "type": "application/vnd.smaf",
                    "compressible": false
                  },
                  "application/vnd.smart.notebook": {
                    "source": "iana",
                    "type": "application/vnd.smart.notebook",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.smart.teacher": {
                    "source": "iana",
                    "extensions": [
                      "teacher"
                    ],
                    "type": "application/vnd.smart.teacher",
                    "compressible": false
                  },
                  "application/vnd.software602.filler.form+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.software602.filler.form+xml",
                    "extensions": []
                  },
                  "application/vnd.software602.filler.form-xml-zip": {
                    "source": "iana",
                    "type": "application/vnd.software602.filler.form-xml-zip",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.solent.sdkm+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "sdkm",
                      "sdkd"
                    ],
                    "type": "application/vnd.solent.sdkm+xml"
                  },
                  "application/vnd.spotfire.dxp": {
                    "source": "iana",
                    "extensions": [
                      "dxp"
                    ],
                    "type": "application/vnd.spotfire.dxp",
                    "compressible": false
                  },
                  "application/vnd.spotfire.sfs": {
                    "source": "iana",
                    "extensions": [
                      "sfs"
                    ],
                    "type": "application/vnd.spotfire.sfs",
                    "compressible": false
                  },
                  "application/vnd.sqlite3": {
                    "source": "iana",
                    "type": "application/vnd.sqlite3",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sss-cod": {
                    "source": "iana",
                    "type": "application/vnd.sss-cod",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sss-dtf": {
                    "source": "iana",
                    "type": "application/vnd.sss-dtf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sss-ntf": {
                    "source": "iana",
                    "type": "application/vnd.sss-ntf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.stardivision.calc": {
                    "source": "apache",
                    "extensions": [
                      "sdc"
                    ],
                    "type": "application/vnd.stardivision.calc",
                    "compressible": false
                  },
                  "application/vnd.stardivision.draw": {
                    "source": "apache",
                    "extensions": [
                      "sda"
                    ],
                    "type": "application/vnd.stardivision.draw",
                    "compressible": false
                  },
                  "application/vnd.stardivision.impress": {
                    "source": "apache",
                    "extensions": [
                      "sdd"
                    ],
                    "type": "application/vnd.stardivision.impress",
                    "compressible": false
                  },
                  "application/vnd.stardivision.math": {
                    "source": "apache",
                    "extensions": [
                      "smf"
                    ],
                    "type": "application/vnd.stardivision.math",
                    "compressible": false
                  },
                  "application/vnd.stardivision.writer": {
                    "source": "apache",
                    "extensions": [
                      "sdw",
                      "vor"
                    ],
                    "type": "application/vnd.stardivision.writer",
                    "compressible": false
                  },
                  "application/vnd.stardivision.writer-global": {
                    "source": "apache",
                    "extensions": [
                      "sgl"
                    ],
                    "type": "application/vnd.stardivision.writer-global",
                    "compressible": false
                  },
                  "application/vnd.stepmania.package": {
                    "source": "iana",
                    "extensions": [
                      "smzip"
                    ],
                    "type": "application/vnd.stepmania.package",
                    "compressible": false
                  },
                  "application/vnd.stepmania.stepchart": {
                    "source": "iana",
                    "extensions": [
                      "sm"
                    ],
                    "type": "application/vnd.stepmania.stepchart",
                    "compressible": false
                  },
                  "application/vnd.street-stream": {
                    "source": "iana",
                    "type": "application/vnd.street-stream",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.sun.wadl+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "wadl"
                    ],
                    "type": "application/vnd.sun.wadl+xml"
                  },
                  "application/vnd.sun.xml.calc": {
                    "source": "apache",
                    "extensions": [
                      "sxc"
                    ],
                    "type": "application/vnd.sun.xml.calc",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.calc.template": {
                    "source": "apache",
                    "extensions": [
                      "stc"
                    ],
                    "type": "application/vnd.sun.xml.calc.template",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.draw": {
                    "source": "apache",
                    "extensions": [
                      "sxd"
                    ],
                    "type": "application/vnd.sun.xml.draw",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.draw.template": {
                    "source": "apache",
                    "extensions": [
                      "std"
                    ],
                    "type": "application/vnd.sun.xml.draw.template",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.impress": {
                    "source": "apache",
                    "extensions": [
                      "sxi"
                    ],
                    "type": "application/vnd.sun.xml.impress",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.impress.template": {
                    "source": "apache",
                    "extensions": [
                      "sti"
                    ],
                    "type": "application/vnd.sun.xml.impress.template",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.math": {
                    "source": "apache",
                    "extensions": [
                      "sxm"
                    ],
                    "type": "application/vnd.sun.xml.math",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.writer": {
                    "source": "apache",
                    "extensions": [
                      "sxw"
                    ],
                    "type": "application/vnd.sun.xml.writer",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.writer.global": {
                    "source": "apache",
                    "extensions": [
                      "sxg"
                    ],
                    "type": "application/vnd.sun.xml.writer.global",
                    "compressible": false
                  },
                  "application/vnd.sun.xml.writer.template": {
                    "source": "apache",
                    "extensions": [
                      "stw"
                    ],
                    "type": "application/vnd.sun.xml.writer.template",
                    "compressible": false
                  },
                  "application/vnd.sus-calendar": {
                    "source": "iana",
                    "extensions": [
                      "sus",
                      "susp"
                    ],
                    "type": "application/vnd.sus-calendar",
                    "compressible": false
                  },
                  "application/vnd.svd": {
                    "source": "iana",
                    "extensions": [
                      "svd"
                    ],
                    "type": "application/vnd.svd",
                    "compressible": false
                  },
                  "application/vnd.swiftview-ics": {
                    "source": "iana",
                    "type": "application/vnd.swiftview-ics",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.symbian.install": {
                    "source": "apache",
                    "extensions": [
                      "sis",
                      "sisx"
                    ],
                    "type": "application/vnd.symbian.install",
                    "compressible": false
                  },
                  "application/vnd.syncml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xsm"
                    ],
                    "type": "application/vnd.syncml+xml"
                  },
                  "application/vnd.syncml.dm+wbxml": {
                    "source": "iana",
                    "extensions": [
                      "bdm"
                    ],
                    "type": "application/vnd.syncml.dm+wbxml",
                    "compressible": false
                  },
                  "application/vnd.syncml.dm+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xdm"
                    ],
                    "type": "application/vnd.syncml.dm+xml"
                  },
                  "application/vnd.syncml.dm.notification": {
                    "source": "iana",
                    "type": "application/vnd.syncml.dm.notification",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.syncml.dmddf+wbxml": {
                    "source": "iana",
                    "type": "application/vnd.syncml.dmddf+wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.syncml.dmddf+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.syncml.dmddf+xml",
                    "extensions": []
                  },
                  "application/vnd.syncml.dmtnds+wbxml": {
                    "source": "iana",
                    "type": "application/vnd.syncml.dmtnds+wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.syncml.dmtnds+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.syncml.dmtnds+xml",
                    "extensions": []
                  },
                  "application/vnd.syncml.ds.notification": {
                    "source": "iana",
                    "type": "application/vnd.syncml.ds.notification",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.tableschema+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.tableschema+json",
                    "extensions": []
                  },
                  "application/vnd.tao.intent-module-archive": {
                    "source": "iana",
                    "extensions": [
                      "tao"
                    ],
                    "type": "application/vnd.tao.intent-module-archive",
                    "compressible": false
                  },
                  "application/vnd.tcpdump.pcap": {
                    "source": "iana",
                    "extensions": [
                      "pcap",
                      "cap",
                      "dmp"
                    ],
                    "type": "application/vnd.tcpdump.pcap",
                    "compressible": false
                  },
                  "application/vnd.think-cell.ppttc+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.think-cell.ppttc+json",
                    "extensions": []
                  },
                  "application/vnd.tmd.mediaflex.api+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.tmd.mediaflex.api+xml",
                    "extensions": []
                  },
                  "application/vnd.tml": {
                    "source": "iana",
                    "type": "application/vnd.tml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.tmobile-livetv": {
                    "source": "iana",
                    "extensions": [
                      "tmo"
                    ],
                    "type": "application/vnd.tmobile-livetv",
                    "compressible": false
                  },
                  "application/vnd.tri.onesource": {
                    "source": "iana",
                    "type": "application/vnd.tri.onesource",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.trid.tpt": {
                    "source": "iana",
                    "extensions": [
                      "tpt"
                    ],
                    "type": "application/vnd.trid.tpt",
                    "compressible": false
                  },
                  "application/vnd.triscape.mxs": {
                    "source": "iana",
                    "extensions": [
                      "mxs"
                    ],
                    "type": "application/vnd.triscape.mxs",
                    "compressible": false
                  },
                  "application/vnd.trueapp": {
                    "source": "iana",
                    "extensions": [
                      "tra"
                    ],
                    "type": "application/vnd.trueapp",
                    "compressible": false
                  },
                  "application/vnd.truedoc": {
                    "source": "iana",
                    "type": "application/vnd.truedoc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ubisoft.webplayer": {
                    "source": "iana",
                    "type": "application/vnd.ubisoft.webplayer",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ufdl": {
                    "source": "iana",
                    "extensions": [
                      "ufd",
                      "ufdl"
                    ],
                    "type": "application/vnd.ufdl",
                    "compressible": false
                  },
                  "application/vnd.uiq.theme": {
                    "source": "iana",
                    "extensions": [
                      "utz"
                    ],
                    "type": "application/vnd.uiq.theme",
                    "compressible": false
                  },
                  "application/vnd.umajin": {
                    "source": "iana",
                    "extensions": [
                      "umj"
                    ],
                    "type": "application/vnd.umajin",
                    "compressible": false
                  },
                  "application/vnd.unity": {
                    "source": "iana",
                    "extensions": [
                      "unityweb"
                    ],
                    "type": "application/vnd.unity",
                    "compressible": false
                  },
                  "application/vnd.uoml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "uoml"
                    ],
                    "type": "application/vnd.uoml+xml"
                  },
                  "application/vnd.uplanet.alert": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.alert",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.alert-wbxml": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.alert-wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.bearer-choice": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.bearer-choice",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.bearer-choice-wbxml": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.bearer-choice-wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.cacheop": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.cacheop",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.cacheop-wbxml": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.cacheop-wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.channel": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.channel",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.channel-wbxml": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.channel-wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.list": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.list",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.list-wbxml": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.list-wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.listcmd": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.listcmd",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.listcmd-wbxml": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.listcmd-wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uplanet.signal": {
                    "source": "iana",
                    "type": "application/vnd.uplanet.signal",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.uri-map": {
                    "source": "iana",
                    "type": "application/vnd.uri-map",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.valve.source.material": {
                    "source": "iana",
                    "type": "application/vnd.valve.source.material",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.vcx": {
                    "source": "iana",
                    "extensions": [
                      "vcx"
                    ],
                    "type": "application/vnd.vcx",
                    "compressible": false
                  },
                  "application/vnd.vd-study": {
                    "source": "iana",
                    "type": "application/vnd.vd-study",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.vectorworks": {
                    "source": "iana",
                    "type": "application/vnd.vectorworks",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.vel+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.vel+json",
                    "extensions": []
                  },
                  "application/vnd.verimatrix.vcas": {
                    "source": "iana",
                    "type": "application/vnd.verimatrix.vcas",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.veryant.thin": {
                    "source": "iana",
                    "type": "application/vnd.veryant.thin",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.ves.encrypted": {
                    "source": "iana",
                    "type": "application/vnd.ves.encrypted",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.vidsoft.vidconference": {
                    "source": "iana",
                    "type": "application/vnd.vidsoft.vidconference",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.visio": {
                    "source": "iana",
                    "extensions": [
                      "vsd",
                      "vst",
                      "vss",
                      "vsw"
                    ],
                    "type": "application/vnd.visio",
                    "compressible": false
                  },
                  "application/vnd.visionary": {
                    "source": "iana",
                    "extensions": [
                      "vis"
                    ],
                    "type": "application/vnd.visionary",
                    "compressible": false
                  },
                  "application/vnd.vividence.scriptfile": {
                    "source": "iana",
                    "type": "application/vnd.vividence.scriptfile",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.vsf": {
                    "source": "iana",
                    "extensions": [
                      "vsf"
                    ],
                    "type": "application/vnd.vsf",
                    "compressible": false
                  },
                  "application/vnd.wap.sic": {
                    "source": "iana",
                    "type": "application/vnd.wap.sic",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wap.slc": {
                    "source": "iana",
                    "type": "application/vnd.wap.slc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wap.wbxml": {
                    "source": "iana",
                    "extensions": [
                      "wbxml"
                    ],
                    "type": "application/vnd.wap.wbxml",
                    "compressible": false
                  },
                  "application/vnd.wap.wmlc": {
                    "source": "iana",
                    "extensions": [
                      "wmlc"
                    ],
                    "type": "application/vnd.wap.wmlc",
                    "compressible": false
                  },
                  "application/vnd.wap.wmlscriptc": {
                    "source": "iana",
                    "extensions": [
                      "wmlsc"
                    ],
                    "type": "application/vnd.wap.wmlscriptc",
                    "compressible": false
                  },
                  "application/vnd.webturbo": {
                    "source": "iana",
                    "extensions": [
                      "wtb"
                    ],
                    "type": "application/vnd.webturbo",
                    "compressible": false
                  },
                  "application/vnd.wfa.p2p": {
                    "source": "iana",
                    "type": "application/vnd.wfa.p2p",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wfa.wsc": {
                    "source": "iana",
                    "type": "application/vnd.wfa.wsc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.windows.devicepairing": {
                    "source": "iana",
                    "type": "application/vnd.windows.devicepairing",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wmc": {
                    "source": "iana",
                    "type": "application/vnd.wmc",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wmf.bootstrap": {
                    "source": "iana",
                    "type": "application/vnd.wmf.bootstrap",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wolfram.mathematica": {
                    "source": "iana",
                    "type": "application/vnd.wolfram.mathematica",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wolfram.mathematica.package": {
                    "source": "iana",
                    "type": "application/vnd.wolfram.mathematica.package",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wolfram.player": {
                    "source": "iana",
                    "extensions": [
                      "nbp"
                    ],
                    "type": "application/vnd.wolfram.player",
                    "compressible": false
                  },
                  "application/vnd.wordperfect": {
                    "source": "iana",
                    "extensions": [
                      "wpd"
                    ],
                    "type": "application/vnd.wordperfect",
                    "compressible": false
                  },
                  "application/vnd.wqd": {
                    "source": "iana",
                    "extensions": [
                      "wqd"
                    ],
                    "type": "application/vnd.wqd",
                    "compressible": false
                  },
                  "application/vnd.wrq-hp3000-labelled": {
                    "source": "iana",
                    "type": "application/vnd.wrq-hp3000-labelled",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wt.stf": {
                    "source": "iana",
                    "extensions": [
                      "stf"
                    ],
                    "type": "application/vnd.wt.stf",
                    "compressible": false
                  },
                  "application/vnd.wv.csp+wbxml": {
                    "source": "iana",
                    "type": "application/vnd.wv.csp+wbxml",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.wv.csp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.wv.csp+xml",
                    "extensions": []
                  },
                  "application/vnd.wv.ssp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.wv.ssp+xml",
                    "extensions": []
                  },
                  "application/vnd.xacml+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.xacml+json",
                    "extensions": []
                  },
                  "application/vnd.xara": {
                    "source": "iana",
                    "extensions": [
                      "xar"
                    ],
                    "type": "application/vnd.xara",
                    "compressible": false
                  },
                  "application/vnd.xfdl": {
                    "source": "iana",
                    "extensions": [
                      "xfdl"
                    ],
                    "type": "application/vnd.xfdl",
                    "compressible": false
                  },
                  "application/vnd.xfdl.webform": {
                    "source": "iana",
                    "type": "application/vnd.xfdl.webform",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.xmi+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/vnd.xmi+xml",
                    "extensions": []
                  },
                  "application/vnd.xmpie.cpkg": {
                    "source": "iana",
                    "type": "application/vnd.xmpie.cpkg",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.xmpie.dpkg": {
                    "source": "iana",
                    "type": "application/vnd.xmpie.dpkg",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.xmpie.plan": {
                    "source": "iana",
                    "type": "application/vnd.xmpie.plan",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.xmpie.ppkg": {
                    "source": "iana",
                    "type": "application/vnd.xmpie.ppkg",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.xmpie.xlim": {
                    "source": "iana",
                    "type": "application/vnd.xmpie.xlim",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.yamaha.hv-dic": {
                    "source": "iana",
                    "extensions": [
                      "hvd"
                    ],
                    "type": "application/vnd.yamaha.hv-dic",
                    "compressible": false
                  },
                  "application/vnd.yamaha.hv-script": {
                    "source": "iana",
                    "extensions": [
                      "hvs"
                    ],
                    "type": "application/vnd.yamaha.hv-script",
                    "compressible": false
                  },
                  "application/vnd.yamaha.hv-voice": {
                    "source": "iana",
                    "extensions": [
                      "hvp"
                    ],
                    "type": "application/vnd.yamaha.hv-voice",
                    "compressible": false
                  },
                  "application/vnd.yamaha.openscoreformat": {
                    "source": "iana",
                    "extensions": [
                      "osf"
                    ],
                    "type": "application/vnd.yamaha.openscoreformat",
                    "compressible": false
                  },
                  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "osfpvg"
                    ],
                    "type": "application/vnd.yamaha.openscoreformat.osfpvg+xml"
                  },
                  "application/vnd.yamaha.remote-setup": {
                    "source": "iana",
                    "type": "application/vnd.yamaha.remote-setup",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.yamaha.smaf-audio": {
                    "source": "iana",
                    "extensions": [
                      "saf"
                    ],
                    "type": "application/vnd.yamaha.smaf-audio",
                    "compressible": false
                  },
                  "application/vnd.yamaha.smaf-phrase": {
                    "source": "iana",
                    "extensions": [
                      "spf"
                    ],
                    "type": "application/vnd.yamaha.smaf-phrase",
                    "compressible": false
                  },
                  "application/vnd.yamaha.through-ngn": {
                    "source": "iana",
                    "type": "application/vnd.yamaha.through-ngn",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.yamaha.tunnel-udpencap": {
                    "source": "iana",
                    "type": "application/vnd.yamaha.tunnel-udpencap",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.yaoweme": {
                    "source": "iana",
                    "type": "application/vnd.yaoweme",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.yellowriver-custom-menu": {
                    "source": "iana",
                    "extensions": [
                      "cmp"
                    ],
                    "type": "application/vnd.yellowriver-custom-menu",
                    "compressible": false
                  },
                  "application/vnd.youtube.yt": {
                    "source": "iana",
                    "type": "application/vnd.youtube.yt",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/vnd.zul": {
                    "source": "iana",
                    "extensions": [
                      "zir",
                      "zirz"
                    ],
                    "type": "application/vnd.zul",
                    "compressible": false
                  },
                  "application/vnd.zzazz.deck+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "zaz"
                    ],
                    "type": "application/vnd.zzazz.deck+xml"
                  },
                  "application/voicexml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "vxml"
                    ],
                    "type": "application/voicexml+xml"
                  },
                  "application/voucher-cms+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/voucher-cms+json",
                    "extensions": []
                  },
                  "application/vq-rtcpxr": {
                    "source": "iana",
                    "type": "application/vq-rtcpxr",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/wasm": {
                    "compressible": true,
                    "extensions": [
                      "wasm"
                    ],
                    "type": "application/wasm",
                    "source": "mime-db"
                  },
                  "application/watcherinfo+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/watcherinfo+xml",
                    "extensions": []
                  },
                  "application/webpush-options+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/webpush-options+json",
                    "extensions": []
                  },
                  "application/whoispp-query": {
                    "source": "iana",
                    "type": "application/whoispp-query",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/whoispp-response": {
                    "source": "iana",
                    "type": "application/whoispp-response",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/widget": {
                    "source": "iana",
                    "extensions": [
                      "wgt"
                    ],
                    "type": "application/widget",
                    "compressible": false
                  },
                  "application/winhlp": {
                    "source": "apache",
                    "extensions": [
                      "hlp"
                    ],
                    "type": "application/winhlp",
                    "compressible": false
                  },
                  "application/wita": {
                    "source": "iana",
                    "type": "application/wita",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/wordperfect5.1": {
                    "source": "iana",
                    "type": "application/wordperfect5.1",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/wsdl+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "wsdl"
                    ],
                    "type": "application/wsdl+xml"
                  },
                  "application/wspolicy+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "wspolicy"
                    ],
                    "type": "application/wspolicy+xml"
                  },
                  "application/x-7z-compressed": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "7z"
                    ],
                    "type": "application/x-7z-compressed"
                  },
                  "application/x-abiword": {
                    "source": "apache",
                    "extensions": [
                      "abw"
                    ],
                    "type": "application/x-abiword",
                    "compressible": false
                  },
                  "application/x-ace-compressed": {
                    "source": "apache",
                    "extensions": [
                      "ace"
                    ],
                    "type": "application/x-ace-compressed",
                    "compressible": false
                  },
                  "application/x-amf": {
                    "source": "apache",
                    "type": "application/x-amf",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-apple-diskimage": {
                    "source": "apache",
                    "extensions": [
                      "dmg"
                    ],
                    "type": "application/x-apple-diskimage",
                    "compressible": false
                  },
                  "application/x-arj": {
                    "compressible": false,
                    "extensions": [
                      "arj"
                    ],
                    "type": "application/x-arj",
                    "source": "mime-db"
                  },
                  "application/x-authorware-bin": {
                    "source": "apache",
                    "extensions": [
                      "aab",
                      "x32",
                      "u32",
                      "vox"
                    ],
                    "type": "application/x-authorware-bin",
                    "compressible": false
                  },
                  "application/x-authorware-map": {
                    "source": "apache",
                    "extensions": [
                      "aam"
                    ],
                    "type": "application/x-authorware-map",
                    "compressible": false
                  },
                  "application/x-authorware-seg": {
                    "source": "apache",
                    "extensions": [
                      "aas"
                    ],
                    "type": "application/x-authorware-seg",
                    "compressible": false
                  },
                  "application/x-bcpio": {
                    "source": "apache",
                    "extensions": [
                      "bcpio"
                    ],
                    "type": "application/x-bcpio",
                    "compressible": false
                  },
                  "application/x-bdoc": {
                    "compressible": false,
                    "extensions": [
                      "bdoc"
                    ],
                    "type": "application/x-bdoc",
                    "source": "mime-db"
                  },
                  "application/x-bittorrent": {
                    "source": "apache",
                    "extensions": [
                      "torrent"
                    ],
                    "type": "application/x-bittorrent",
                    "compressible": false
                  },
                  "application/x-blorb": {
                    "source": "apache",
                    "extensions": [
                      "blb",
                      "blorb"
                    ],
                    "type": "application/x-blorb",
                    "compressible": false
                  },
                  "application/x-bzip": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "bz"
                    ],
                    "type": "application/x-bzip"
                  },
                  "application/x-bzip2": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "bz2",
                      "boz"
                    ],
                    "type": "application/x-bzip2"
                  },
                  "application/x-cbr": {
                    "source": "apache",
                    "extensions": [
                      "cbr",
                      "cba",
                      "cbt",
                      "cbz",
                      "cb7"
                    ],
                    "type": "application/x-cbr",
                    "compressible": false
                  },
                  "application/x-cdlink": {
                    "source": "apache",
                    "extensions": [
                      "vcd"
                    ],
                    "type": "application/x-cdlink",
                    "compressible": false
                  },
                  "application/x-cfs-compressed": {
                    "source": "apache",
                    "extensions": [
                      "cfs"
                    ],
                    "type": "application/x-cfs-compressed",
                    "compressible": false
                  },
                  "application/x-chat": {
                    "source": "apache",
                    "extensions": [
                      "chat"
                    ],
                    "type": "application/x-chat",
                    "compressible": false
                  },
                  "application/x-chess-pgn": {
                    "source": "apache",
                    "extensions": [
                      "pgn"
                    ],
                    "type": "application/x-chess-pgn",
                    "compressible": false
                  },
                  "application/x-chrome-extension": {
                    "extensions": [
                      "crx"
                    ],
                    "type": "application/x-chrome-extension",
                    "source": "mime-db",
                    "compressible": false
                  },
                  "application/x-cocoa": {
                    "source": "nginx",
                    "extensions": [
                      "cco"
                    ],
                    "type": "application/x-cocoa",
                    "compressible": false
                  },
                  "application/x-compress": {
                    "source": "apache",
                    "type": "application/x-compress",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-conference": {
                    "source": "apache",
                    "extensions": [
                      "nsc"
                    ],
                    "type": "application/x-conference",
                    "compressible": false
                  },
                  "application/x-cpio": {
                    "source": "apache",
                    "extensions": [
                      "cpio"
                    ],
                    "type": "application/x-cpio",
                    "compressible": false
                  },
                  "application/x-csh": {
                    "source": "apache",
                    "extensions": [
                      "csh"
                    ],
                    "type": "application/x-csh",
                    "compressible": false
                  },
                  "application/x-deb": {
                    "compressible": false,
                    "type": "application/x-deb",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "application/x-debian-package": {
                    "source": "apache",
                    "extensions": [
                      "deb",
                      "udeb"
                    ],
                    "type": "application/x-debian-package",
                    "compressible": false
                  },
                  "application/x-dgc-compressed": {
                    "source": "apache",
                    "extensions": [
                      "dgc"
                    ],
                    "type": "application/x-dgc-compressed",
                    "compressible": false
                  },
                  "application/x-director": {
                    "source": "apache",
                    "extensions": [
                      "dir",
                      "dcr",
                      "dxr",
                      "cst",
                      "cct",
                      "cxt",
                      "w3d",
                      "fgd",
                      "swa"
                    ],
                    "type": "application/x-director",
                    "compressible": false
                  },
                  "application/x-doom": {
                    "source": "apache",
                    "extensions": [
                      "wad"
                    ],
                    "type": "application/x-doom",
                    "compressible": false
                  },
                  "application/x-dtbncx+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "ncx"
                    ],
                    "type": "application/x-dtbncx+xml"
                  },
                  "application/x-dtbook+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "dtb"
                    ],
                    "type": "application/x-dtbook+xml"
                  },
                  "application/x-dtbresource+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "res"
                    ],
                    "type": "application/x-dtbresource+xml"
                  },
                  "application/x-dvi": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "dvi"
                    ],
                    "type": "application/x-dvi"
                  },
                  "application/x-envoy": {
                    "source": "apache",
                    "extensions": [
                      "evy"
                    ],
                    "type": "application/x-envoy",
                    "compressible": false
                  },
                  "application/x-eva": {
                    "source": "apache",
                    "extensions": [
                      "eva"
                    ],
                    "type": "application/x-eva",
                    "compressible": false
                  },
                  "application/x-font-bdf": {
                    "source": "apache",
                    "extensions": [
                      "bdf"
                    ],
                    "type": "application/x-font-bdf",
                    "compressible": false
                  },
                  "application/x-font-dos": {
                    "source": "apache",
                    "type": "application/x-font-dos",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-font-framemaker": {
                    "source": "apache",
                    "type": "application/x-font-framemaker",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-font-ghostscript": {
                    "source": "apache",
                    "extensions": [
                      "gsf"
                    ],
                    "type": "application/x-font-ghostscript",
                    "compressible": false
                  },
                  "application/x-font-libgrx": {
                    "source": "apache",
                    "type": "application/x-font-libgrx",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-font-linux-psf": {
                    "source": "apache",
                    "extensions": [
                      "psf"
                    ],
                    "type": "application/x-font-linux-psf",
                    "compressible": false
                  },
                  "application/x-font-pcf": {
                    "source": "apache",
                    "extensions": [
                      "pcf"
                    ],
                    "type": "application/x-font-pcf",
                    "compressible": false
                  },
                  "application/x-font-snf": {
                    "source": "apache",
                    "extensions": [
                      "snf"
                    ],
                    "type": "application/x-font-snf",
                    "compressible": false
                  },
                  "application/x-font-speedo": {
                    "source": "apache",
                    "type": "application/x-font-speedo",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-font-sunos-news": {
                    "source": "apache",
                    "type": "application/x-font-sunos-news",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-font-type1": {
                    "source": "apache",
                    "extensions": [
                      "pfa",
                      "pfb",
                      "pfm",
                      "afm"
                    ],
                    "type": "application/x-font-type1",
                    "compressible": false
                  },
                  "application/x-font-vfont": {
                    "source": "apache",
                    "type": "application/x-font-vfont",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-freearc": {
                    "source": "apache",
                    "extensions": [
                      "arc"
                    ],
                    "type": "application/x-freearc",
                    "compressible": false
                  },
                  "application/x-futuresplash": {
                    "source": "apache",
                    "extensions": [
                      "spl"
                    ],
                    "type": "application/x-futuresplash",
                    "compressible": false
                  },
                  "application/x-gca-compressed": {
                    "source": "apache",
                    "extensions": [
                      "gca"
                    ],
                    "type": "application/x-gca-compressed",
                    "compressible": false
                  },
                  "application/x-glulx": {
                    "source": "apache",
                    "extensions": [
                      "ulx"
                    ],
                    "type": "application/x-glulx",
                    "compressible": false
                  },
                  "application/x-gnumeric": {
                    "source": "apache",
                    "extensions": [
                      "gnumeric"
                    ],
                    "type": "application/x-gnumeric",
                    "compressible": false
                  },
                  "application/x-gramps-xml": {
                    "source": "apache",
                    "extensions": [
                      "gramps"
                    ],
                    "type": "application/x-gramps-xml",
                    "compressible": false
                  },
                  "application/x-gtar": {
                    "source": "apache",
                    "extensions": [
                      "gtar"
                    ],
                    "type": "application/x-gtar",
                    "compressible": false
                  },
                  "application/x-gzip": {
                    "source": "apache",
                    "type": "application/x-gzip",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/x-hdf": {
                    "source": "apache",
                    "extensions": [
                      "hdf"
                    ],
                    "type": "application/x-hdf",
                    "compressible": false
                  },
                  "application/x-httpd-php": {
                    "compressible": true,
                    "extensions": [
                      "php"
                    ],
                    "type": "application/x-httpd-php",
                    "source": "mime-db"
                  },
                  "application/x-install-instructions": {
                    "source": "apache",
                    "extensions": [
                      "install"
                    ],
                    "type": "application/x-install-instructions",
                    "compressible": false
                  },
                  "application/x-iso9660-image": {
                    "source": "apache",
                    "extensions": [
                      "iso"
                    ],
                    "type": "application/x-iso9660-image",
                    "compressible": false
                  },
                  "application/x-java-archive-diff": {
                    "source": "nginx",
                    "extensions": [
                      "jardiff"
                    ],
                    "type": "application/x-java-archive-diff",
                    "compressible": false
                  },
                  "application/x-java-jnlp-file": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "jnlp"
                    ],
                    "type": "application/x-java-jnlp-file"
                  },
                  "application/x-javascript": {
                    "compressible": true,
                    "type": "application/x-javascript",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "application/x-latex": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "latex"
                    ],
                    "type": "application/x-latex"
                  },
                  "application/x-lua-bytecode": {
                    "extensions": [
                      "luac"
                    ],
                    "type": "application/x-lua-bytecode",
                    "source": "mime-db",
                    "compressible": false
                  },
                  "application/x-lzh-compressed": {
                    "source": "apache",
                    "extensions": [
                      "lzh",
                      "lha"
                    ],
                    "type": "application/x-lzh-compressed",
                    "compressible": false
                  },
                  "application/x-makeself": {
                    "source": "nginx",
                    "extensions": [
                      "run"
                    ],
                    "type": "application/x-makeself",
                    "compressible": false
                  },
                  "application/x-mie": {
                    "source": "apache",
                    "extensions": [
                      "mie"
                    ],
                    "type": "application/x-mie",
                    "compressible": false
                  },
                  "application/x-mobipocket-ebook": {
                    "source": "apache",
                    "extensions": [
                      "prc",
                      "mobi"
                    ],
                    "type": "application/x-mobipocket-ebook",
                    "compressible": false
                  },
                  "application/x-mpegurl": {
                    "compressible": false,
                    "type": "application/x-mpegurl",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "application/x-ms-application": {
                    "source": "apache",
                    "extensions": [
                      "application"
                    ],
                    "type": "application/x-ms-application",
                    "compressible": false
                  },
                  "application/x-ms-shortcut": {
                    "source": "apache",
                    "extensions": [
                      "lnk"
                    ],
                    "type": "application/x-ms-shortcut",
                    "compressible": false
                  },
                  "application/x-ms-wmd": {
                    "source": "apache",
                    "extensions": [
                      "wmd"
                    ],
                    "type": "application/x-ms-wmd",
                    "compressible": false
                  },
                  "application/x-ms-wmz": {
                    "source": "apache",
                    "extensions": [
                      "wmz"
                    ],
                    "type": "application/x-ms-wmz",
                    "compressible": false
                  },
                  "application/x-ms-xbap": {
                    "source": "apache",
                    "extensions": [
                      "xbap"
                    ],
                    "type": "application/x-ms-xbap",
                    "compressible": false
                  },
                  "application/x-msaccess": {
                    "source": "apache",
                    "extensions": [
                      "mdb"
                    ],
                    "type": "application/x-msaccess",
                    "compressible": false
                  },
                  "application/x-msbinder": {
                    "source": "apache",
                    "extensions": [
                      "obd"
                    ],
                    "type": "application/x-msbinder",
                    "compressible": false
                  },
                  "application/x-mscardfile": {
                    "source": "apache",
                    "extensions": [
                      "crd"
                    ],
                    "type": "application/x-mscardfile",
                    "compressible": false
                  },
                  "application/x-msclip": {
                    "source": "apache",
                    "extensions": [
                      "clp"
                    ],
                    "type": "application/x-msclip",
                    "compressible": false
                  },
                  "application/x-msdos-program": {
                    "extensions": [
                      "exe"
                    ],
                    "type": "application/x-msdos-program",
                    "source": "mime-db",
                    "compressible": false
                  },
                  "application/x-msdownload": {
                    "source": "apache",
                    "extensions": [
                      "exe",
                      "dll",
                      "com",
                      "bat",
                      "msi"
                    ],
                    "type": "application/x-msdownload",
                    "compressible": false
                  },
                  "application/x-msmediaview": {
                    "source": "apache",
                    "extensions": [
                      "mvb",
                      "m13",
                      "m14"
                    ],
                    "type": "application/x-msmediaview",
                    "compressible": false
                  },
                  "application/x-msmetafile": {
                    "source": "apache",
                    "extensions": [
                      "wmf",
                      "wmz",
                      "emf",
                      "emz"
                    ],
                    "type": "application/x-msmetafile",
                    "compressible": false
                  },
                  "application/x-msmoney": {
                    "source": "apache",
                    "extensions": [
                      "mny"
                    ],
                    "type": "application/x-msmoney",
                    "compressible": false
                  },
                  "application/x-mspublisher": {
                    "source": "apache",
                    "extensions": [
                      "pub"
                    ],
                    "type": "application/x-mspublisher",
                    "compressible": false
                  },
                  "application/x-msschedule": {
                    "source": "apache",
                    "extensions": [
                      "scd"
                    ],
                    "type": "application/x-msschedule",
                    "compressible": false
                  },
                  "application/x-msterminal": {
                    "source": "apache",
                    "extensions": [
                      "trm"
                    ],
                    "type": "application/x-msterminal",
                    "compressible": false
                  },
                  "application/x-mswrite": {
                    "source": "apache",
                    "extensions": [
                      "wri"
                    ],
                    "type": "application/x-mswrite",
                    "compressible": false
                  },
                  "application/x-netcdf": {
                    "source": "apache",
                    "extensions": [
                      "nc",
                      "cdf"
                    ],
                    "type": "application/x-netcdf",
                    "compressible": false
                  },
                  "application/x-ns-proxy-autoconfig": {
                    "compressible": true,
                    "extensions": [
                      "pac"
                    ],
                    "type": "application/x-ns-proxy-autoconfig",
                    "source": "mime-db"
                  },
                  "application/x-nzb": {
                    "source": "apache",
                    "extensions": [
                      "nzb"
                    ],
                    "type": "application/x-nzb",
                    "compressible": false
                  },
                  "application/x-perl": {
                    "source": "nginx",
                    "extensions": [
                      "pl",
                      "pm"
                    ],
                    "type": "application/x-perl",
                    "compressible": false
                  },
                  "application/x-pilot": {
                    "source": "nginx",
                    "extensions": [
                      "prc",
                      "pdb"
                    ],
                    "type": "application/x-pilot",
                    "compressible": false
                  },
                  "application/x-pkcs12": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "p12",
                      "pfx"
                    ],
                    "type": "application/x-pkcs12"
                  },
                  "application/x-pkcs7-certificates": {
                    "source": "apache",
                    "extensions": [
                      "p7b",
                      "spc"
                    ],
                    "type": "application/x-pkcs7-certificates",
                    "compressible": false
                  },
                  "application/x-pkcs7-certreqresp": {
                    "source": "apache",
                    "extensions": [
                      "p7r"
                    ],
                    "type": "application/x-pkcs7-certreqresp",
                    "compressible": false
                  },
                  "application/x-rar-compressed": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "rar"
                    ],
                    "type": "application/x-rar-compressed"
                  },
                  "application/x-redhat-package-manager": {
                    "source": "nginx",
                    "extensions": [
                      "rpm"
                    ],
                    "type": "application/x-redhat-package-manager",
                    "compressible": false
                  },
                  "application/x-research-info-systems": {
                    "source": "apache",
                    "extensions": [
                      "ris"
                    ],
                    "type": "application/x-research-info-systems",
                    "compressible": false
                  },
                  "application/x-sea": {
                    "source": "nginx",
                    "extensions": [
                      "sea"
                    ],
                    "type": "application/x-sea",
                    "compressible": false
                  },
                  "application/x-sh": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "sh"
                    ],
                    "type": "application/x-sh"
                  },
                  "application/x-shar": {
                    "source": "apache",
                    "extensions": [
                      "shar"
                    ],
                    "type": "application/x-shar",
                    "compressible": false
                  },
                  "application/x-shockwave-flash": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "swf"
                    ],
                    "type": "application/x-shockwave-flash"
                  },
                  "application/x-silverlight-app": {
                    "source": "apache",
                    "extensions": [
                      "xap"
                    ],
                    "type": "application/x-silverlight-app",
                    "compressible": false
                  },
                  "application/x-sql": {
                    "source": "apache",
                    "extensions": [
                      "sql"
                    ],
                    "type": "application/x-sql",
                    "compressible": false
                  },
                  "application/x-stuffit": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "sit"
                    ],
                    "type": "application/x-stuffit"
                  },
                  "application/x-stuffitx": {
                    "source": "apache",
                    "extensions": [
                      "sitx"
                    ],
                    "type": "application/x-stuffitx",
                    "compressible": false
                  },
                  "application/x-subrip": {
                    "source": "apache",
                    "extensions": [
                      "srt"
                    ],
                    "type": "application/x-subrip",
                    "compressible": false
                  },
                  "application/x-sv4cpio": {
                    "source": "apache",
                    "extensions": [
                      "sv4cpio"
                    ],
                    "type": "application/x-sv4cpio",
                    "compressible": false
                  },
                  "application/x-sv4crc": {
                    "source": "apache",
                    "extensions": [
                      "sv4crc"
                    ],
                    "type": "application/x-sv4crc",
                    "compressible": false
                  },
                  "application/x-t3vm-image": {
                    "source": "apache",
                    "extensions": [
                      "t3"
                    ],
                    "type": "application/x-t3vm-image",
                    "compressible": false
                  },
                  "application/x-tads": {
                    "source": "apache",
                    "extensions": [
                      "gam"
                    ],
                    "type": "application/x-tads",
                    "compressible": false
                  },
                  "application/x-tar": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "tar"
                    ],
                    "type": "application/x-tar"
                  },
                  "application/x-tcl": {
                    "source": "apache",
                    "extensions": [
                      "tcl",
                      "tk"
                    ],
                    "type": "application/x-tcl",
                    "compressible": false
                  },
                  "application/x-tex": {
                    "source": "apache",
                    "extensions": [
                      "tex"
                    ],
                    "type": "application/x-tex",
                    "compressible": false
                  },
                  "application/x-tex-tfm": {
                    "source": "apache",
                    "extensions": [
                      "tfm"
                    ],
                    "type": "application/x-tex-tfm",
                    "compressible": false
                  },
                  "application/x-texinfo": {
                    "source": "apache",
                    "extensions": [
                      "texinfo",
                      "texi"
                    ],
                    "type": "application/x-texinfo",
                    "compressible": false
                  },
                  "application/x-tgif": {
                    "source": "apache",
                    "extensions": [
                      "obj"
                    ],
                    "type": "application/x-tgif",
                    "compressible": false
                  },
                  "application/x-ustar": {
                    "source": "apache",
                    "extensions": [
                      "ustar"
                    ],
                    "type": "application/x-ustar",
                    "compressible": false
                  },
                  "application/x-virtualbox-hdd": {
                    "compressible": true,
                    "extensions": [
                      "hdd"
                    ],
                    "type": "application/x-virtualbox-hdd",
                    "source": "mime-db"
                  },
                  "application/x-virtualbox-ova": {
                    "compressible": true,
                    "extensions": [
                      "ova"
                    ],
                    "type": "application/x-virtualbox-ova",
                    "source": "mime-db"
                  },
                  "application/x-virtualbox-ovf": {
                    "compressible": true,
                    "extensions": [
                      "ovf"
                    ],
                    "type": "application/x-virtualbox-ovf",
                    "source": "mime-db"
                  },
                  "application/x-virtualbox-vbox": {
                    "compressible": true,
                    "extensions": [
                      "vbox"
                    ],
                    "type": "application/x-virtualbox-vbox",
                    "source": "mime-db"
                  },
                  "application/x-virtualbox-vbox-extpack": {
                    "compressible": false,
                    "extensions": [
                      "vbox-extpack"
                    ],
                    "type": "application/x-virtualbox-vbox-extpack",
                    "source": "mime-db"
                  },
                  "application/x-virtualbox-vdi": {
                    "compressible": true,
                    "extensions": [
                      "vdi"
                    ],
                    "type": "application/x-virtualbox-vdi",
                    "source": "mime-db"
                  },
                  "application/x-virtualbox-vhd": {
                    "compressible": true,
                    "extensions": [
                      "vhd"
                    ],
                    "type": "application/x-virtualbox-vhd",
                    "source": "mime-db"
                  },
                  "application/x-virtualbox-vmdk": {
                    "compressible": true,
                    "extensions": [
                      "vmdk"
                    ],
                    "type": "application/x-virtualbox-vmdk",
                    "source": "mime-db"
                  },
                  "application/x-wais-source": {
                    "source": "apache",
                    "extensions": [
                      "src"
                    ],
                    "type": "application/x-wais-source",
                    "compressible": false
                  },
                  "application/x-web-app-manifest+json": {
                    "compressible": true,
                    "extensions": [
                      "webapp"
                    ],
                    "type": "application/x-web-app-manifest+json",
                    "source": "mime-db"
                  },
                  "application/x-www-form-urlencoded": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/x-www-form-urlencoded",
                    "extensions": []
                  },
                  "application/x-x509-ca-cert": {
                    "source": "apache",
                    "extensions": [
                      "der",
                      "crt",
                      "pem"
                    ],
                    "type": "application/x-x509-ca-cert",
                    "compressible": false
                  },
                  "application/x-xfig": {
                    "source": "apache",
                    "extensions": [
                      "fig"
                    ],
                    "type": "application/x-xfig",
                    "compressible": false
                  },
                  "application/x-xliff+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "xlf"
                    ],
                    "type": "application/x-xliff+xml"
                  },
                  "application/x-xpinstall": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "xpi"
                    ],
                    "type": "application/x-xpinstall"
                  },
                  "application/x-xz": {
                    "source": "apache",
                    "extensions": [
                      "xz"
                    ],
                    "type": "application/x-xz",
                    "compressible": false
                  },
                  "application/x-zmachine": {
                    "source": "apache",
                    "extensions": [
                      "z1",
                      "z2",
                      "z3",
                      "z4",
                      "z5",
                      "z6",
                      "z7",
                      "z8"
                    ],
                    "type": "application/x-zmachine",
                    "compressible": false
                  },
                  "application/x400-bp": {
                    "source": "iana",
                    "type": "application/x400-bp",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/xacml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xacml+xml",
                    "extensions": []
                  },
                  "application/xaml+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "xaml"
                    ],
                    "type": "application/xaml+xml"
                  },
                  "application/xcap-att+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xcap-att+xml",
                    "extensions": []
                  },
                  "application/xcap-caps+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xcap-caps+xml",
                    "extensions": []
                  },
                  "application/xcap-diff+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xdf"
                    ],
                    "type": "application/xcap-diff+xml"
                  },
                  "application/xcap-el+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xcap-el+xml",
                    "extensions": []
                  },
                  "application/xcap-error+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xcap-error+xml",
                    "extensions": []
                  },
                  "application/xcap-ns+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xcap-ns+xml",
                    "extensions": []
                  },
                  "application/xcon-conference-info+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xcon-conference-info+xml",
                    "extensions": []
                  },
                  "application/xcon-conference-info-diff+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xcon-conference-info-diff+xml",
                    "extensions": []
                  },
                  "application/xenc+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xenc"
                    ],
                    "type": "application/xenc+xml"
                  },
                  "application/xhtml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xhtml",
                      "xht"
                    ],
                    "type": "application/xhtml+xml"
                  },
                  "application/xhtml-voice+xml": {
                    "source": "apache",
                    "compressible": true,
                    "type": "application/xhtml-voice+xml",
                    "extensions": []
                  },
                  "application/xliff+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xliff+xml",
                    "extensions": []
                  },
                  "application/xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xml",
                      "xsl",
                      "xsd",
                      "rng"
                    ],
                    "type": "application/xml"
                  },
                  "application/xml-dtd": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "dtd"
                    ],
                    "type": "application/xml-dtd"
                  },
                  "application/xml-external-parsed-entity": {
                    "source": "iana",
                    "type": "application/xml-external-parsed-entity",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/xml-patch+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xml-patch+xml",
                    "extensions": []
                  },
                  "application/xmpp+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/xmpp+xml",
                    "extensions": []
                  },
                  "application/xop+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xop"
                    ],
                    "type": "application/xop+xml"
                  },
                  "application/xproc+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "xpl"
                    ],
                    "type": "application/xproc+xml"
                  },
                  "application/xslt+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xslt"
                    ],
                    "type": "application/xslt+xml"
                  },
                  "application/xspf+xml": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "xspf"
                    ],
                    "type": "application/xspf+xml"
                  },
                  "application/xv+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "mxml",
                      "xhvml",
                      "xvml",
                      "xvm"
                    ],
                    "type": "application/xv+xml"
                  },
                  "application/yang": {
                    "source": "iana",
                    "extensions": [
                      "yang"
                    ],
                    "type": "application/yang",
                    "compressible": false
                  },
                  "application/yang-data+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/yang-data+json",
                    "extensions": []
                  },
                  "application/yang-data+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/yang-data+xml",
                    "extensions": []
                  },
                  "application/yang-patch+json": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/yang-patch+json",
                    "extensions": []
                  },
                  "application/yang-patch+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "application/yang-patch+xml",
                    "extensions": []
                  },
                  "application/yin+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "yin"
                    ],
                    "type": "application/yin+xml"
                  },
                  "application/zip": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "zip"
                    ],
                    "type": "application/zip"
                  },
                  "application/zlib": {
                    "source": "iana",
                    "type": "application/zlib",
                    "extensions": [],
                    "compressible": false
                  },
                  "application/zstd": {
                    "source": "iana",
                    "type": "application/zstd",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/1d-interleaved-parityfec": {
                    "source": "iana",
                    "type": "audio/1d-interleaved-parityfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/32kadpcm": {
                    "source": "iana",
                    "type": "audio/32kadpcm",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/3gpp": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "3gpp"
                    ],
                    "type": "audio/3gpp"
                  },
                  "audio/3gpp2": {
                    "source": "iana",
                    "type": "audio/3gpp2",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/aac": {
                    "source": "iana",
                    "type": "audio/aac",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/ac3": {
                    "source": "iana",
                    "type": "audio/ac3",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/adpcm": {
                    "source": "apache",
                    "extensions": [
                      "adp"
                    ],
                    "type": "audio/adpcm",
                    "compressible": false
                  },
                  "audio/amr": {
                    "source": "iana",
                    "type": "audio/amr",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/amr-wb": {
                    "source": "iana",
                    "type": "audio/amr-wb",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/amr-wb+": {
                    "source": "iana",
                    "type": "audio/amr-wb+",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/aptx": {
                    "source": "iana",
                    "type": "audio/aptx",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/asc": {
                    "source": "iana",
                    "type": "audio/asc",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/atrac-advanced-lossless": {
                    "source": "iana",
                    "type": "audio/atrac-advanced-lossless",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/atrac-x": {
                    "source": "iana",
                    "type": "audio/atrac-x",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/atrac3": {
                    "source": "iana",
                    "type": "audio/atrac3",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/basic": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "au",
                      "snd"
                    ],
                    "type": "audio/basic"
                  },
                  "audio/bv16": {
                    "source": "iana",
                    "type": "audio/bv16",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/bv32": {
                    "source": "iana",
                    "type": "audio/bv32",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/clearmode": {
                    "source": "iana",
                    "type": "audio/clearmode",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/cn": {
                    "source": "iana",
                    "type": "audio/cn",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dat12": {
                    "source": "iana",
                    "type": "audio/dat12",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dls": {
                    "source": "iana",
                    "type": "audio/dls",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dsr-es201108": {
                    "source": "iana",
                    "type": "audio/dsr-es201108",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dsr-es202050": {
                    "source": "iana",
                    "type": "audio/dsr-es202050",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dsr-es202211": {
                    "source": "iana",
                    "type": "audio/dsr-es202211",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dsr-es202212": {
                    "source": "iana",
                    "type": "audio/dsr-es202212",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dv": {
                    "source": "iana",
                    "type": "audio/dv",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/dvi4": {
                    "source": "iana",
                    "type": "audio/dvi4",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/eac3": {
                    "source": "iana",
                    "type": "audio/eac3",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/encaprtp": {
                    "source": "iana",
                    "type": "audio/encaprtp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrc": {
                    "source": "iana",
                    "type": "audio/evrc",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrc-qcp": {
                    "source": "iana",
                    "type": "audio/evrc-qcp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrc0": {
                    "source": "iana",
                    "type": "audio/evrc0",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrc1": {
                    "source": "iana",
                    "type": "audio/evrc1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcb": {
                    "source": "iana",
                    "type": "audio/evrcb",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcb0": {
                    "source": "iana",
                    "type": "audio/evrcb0",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcb1": {
                    "source": "iana",
                    "type": "audio/evrcb1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcnw": {
                    "source": "iana",
                    "type": "audio/evrcnw",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcnw0": {
                    "source": "iana",
                    "type": "audio/evrcnw0",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcnw1": {
                    "source": "iana",
                    "type": "audio/evrcnw1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcwb": {
                    "source": "iana",
                    "type": "audio/evrcwb",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcwb0": {
                    "source": "iana",
                    "type": "audio/evrcwb0",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evrcwb1": {
                    "source": "iana",
                    "type": "audio/evrcwb1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/evs": {
                    "source": "iana",
                    "type": "audio/evs",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/flexfec": {
                    "source": "iana",
                    "type": "audio/flexfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/fwdred": {
                    "source": "iana",
                    "type": "audio/fwdred",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g711-0": {
                    "source": "iana",
                    "type": "audio/g711-0",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g719": {
                    "source": "iana",
                    "type": "audio/g719",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g722": {
                    "source": "iana",
                    "type": "audio/g722",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g7221": {
                    "source": "iana",
                    "type": "audio/g7221",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g723": {
                    "source": "iana",
                    "type": "audio/g723",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g726-16": {
                    "source": "iana",
                    "type": "audio/g726-16",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g726-24": {
                    "source": "iana",
                    "type": "audio/g726-24",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g726-32": {
                    "source": "iana",
                    "type": "audio/g726-32",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g726-40": {
                    "source": "iana",
                    "type": "audio/g726-40",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g728": {
                    "source": "iana",
                    "type": "audio/g728",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g729": {
                    "source": "iana",
                    "type": "audio/g729",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g7291": {
                    "source": "iana",
                    "type": "audio/g7291",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g729d": {
                    "source": "iana",
                    "type": "audio/g729d",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/g729e": {
                    "source": "iana",
                    "type": "audio/g729e",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/gsm": {
                    "source": "iana",
                    "type": "audio/gsm",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/gsm-efr": {
                    "source": "iana",
                    "type": "audio/gsm-efr",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/gsm-hr-08": {
                    "source": "iana",
                    "type": "audio/gsm-hr-08",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/ilbc": {
                    "source": "iana",
                    "type": "audio/ilbc",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/ip-mr_v2.5": {
                    "source": "iana",
                    "type": "audio/ip-mr_v2.5",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/isac": {
                    "source": "apache",
                    "type": "audio/isac",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/l16": {
                    "source": "iana",
                    "type": "audio/l16",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/l20": {
                    "source": "iana",
                    "type": "audio/l20",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/l24": {
                    "source": "iana",
                    "compressible": false,
                    "type": "audio/l24",
                    "extensions": []
                  },
                  "audio/l8": {
                    "source": "iana",
                    "type": "audio/l8",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/lpc": {
                    "source": "iana",
                    "type": "audio/lpc",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/melp": {
                    "source": "iana",
                    "type": "audio/melp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/melp1200": {
                    "source": "iana",
                    "type": "audio/melp1200",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/melp2400": {
                    "source": "iana",
                    "type": "audio/melp2400",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/melp600": {
                    "source": "iana",
                    "type": "audio/melp600",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/midi": {
                    "source": "apache",
                    "extensions": [
                      "mid",
                      "midi",
                      "kar",
                      "rmi"
                    ],
                    "type": "audio/midi",
                    "compressible": false
                  },
                  "audio/mobile-xmf": {
                    "source": "iana",
                    "type": "audio/mobile-xmf",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/mp3": {
                    "compressible": false,
                    "extensions": [
                      "mp3"
                    ],
                    "type": "audio/mp3",
                    "source": "mime-db"
                  },
                  "audio/mp4": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "m4a",
                      "mp4a"
                    ],
                    "type": "audio/mp4"
                  },
                  "audio/mp4a-latm": {
                    "source": "iana",
                    "type": "audio/mp4a-latm",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/mpa": {
                    "source": "iana",
                    "type": "audio/mpa",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/mpa-robust": {
                    "source": "iana",
                    "type": "audio/mpa-robust",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/mpeg": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "mpga",
                      "mp2",
                      "mp2a",
                      "mp3",
                      "m2a",
                      "m3a"
                    ],
                    "type": "audio/mpeg"
                  },
                  "audio/mpeg4-generic": {
                    "source": "iana",
                    "type": "audio/mpeg4-generic",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/musepack": {
                    "source": "apache",
                    "type": "audio/musepack",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/ogg": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "oga",
                      "ogg",
                      "spx"
                    ],
                    "type": "audio/ogg"
                  },
                  "audio/opus": {
                    "source": "iana",
                    "type": "audio/opus",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/parityfec": {
                    "source": "iana",
                    "type": "audio/parityfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/pcma": {
                    "source": "iana",
                    "type": "audio/pcma",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/pcma-wb": {
                    "source": "iana",
                    "type": "audio/pcma-wb",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/pcmu": {
                    "source": "iana",
                    "type": "audio/pcmu",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/pcmu-wb": {
                    "source": "iana",
                    "type": "audio/pcmu-wb",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/prs.sid": {
                    "source": "iana",
                    "type": "audio/prs.sid",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/qcelp": {
                    "source": "iana",
                    "type": "audio/qcelp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/raptorfec": {
                    "source": "iana",
                    "type": "audio/raptorfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/red": {
                    "source": "iana",
                    "type": "audio/red",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/rtp-enc-aescm128": {
                    "source": "iana",
                    "type": "audio/rtp-enc-aescm128",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/rtp-midi": {
                    "source": "iana",
                    "type": "audio/rtp-midi",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/rtploopback": {
                    "source": "iana",
                    "type": "audio/rtploopback",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/rtx": {
                    "source": "iana",
                    "type": "audio/rtx",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/s3m": {
                    "source": "apache",
                    "extensions": [
                      "s3m"
                    ],
                    "type": "audio/s3m",
                    "compressible": false
                  },
                  "audio/silk": {
                    "source": "apache",
                    "extensions": [
                      "sil"
                    ],
                    "type": "audio/silk",
                    "compressible": false
                  },
                  "audio/smv": {
                    "source": "iana",
                    "type": "audio/smv",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/smv-qcp": {
                    "source": "iana",
                    "type": "audio/smv-qcp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/smv0": {
                    "source": "iana",
                    "type": "audio/smv0",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/sp-midi": {
                    "source": "iana",
                    "type": "audio/sp-midi",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/speex": {
                    "source": "iana",
                    "type": "audio/speex",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/t140c": {
                    "source": "iana",
                    "type": "audio/t140c",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/t38": {
                    "source": "iana",
                    "type": "audio/t38",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/telephone-event": {
                    "source": "iana",
                    "type": "audio/telephone-event",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/tetra_acelp": {
                    "source": "iana",
                    "type": "audio/tetra_acelp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/tone": {
                    "source": "iana",
                    "type": "audio/tone",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/uemclip": {
                    "source": "iana",
                    "type": "audio/uemclip",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/ulpfec": {
                    "source": "iana",
                    "type": "audio/ulpfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/usac": {
                    "source": "iana",
                    "type": "audio/usac",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vdvi": {
                    "source": "iana",
                    "type": "audio/vdvi",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vmr-wb": {
                    "source": "iana",
                    "type": "audio/vmr-wb",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.3gpp.iufp": {
                    "source": "iana",
                    "type": "audio/vnd.3gpp.iufp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.4sb": {
                    "source": "iana",
                    "type": "audio/vnd.4sb",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.audiokoz": {
                    "source": "iana",
                    "type": "audio/vnd.audiokoz",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.celp": {
                    "source": "iana",
                    "type": "audio/vnd.celp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.cisco.nse": {
                    "source": "iana",
                    "type": "audio/vnd.cisco.nse",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.cmles.radio-events": {
                    "source": "iana",
                    "type": "audio/vnd.cmles.radio-events",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.cns.anp1": {
                    "source": "iana",
                    "type": "audio/vnd.cns.anp1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.cns.inf1": {
                    "source": "iana",
                    "type": "audio/vnd.cns.inf1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dece.audio": {
                    "source": "iana",
                    "extensions": [
                      "uva",
                      "uvva"
                    ],
                    "type": "audio/vnd.dece.audio",
                    "compressible": false
                  },
                  "audio/vnd.digital-winds": {
                    "source": "iana",
                    "extensions": [
                      "eol"
                    ],
                    "type": "audio/vnd.digital-winds",
                    "compressible": false
                  },
                  "audio/vnd.dlna.adts": {
                    "source": "iana",
                    "type": "audio/vnd.dlna.adts",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.heaac.1": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.heaac.1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.heaac.2": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.heaac.2",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.mlp": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.mlp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.mps": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.mps",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.pl2": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.pl2",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.pl2x": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.pl2x",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.pl2z": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.pl2z",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dolby.pulse.1": {
                    "source": "iana",
                    "type": "audio/vnd.dolby.pulse.1",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dra": {
                    "source": "iana",
                    "extensions": [
                      "dra"
                    ],
                    "type": "audio/vnd.dra",
                    "compressible": false
                  },
                  "audio/vnd.dts": {
                    "source": "iana",
                    "extensions": [
                      "dts"
                    ],
                    "type": "audio/vnd.dts",
                    "compressible": false
                  },
                  "audio/vnd.dts.hd": {
                    "source": "iana",
                    "extensions": [
                      "dtshd"
                    ],
                    "type": "audio/vnd.dts.hd",
                    "compressible": false
                  },
                  "audio/vnd.dts.uhd": {
                    "source": "iana",
                    "type": "audio/vnd.dts.uhd",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.dvb.file": {
                    "source": "iana",
                    "type": "audio/vnd.dvb.file",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.everad.plj": {
                    "source": "iana",
                    "type": "audio/vnd.everad.plj",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.hns.audio": {
                    "source": "iana",
                    "type": "audio/vnd.hns.audio",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.lucent.voice": {
                    "source": "iana",
                    "extensions": [
                      "lvp"
                    ],
                    "type": "audio/vnd.lucent.voice",
                    "compressible": false
                  },
                  "audio/vnd.ms-playready.media.pya": {
                    "source": "iana",
                    "extensions": [
                      "pya"
                    ],
                    "type": "audio/vnd.ms-playready.media.pya",
                    "compressible": false
                  },
                  "audio/vnd.nokia.mobile-xmf": {
                    "source": "iana",
                    "type": "audio/vnd.nokia.mobile-xmf",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.nortel.vbk": {
                    "source": "iana",
                    "type": "audio/vnd.nortel.vbk",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.nuera.ecelp4800": {
                    "source": "iana",
                    "extensions": [
                      "ecelp4800"
                    ],
                    "type": "audio/vnd.nuera.ecelp4800",
                    "compressible": false
                  },
                  "audio/vnd.nuera.ecelp7470": {
                    "source": "iana",
                    "extensions": [
                      "ecelp7470"
                    ],
                    "type": "audio/vnd.nuera.ecelp7470",
                    "compressible": false
                  },
                  "audio/vnd.nuera.ecelp9600": {
                    "source": "iana",
                    "extensions": [
                      "ecelp9600"
                    ],
                    "type": "audio/vnd.nuera.ecelp9600",
                    "compressible": false
                  },
                  "audio/vnd.octel.sbc": {
                    "source": "iana",
                    "type": "audio/vnd.octel.sbc",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.presonus.multitrack": {
                    "source": "iana",
                    "type": "audio/vnd.presonus.multitrack",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.qcelp": {
                    "source": "iana",
                    "type": "audio/vnd.qcelp",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.rhetorex.32kadpcm": {
                    "source": "iana",
                    "type": "audio/vnd.rhetorex.32kadpcm",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.rip": {
                    "source": "iana",
                    "extensions": [
                      "rip"
                    ],
                    "type": "audio/vnd.rip",
                    "compressible": false
                  },
                  "audio/vnd.rn-realaudio": {
                    "compressible": false,
                    "type": "audio/vnd.rn-realaudio",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "audio/vnd.sealedmedia.softseal.mpeg": {
                    "source": "iana",
                    "type": "audio/vnd.sealedmedia.softseal.mpeg",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.vmx.cvsd": {
                    "source": "iana",
                    "type": "audio/vnd.vmx.cvsd",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/vnd.wave": {
                    "compressible": false,
                    "type": "audio/vnd.wave",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "audio/vorbis": {
                    "source": "iana",
                    "compressible": false,
                    "type": "audio/vorbis",
                    "extensions": []
                  },
                  "audio/vorbis-config": {
                    "source": "iana",
                    "type": "audio/vorbis-config",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/wav": {
                    "compressible": false,
                    "extensions": [
                      "wav"
                    ],
                    "type": "audio/wav",
                    "source": "mime-db"
                  },
                  "audio/wave": {
                    "compressible": false,
                    "extensions": [
                      "wav"
                    ],
                    "type": "audio/wave",
                    "source": "mime-db"
                  },
                  "audio/webm": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "weba"
                    ],
                    "type": "audio/webm"
                  },
                  "audio/x-aac": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "aac"
                    ],
                    "type": "audio/x-aac"
                  },
                  "audio/x-aiff": {
                    "source": "apache",
                    "extensions": [
                      "aif",
                      "aiff",
                      "aifc"
                    ],
                    "type": "audio/x-aiff",
                    "compressible": false
                  },
                  "audio/x-caf": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "caf"
                    ],
                    "type": "audio/x-caf"
                  },
                  "audio/x-flac": {
                    "source": "apache",
                    "extensions": [
                      "flac"
                    ],
                    "type": "audio/x-flac",
                    "compressible": false
                  },
                  "audio/x-m4a": {
                    "source": "nginx",
                    "extensions": [
                      "m4a"
                    ],
                    "type": "audio/x-m4a",
                    "compressible": false
                  },
                  "audio/x-matroska": {
                    "source": "apache",
                    "extensions": [
                      "mka"
                    ],
                    "type": "audio/x-matroska",
                    "compressible": false
                  },
                  "audio/x-mpegurl": {
                    "source": "apache",
                    "extensions": [
                      "m3u"
                    ],
                    "type": "audio/x-mpegurl",
                    "compressible": false
                  },
                  "audio/x-ms-wax": {
                    "source": "apache",
                    "extensions": [
                      "wax"
                    ],
                    "type": "audio/x-ms-wax",
                    "compressible": false
                  },
                  "audio/x-ms-wma": {
                    "source": "apache",
                    "extensions": [
                      "wma"
                    ],
                    "type": "audio/x-ms-wma",
                    "compressible": false
                  },
                  "audio/x-pn-realaudio": {
                    "source": "apache",
                    "extensions": [
                      "ram",
                      "ra"
                    ],
                    "type": "audio/x-pn-realaudio",
                    "compressible": false
                  },
                  "audio/x-pn-realaudio-plugin": {
                    "source": "apache",
                    "extensions": [
                      "rmp"
                    ],
                    "type": "audio/x-pn-realaudio-plugin",
                    "compressible": false
                  },
                  "audio/x-realaudio": {
                    "source": "nginx",
                    "extensions": [
                      "ra"
                    ],
                    "type": "audio/x-realaudio",
                    "compressible": false
                  },
                  "audio/x-tta": {
                    "source": "apache",
                    "type": "audio/x-tta",
                    "extensions": [],
                    "compressible": false
                  },
                  "audio/x-wav": {
                    "source": "apache",
                    "extensions": [
                      "wav"
                    ],
                    "type": "audio/x-wav",
                    "compressible": false
                  },
                  "audio/xm": {
                    "source": "apache",
                    "extensions": [
                      "xm"
                    ],
                    "type": "audio/xm",
                    "compressible": false
                  },
                  "chemical/x-cdx": {
                    "source": "apache",
                    "extensions": [
                      "cdx"
                    ],
                    "type": "chemical/x-cdx",
                    "compressible": false
                  },
                  "chemical/x-cif": {
                    "source": "apache",
                    "extensions": [
                      "cif"
                    ],
                    "type": "chemical/x-cif",
                    "compressible": false
                  },
                  "chemical/x-cmdf": {
                    "source": "apache",
                    "extensions": [
                      "cmdf"
                    ],
                    "type": "chemical/x-cmdf",
                    "compressible": false
                  },
                  "chemical/x-cml": {
                    "source": "apache",
                    "extensions": [
                      "cml"
                    ],
                    "type": "chemical/x-cml",
                    "compressible": false
                  },
                  "chemical/x-csml": {
                    "source": "apache",
                    "extensions": [
                      "csml"
                    ],
                    "type": "chemical/x-csml",
                    "compressible": false
                  },
                  "chemical/x-pdb": {
                    "source": "apache",
                    "type": "chemical/x-pdb",
                    "extensions": [],
                    "compressible": false
                  },
                  "chemical/x-xyz": {
                    "source": "apache",
                    "extensions": [
                      "xyz"
                    ],
                    "type": "chemical/x-xyz",
                    "compressible": false
                  },
                  "font/collection": {
                    "source": "iana",
                    "extensions": [
                      "ttc"
                    ],
                    "type": "font/collection",
                    "compressible": false
                  },
                  "font/otf": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "otf"
                    ],
                    "type": "font/otf"
                  },
                  "font/sfnt": {
                    "source": "iana",
                    "type": "font/sfnt",
                    "extensions": [],
                    "compressible": false
                  },
                  "font/ttf": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "ttf"
                    ],
                    "type": "font/ttf"
                  },
                  "font/woff": {
                    "source": "iana",
                    "extensions": [
                      "woff"
                    ],
                    "type": "font/woff",
                    "compressible": false
                  },
                  "font/woff2": {
                    "source": "iana",
                    "extensions": [
                      "woff2"
                    ],
                    "type": "font/woff2",
                    "compressible": false
                  },
                  "image/aces": {
                    "source": "iana",
                    "extensions": [
                      "exr"
                    ],
                    "type": "image/aces",
                    "compressible": false
                  },
                  "image/apng": {
                    "compressible": false,
                    "extensions": [
                      "apng"
                    ],
                    "type": "image/apng",
                    "source": "mime-db"
                  },
                  "image/avci": {
                    "source": "iana",
                    "type": "image/avci",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/avcs": {
                    "source": "iana",
                    "type": "image/avcs",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/bmp": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "bmp"
                    ],
                    "type": "image/bmp"
                  },
                  "image/cgm": {
                    "source": "iana",
                    "extensions": [
                      "cgm"
                    ],
                    "type": "image/cgm",
                    "compressible": false
                  },
                  "image/dicom-rle": {
                    "source": "iana",
                    "extensions": [
                      "drle"
                    ],
                    "type": "image/dicom-rle",
                    "compressible": false
                  },
                  "image/emf": {
                    "source": "iana",
                    "extensions": [
                      "emf"
                    ],
                    "type": "image/emf",
                    "compressible": false
                  },
                  "image/fits": {
                    "source": "iana",
                    "extensions": [
                      "fits"
                    ],
                    "type": "image/fits",
                    "compressible": false
                  },
                  "image/g3fax": {
                    "source": "iana",
                    "extensions": [
                      "g3"
                    ],
                    "type": "image/g3fax",
                    "compressible": false
                  },
                  "image/gif": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "gif"
                    ],
                    "type": "image/gif"
                  },
                  "image/heic": {
                    "source": "iana",
                    "extensions": [
                      "heic"
                    ],
                    "type": "image/heic",
                    "compressible": false
                  },
                  "image/heic-sequence": {
                    "source": "iana",
                    "extensions": [
                      "heics"
                    ],
                    "type": "image/heic-sequence",
                    "compressible": false
                  },
                  "image/heif": {
                    "source": "iana",
                    "extensions": [
                      "heif"
                    ],
                    "type": "image/heif",
                    "compressible": false
                  },
                  "image/heif-sequence": {
                    "source": "iana",
                    "extensions": [
                      "heifs"
                    ],
                    "type": "image/heif-sequence",
                    "compressible": false
                  },
                  "image/hej2k": {
                    "source": "iana",
                    "extensions": [
                      "hej2"
                    ],
                    "type": "image/hej2k",
                    "compressible": false
                  },
                  "image/hsj2": {
                    "source": "iana",
                    "extensions": [
                      "hsj2"
                    ],
                    "type": "image/hsj2",
                    "compressible": false
                  },
                  "image/ief": {
                    "source": "iana",
                    "extensions": [
                      "ief"
                    ],
                    "type": "image/ief",
                    "compressible": false
                  },
                  "image/jls": {
                    "source": "iana",
                    "extensions": [
                      "jls"
                    ],
                    "type": "image/jls",
                    "compressible": false
                  },
                  "image/jp2": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "jp2",
                      "jpg2"
                    ],
                    "type": "image/jp2"
                  },
                  "image/jpeg": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "jpeg",
                      "jpg",
                      "jpe"
                    ],
                    "type": "image/jpeg"
                  },
                  "image/jph": {
                    "source": "iana",
                    "extensions": [
                      "jph"
                    ],
                    "type": "image/jph",
                    "compressible": false
                  },
                  "image/jphc": {
                    "source": "iana",
                    "extensions": [
                      "jhc"
                    ],
                    "type": "image/jphc",
                    "compressible": false
                  },
                  "image/jpm": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "jpm"
                    ],
                    "type": "image/jpm"
                  },
                  "image/jpx": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "jpx",
                      "jpf"
                    ],
                    "type": "image/jpx"
                  },
                  "image/jxr": {
                    "source": "iana",
                    "extensions": [
                      "jxr"
                    ],
                    "type": "image/jxr",
                    "compressible": false
                  },
                  "image/jxra": {
                    "source": "iana",
                    "extensions": [
                      "jxra"
                    ],
                    "type": "image/jxra",
                    "compressible": false
                  },
                  "image/jxrs": {
                    "source": "iana",
                    "extensions": [
                      "jxrs"
                    ],
                    "type": "image/jxrs",
                    "compressible": false
                  },
                  "image/jxs": {
                    "source": "iana",
                    "extensions": [
                      "jxs"
                    ],
                    "type": "image/jxs",
                    "compressible": false
                  },
                  "image/jxsc": {
                    "source": "iana",
                    "extensions": [
                      "jxsc"
                    ],
                    "type": "image/jxsc",
                    "compressible": false
                  },
                  "image/jxsi": {
                    "source": "iana",
                    "extensions": [
                      "jxsi"
                    ],
                    "type": "image/jxsi",
                    "compressible": false
                  },
                  "image/jxss": {
                    "source": "iana",
                    "extensions": [
                      "jxss"
                    ],
                    "type": "image/jxss",
                    "compressible": false
                  },
                  "image/ktx": {
                    "source": "iana",
                    "extensions": [
                      "ktx"
                    ],
                    "type": "image/ktx",
                    "compressible": false
                  },
                  "image/naplps": {
                    "source": "iana",
                    "type": "image/naplps",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/pjpeg": {
                    "compressible": false,
                    "type": "image/pjpeg",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "image/png": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "png"
                    ],
                    "type": "image/png"
                  },
                  "image/prs.btif": {
                    "source": "iana",
                    "extensions": [
                      "btif"
                    ],
                    "type": "image/prs.btif",
                    "compressible": false
                  },
                  "image/prs.pti": {
                    "source": "iana",
                    "extensions": [
                      "pti"
                    ],
                    "type": "image/prs.pti",
                    "compressible": false
                  },
                  "image/pwg-raster": {
                    "source": "iana",
                    "type": "image/pwg-raster",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/sgi": {
                    "source": "apache",
                    "extensions": [
                      "sgi"
                    ],
                    "type": "image/sgi",
                    "compressible": false
                  },
                  "image/svg+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "svg",
                      "svgz"
                    ],
                    "type": "image/svg+xml"
                  },
                  "image/t38": {
                    "source": "iana",
                    "extensions": [
                      "t38"
                    ],
                    "type": "image/t38",
                    "compressible": false
                  },
                  "image/tiff": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "tif",
                      "tiff"
                    ],
                    "type": "image/tiff"
                  },
                  "image/tiff-fx": {
                    "source": "iana",
                    "extensions": [
                      "tfx"
                    ],
                    "type": "image/tiff-fx",
                    "compressible": false
                  },
                  "image/vnd.adobe.photoshop": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "psd"
                    ],
                    "type": "image/vnd.adobe.photoshop"
                  },
                  "image/vnd.airzip.accelerator.azv": {
                    "source": "iana",
                    "extensions": [
                      "azv"
                    ],
                    "type": "image/vnd.airzip.accelerator.azv",
                    "compressible": false
                  },
                  "image/vnd.cns.inf2": {
                    "source": "iana",
                    "type": "image/vnd.cns.inf2",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.dece.graphic": {
                    "source": "iana",
                    "extensions": [
                      "uvi",
                      "uvvi",
                      "uvg",
                      "uvvg"
                    ],
                    "type": "image/vnd.dece.graphic",
                    "compressible": false
                  },
                  "image/vnd.djvu": {
                    "source": "iana",
                    "extensions": [
                      "djvu",
                      "djv"
                    ],
                    "type": "image/vnd.djvu",
                    "compressible": false
                  },
                  "image/vnd.dvb.subtitle": {
                    "source": "iana",
                    "extensions": [
                      "sub"
                    ],
                    "type": "image/vnd.dvb.subtitle",
                    "compressible": false
                  },
                  "image/vnd.dwg": {
                    "source": "iana",
                    "extensions": [
                      "dwg"
                    ],
                    "type": "image/vnd.dwg",
                    "compressible": false
                  },
                  "image/vnd.dxf": {
                    "source": "iana",
                    "extensions": [
                      "dxf"
                    ],
                    "type": "image/vnd.dxf",
                    "compressible": false
                  },
                  "image/vnd.fastbidsheet": {
                    "source": "iana",
                    "extensions": [
                      "fbs"
                    ],
                    "type": "image/vnd.fastbidsheet",
                    "compressible": false
                  },
                  "image/vnd.fpx": {
                    "source": "iana",
                    "extensions": [
                      "fpx"
                    ],
                    "type": "image/vnd.fpx",
                    "compressible": false
                  },
                  "image/vnd.fst": {
                    "source": "iana",
                    "extensions": [
                      "fst"
                    ],
                    "type": "image/vnd.fst",
                    "compressible": false
                  },
                  "image/vnd.fujixerox.edmics-mmr": {
                    "source": "iana",
                    "extensions": [
                      "mmr"
                    ],
                    "type": "image/vnd.fujixerox.edmics-mmr",
                    "compressible": false
                  },
                  "image/vnd.fujixerox.edmics-rlc": {
                    "source": "iana",
                    "extensions": [
                      "rlc"
                    ],
                    "type": "image/vnd.fujixerox.edmics-rlc",
                    "compressible": false
                  },
                  "image/vnd.globalgraphics.pgb": {
                    "source": "iana",
                    "type": "image/vnd.globalgraphics.pgb",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.microsoft.icon": {
                    "source": "iana",
                    "extensions": [
                      "ico"
                    ],
                    "type": "image/vnd.microsoft.icon",
                    "compressible": false
                  },
                  "image/vnd.mix": {
                    "source": "iana",
                    "type": "image/vnd.mix",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.mozilla.apng": {
                    "source": "iana",
                    "type": "image/vnd.mozilla.apng",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.ms-dds": {
                    "extensions": [
                      "dds"
                    ],
                    "type": "image/vnd.ms-dds",
                    "source": "mime-db",
                    "compressible": false
                  },
                  "image/vnd.ms-modi": {
                    "source": "iana",
                    "extensions": [
                      "mdi"
                    ],
                    "type": "image/vnd.ms-modi",
                    "compressible": false
                  },
                  "image/vnd.ms-photo": {
                    "source": "apache",
                    "extensions": [
                      "wdp"
                    ],
                    "type": "image/vnd.ms-photo",
                    "compressible": false
                  },
                  "image/vnd.net-fpx": {
                    "source": "iana",
                    "extensions": [
                      "npx"
                    ],
                    "type": "image/vnd.net-fpx",
                    "compressible": false
                  },
                  "image/vnd.radiance": {
                    "source": "iana",
                    "type": "image/vnd.radiance",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.sealed.png": {
                    "source": "iana",
                    "type": "image/vnd.sealed.png",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.sealedmedia.softseal.gif": {
                    "source": "iana",
                    "type": "image/vnd.sealedmedia.softseal.gif",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.sealedmedia.softseal.jpg": {
                    "source": "iana",
                    "type": "image/vnd.sealedmedia.softseal.jpg",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.svf": {
                    "source": "iana",
                    "type": "image/vnd.svf",
                    "extensions": [],
                    "compressible": false
                  },
                  "image/vnd.tencent.tap": {
                    "source": "iana",
                    "extensions": [
                      "tap"
                    ],
                    "type": "image/vnd.tencent.tap",
                    "compressible": false
                  },
                  "image/vnd.valve.source.texture": {
                    "source": "iana",
                    "extensions": [
                      "vtf"
                    ],
                    "type": "image/vnd.valve.source.texture",
                    "compressible": false
                  },
                  "image/vnd.wap.wbmp": {
                    "source": "iana",
                    "extensions": [
                      "wbmp"
                    ],
                    "type": "image/vnd.wap.wbmp",
                    "compressible": false
                  },
                  "image/vnd.xiff": {
                    "source": "iana",
                    "extensions": [
                      "xif"
                    ],
                    "type": "image/vnd.xiff",
                    "compressible": false
                  },
                  "image/vnd.zbrush.pcx": {
                    "source": "iana",
                    "extensions": [
                      "pcx"
                    ],
                    "type": "image/vnd.zbrush.pcx",
                    "compressible": false
                  },
                  "image/webp": {
                    "source": "apache",
                    "extensions": [
                      "webp"
                    ],
                    "type": "image/webp",
                    "compressible": false
                  },
                  "image/wmf": {
                    "source": "iana",
                    "extensions": [
                      "wmf"
                    ],
                    "type": "image/wmf",
                    "compressible": false
                  },
                  "image/x-3ds": {
                    "source": "apache",
                    "extensions": [
                      "3ds"
                    ],
                    "type": "image/x-3ds",
                    "compressible": false
                  },
                  "image/x-cmu-raster": {
                    "source": "apache",
                    "extensions": [
                      "ras"
                    ],
                    "type": "image/x-cmu-raster",
                    "compressible": false
                  },
                  "image/x-cmx": {
                    "source": "apache",
                    "extensions": [
                      "cmx"
                    ],
                    "type": "image/x-cmx",
                    "compressible": false
                  },
                  "image/x-freehand": {
                    "source": "apache",
                    "extensions": [
                      "fh",
                      "fhc",
                      "fh4",
                      "fh5",
                      "fh7"
                    ],
                    "type": "image/x-freehand",
                    "compressible": false
                  },
                  "image/x-icon": {
                    "source": "apache",
                    "compressible": true,
                    "extensions": [
                      "ico"
                    ],
                    "type": "image/x-icon"
                  },
                  "image/x-jng": {
                    "source": "nginx",
                    "extensions": [
                      "jng"
                    ],
                    "type": "image/x-jng",
                    "compressible": false
                  },
                  "image/x-mrsid-image": {
                    "source": "apache",
                    "extensions": [
                      "sid"
                    ],
                    "type": "image/x-mrsid-image",
                    "compressible": false
                  },
                  "image/x-ms-bmp": {
                    "source": "nginx",
                    "compressible": true,
                    "extensions": [
                      "bmp"
                    ],
                    "type": "image/x-ms-bmp"
                  },
                  "image/x-pcx": {
                    "source": "apache",
                    "extensions": [
                      "pcx"
                    ],
                    "type": "image/x-pcx",
                    "compressible": false
                  },
                  "image/x-pict": {
                    "source": "apache",
                    "extensions": [
                      "pic",
                      "pct"
                    ],
                    "type": "image/x-pict",
                    "compressible": false
                  },
                  "image/x-portable-anymap": {
                    "source": "apache",
                    "extensions": [
                      "pnm"
                    ],
                    "type": "image/x-portable-anymap",
                    "compressible": false
                  },
                  "image/x-portable-bitmap": {
                    "source": "apache",
                    "extensions": [
                      "pbm"
                    ],
                    "type": "image/x-portable-bitmap",
                    "compressible": false
                  },
                  "image/x-portable-graymap": {
                    "source": "apache",
                    "extensions": [
                      "pgm"
                    ],
                    "type": "image/x-portable-graymap",
                    "compressible": false
                  },
                  "image/x-portable-pixmap": {
                    "source": "apache",
                    "extensions": [
                      "ppm"
                    ],
                    "type": "image/x-portable-pixmap",
                    "compressible": false
                  },
                  "image/x-rgb": {
                    "source": "apache",
                    "extensions": [
                      "rgb"
                    ],
                    "type": "image/x-rgb",
                    "compressible": false
                  },
                  "image/x-tga": {
                    "source": "apache",
                    "extensions": [
                      "tga"
                    ],
                    "type": "image/x-tga",
                    "compressible": false
                  },
                  "image/x-xbitmap": {
                    "source": "apache",
                    "extensions": [
                      "xbm"
                    ],
                    "type": "image/x-xbitmap",
                    "compressible": false
                  },
                  "image/x-xcf": {
                    "compressible": false,
                    "type": "image/x-xcf",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "image/x-xpixmap": {
                    "source": "apache",
                    "extensions": [
                      "xpm"
                    ],
                    "type": "image/x-xpixmap",
                    "compressible": false
                  },
                  "image/x-xwindowdump": {
                    "source": "apache",
                    "extensions": [
                      "xwd"
                    ],
                    "type": "image/x-xwindowdump",
                    "compressible": false
                  },
                  "message/cpim": {
                    "source": "iana",
                    "type": "message/cpim",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/delivery-status": {
                    "source": "iana",
                    "type": "message/delivery-status",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/disposition-notification": {
                    "source": "iana",
                    "extensions": [
                      "disposition-notification"
                    ],
                    "type": "message/disposition-notification",
                    "compressible": false
                  },
                  "message/external-body": {
                    "source": "iana",
                    "type": "message/external-body",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/feedback-report": {
                    "source": "iana",
                    "type": "message/feedback-report",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/global": {
                    "source": "iana",
                    "extensions": [
                      "u8msg"
                    ],
                    "type": "message/global",
                    "compressible": false
                  },
                  "message/global-delivery-status": {
                    "source": "iana",
                    "extensions": [
                      "u8dsn"
                    ],
                    "type": "message/global-delivery-status",
                    "compressible": false
                  },
                  "message/global-disposition-notification": {
                    "source": "iana",
                    "extensions": [
                      "u8mdn"
                    ],
                    "type": "message/global-disposition-notification",
                    "compressible": false
                  },
                  "message/global-headers": {
                    "source": "iana",
                    "extensions": [
                      "u8hdr"
                    ],
                    "type": "message/global-headers",
                    "compressible": false
                  },
                  "message/http": {
                    "source": "iana",
                    "compressible": false,
                    "type": "message/http",
                    "extensions": []
                  },
                  "message/imdn+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "message/imdn+xml",
                    "extensions": []
                  },
                  "message/news": {
                    "source": "iana",
                    "type": "message/news",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/partial": {
                    "source": "iana",
                    "compressible": false,
                    "type": "message/partial",
                    "extensions": []
                  },
                  "message/rfc822": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "eml",
                      "mime"
                    ],
                    "type": "message/rfc822"
                  },
                  "message/s-http": {
                    "source": "iana",
                    "type": "message/s-http",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/sip": {
                    "source": "iana",
                    "type": "message/sip",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/sipfrag": {
                    "source": "iana",
                    "type": "message/sipfrag",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/tracking-status": {
                    "source": "iana",
                    "type": "message/tracking-status",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/vnd.si.simp": {
                    "source": "iana",
                    "type": "message/vnd.si.simp",
                    "extensions": [],
                    "compressible": false
                  },
                  "message/vnd.wfa.wsc": {
                    "source": "iana",
                    "extensions": [
                      "wsc"
                    ],
                    "type": "message/vnd.wfa.wsc",
                    "compressible": false
                  },
                  "model/3mf": {
                    "source": "iana",
                    "extensions": [
                      "3mf"
                    ],
                    "type": "model/3mf",
                    "compressible": false
                  },
                  "model/gltf+json": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "gltf"
                    ],
                    "type": "model/gltf+json"
                  },
                  "model/gltf-binary": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "glb"
                    ],
                    "type": "model/gltf-binary"
                  },
                  "model/iges": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "igs",
                      "iges"
                    ],
                    "type": "model/iges"
                  },
                  "model/mesh": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "msh",
                      "mesh",
                      "silo"
                    ],
                    "type": "model/mesh"
                  },
                  "model/stl": {
                    "source": "iana",
                    "extensions": [
                      "stl"
                    ],
                    "type": "model/stl",
                    "compressible": false
                  },
                  "model/vnd.collada+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "dae"
                    ],
                    "type": "model/vnd.collada+xml"
                  },
                  "model/vnd.dwf": {
                    "source": "iana",
                    "extensions": [
                      "dwf"
                    ],
                    "type": "model/vnd.dwf",
                    "compressible": false
                  },
                  "model/vnd.flatland.3dml": {
                    "source": "iana",
                    "type": "model/vnd.flatland.3dml",
                    "extensions": [],
                    "compressible": false
                  },
                  "model/vnd.gdl": {
                    "source": "iana",
                    "extensions": [
                      "gdl"
                    ],
                    "type": "model/vnd.gdl",
                    "compressible": false
                  },
                  "model/vnd.gs-gdl": {
                    "source": "apache",
                    "type": "model/vnd.gs-gdl",
                    "extensions": [],
                    "compressible": false
                  },
                  "model/vnd.gs.gdl": {
                    "source": "iana",
                    "type": "model/vnd.gs.gdl",
                    "extensions": [],
                    "compressible": false
                  },
                  "model/vnd.gtw": {
                    "source": "iana",
                    "extensions": [
                      "gtw"
                    ],
                    "type": "model/vnd.gtw",
                    "compressible": false
                  },
                  "model/vnd.moml+xml": {
                    "source": "iana",
                    "compressible": true,
                    "type": "model/vnd.moml+xml",
                    "extensions": []
                  },
                  "model/vnd.mts": {
                    "source": "iana",
                    "extensions": [
                      "mts"
                    ],
                    "type": "model/vnd.mts",
                    "compressible": false
                  },
                  "model/vnd.opengex": {
                    "source": "iana",
                    "extensions": [
                      "ogex"
                    ],
                    "type": "model/vnd.opengex",
                    "compressible": false
                  },
                  "model/vnd.parasolid.transmit.binary": {
                    "source": "iana",
                    "extensions": [
                      "x_b"
                    ],
                    "type": "model/vnd.parasolid.transmit.binary",
                    "compressible": false
                  },
                  "model/vnd.parasolid.transmit.text": {
                    "source": "iana",
                    "extensions": [
                      "x_t"
                    ],
                    "type": "model/vnd.parasolid.transmit.text",
                    "compressible": false
                  },
                  "model/vnd.rosette.annotated-data-model": {
                    "source": "iana",
                    "type": "model/vnd.rosette.annotated-data-model",
                    "extensions": [],
                    "compressible": false
                  },
                  "model/vnd.usdz+zip": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "usdz"
                    ],
                    "type": "model/vnd.usdz+zip"
                  },
                  "model/vnd.valve.source.compiled-map": {
                    "source": "iana",
                    "extensions": [
                      "bsp"
                    ],
                    "type": "model/vnd.valve.source.compiled-map",
                    "compressible": false
                  },
                  "model/vnd.vtu": {
                    "source": "iana",
                    "extensions": [
                      "vtu"
                    ],
                    "type": "model/vnd.vtu",
                    "compressible": false
                  },
                  "model/vrml": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "wrl",
                      "vrml"
                    ],
                    "type": "model/vrml"
                  },
                  "model/x3d+binary": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "x3db",
                      "x3dbz"
                    ],
                    "type": "model/x3d+binary"
                  },
                  "model/x3d+fastinfoset": {
                    "source": "iana",
                    "extensions": [
                      "x3db"
                    ],
                    "type": "model/x3d+fastinfoset",
                    "compressible": false
                  },
                  "model/x3d+vrml": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "x3dv",
                      "x3dvz"
                    ],
                    "type": "model/x3d+vrml"
                  },
                  "model/x3d+xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "x3d",
                      "x3dz"
                    ],
                    "type": "model/x3d+xml"
                  },
                  "model/x3d-vrml": {
                    "source": "iana",
                    "extensions": [
                      "x3dv"
                    ],
                    "type": "model/x3d-vrml",
                    "compressible": false
                  },
                  "multipart/alternative": {
                    "source": "iana",
                    "compressible": false,
                    "type": "multipart/alternative",
                    "extensions": []
                  },
                  "multipart/appledouble": {
                    "source": "iana",
                    "type": "multipart/appledouble",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/byteranges": {
                    "source": "iana",
                    "type": "multipart/byteranges",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/digest": {
                    "source": "iana",
                    "type": "multipart/digest",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/encrypted": {
                    "source": "iana",
                    "compressible": false,
                    "type": "multipart/encrypted",
                    "extensions": []
                  },
                  "multipart/form-data": {
                    "source": "iana",
                    "compressible": false,
                    "type": "multipart/form-data",
                    "extensions": []
                  },
                  "multipart/header-set": {
                    "source": "iana",
                    "type": "multipart/header-set",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/mixed": {
                    "source": "iana",
                    "type": "multipart/mixed",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/multilingual": {
                    "source": "iana",
                    "type": "multipart/multilingual",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/parallel": {
                    "source": "iana",
                    "type": "multipart/parallel",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/related": {
                    "source": "iana",
                    "compressible": false,
                    "type": "multipart/related",
                    "extensions": []
                  },
                  "multipart/report": {
                    "source": "iana",
                    "type": "multipart/report",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/signed": {
                    "source": "iana",
                    "compressible": false,
                    "type": "multipart/signed",
                    "extensions": []
                  },
                  "multipart/vnd.bint.med-plus": {
                    "source": "iana",
                    "type": "multipart/vnd.bint.med-plus",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/voice-message": {
                    "source": "iana",
                    "type": "multipart/voice-message",
                    "extensions": [],
                    "compressible": false
                  },
                  "multipart/x-mixed-replace": {
                    "source": "iana",
                    "type": "multipart/x-mixed-replace",
                    "extensions": [],
                    "compressible": false
                  },
                  "text/1d-interleaved-parityfec": {
                    "source": "iana",
                    "type": "text/1d-interleaved-parityfec",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/cache-manifest": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "appcache",
                      "manifest"
                    ],
                    "type": "text/cache-manifest"
                  },
                  "text/calendar": {
                    "source": "iana",
                    "extensions": [
                      "ics",
                      "ifb"
                    ],
                    "type": "text/calendar",
                    "compressible": true
                  },
                  "text/calender": {
                    "compressible": true,
                    "type": "text/calender",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "text/cmd": {
                    "compressible": true,
                    "type": "text/cmd",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "text/coffeescript": {
                    "extensions": [
                      "coffee",
                      "litcoffee"
                    ],
                    "type": "text/coffeescript",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/css": {
                    "source": "iana",
                    "charset": "UTF-8",
                    "compressible": true,
                    "extensions": [
                      "css"
                    ],
                    "type": "text/css"
                  },
                  "text/csv": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "csv"
                    ],
                    "type": "text/csv"
                  },
                  "text/csv-schema": {
                    "source": "iana",
                    "type": "text/csv-schema",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/directory": {
                    "source": "iana",
                    "type": "text/directory",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/dns": {
                    "source": "iana",
                    "type": "text/dns",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/ecmascript": {
                    "source": "iana",
                    "type": "text/ecmascript",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/encaprtp": {
                    "source": "iana",
                    "type": "text/encaprtp",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/enriched": {
                    "source": "iana",
                    "type": "text/enriched",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/flexfec": {
                    "source": "iana",
                    "type": "text/flexfec",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/fwdred": {
                    "source": "iana",
                    "type": "text/fwdred",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/grammar-ref-list": {
                    "source": "iana",
                    "type": "text/grammar-ref-list",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/html": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "html",
                      "htm",
                      "shtml"
                    ],
                    "type": "text/html"
                  },
                  "text/jade": {
                    "extensions": [
                      "jade"
                    ],
                    "type": "text/jade",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/javascript": {
                    "source": "iana",
                    "compressible": true,
                    "type": "text/javascript",
                    "extensions": []
                  },
                  "text/jcr-cnd": {
                    "source": "iana",
                    "type": "text/jcr-cnd",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/jsx": {
                    "compressible": true,
                    "extensions": [
                      "jsx"
                    ],
                    "type": "text/jsx",
                    "source": "mime-db"
                  },
                  "text/less": {
                    "compressible": true,
                    "extensions": [
                      "less"
                    ],
                    "type": "text/less",
                    "source": "mime-db"
                  },
                  "text/markdown": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "markdown",
                      "md"
                    ],
                    "type": "text/markdown"
                  },
                  "text/mathml": {
                    "source": "nginx",
                    "extensions": [
                      "mml"
                    ],
                    "type": "text/mathml",
                    "compressible": true
                  },
                  "text/mdx": {
                    "compressible": true,
                    "extensions": [
                      "mdx"
                    ],
                    "type": "text/mdx",
                    "source": "mime-db"
                  },
                  "text/mizar": {
                    "source": "iana",
                    "type": "text/mizar",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/n3": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "n3"
                    ],
                    "type": "text/n3"
                  },
                  "text/parameters": {
                    "source": "iana",
                    "type": "text/parameters",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/parityfec": {
                    "source": "iana",
                    "type": "text/parityfec",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/plain": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "txt",
                      "text",
                      "conf",
                      "def",
                      "list",
                      "log",
                      "in",
                      "ini"
                    ],
                    "type": "text/plain"
                  },
                  "text/provenance-notation": {
                    "source": "iana",
                    "type": "text/provenance-notation",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/prs.fallenstein.rst": {
                    "source": "iana",
                    "type": "text/prs.fallenstein.rst",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/prs.lines.tag": {
                    "source": "iana",
                    "extensions": [
                      "dsc"
                    ],
                    "type": "text/prs.lines.tag",
                    "compressible": true
                  },
                  "text/prs.prop.logic": {
                    "source": "iana",
                    "type": "text/prs.prop.logic",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/raptorfec": {
                    "source": "iana",
                    "type": "text/raptorfec",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/red": {
                    "source": "iana",
                    "type": "text/red",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/rfc822-headers": {
                    "source": "iana",
                    "type": "text/rfc822-headers",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/richtext": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rtx"
                    ],
                    "type": "text/richtext"
                  },
                  "text/rtf": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "rtf"
                    ],
                    "type": "text/rtf"
                  },
                  "text/rtp-enc-aescm128": {
                    "source": "iana",
                    "type": "text/rtp-enc-aescm128",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/rtploopback": {
                    "source": "iana",
                    "type": "text/rtploopback",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/rtx": {
                    "source": "iana",
                    "type": "text/rtx",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/sgml": {
                    "source": "iana",
                    "extensions": [
                      "sgml",
                      "sgm"
                    ],
                    "type": "text/sgml",
                    "compressible": true
                  },
                  "text/shex": {
                    "extensions": [
                      "shex"
                    ],
                    "type": "text/shex",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/slim": {
                    "extensions": [
                      "slim",
                      "slm"
                    ],
                    "type": "text/slim",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/strings": {
                    "source": "iana",
                    "type": "text/strings",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/stylus": {
                    "extensions": [
                      "stylus",
                      "styl"
                    ],
                    "type": "text/stylus",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/t140": {
                    "source": "iana",
                    "type": "text/t140",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/tab-separated-values": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "tsv"
                    ],
                    "type": "text/tab-separated-values"
                  },
                  "text/troff": {
                    "source": "iana",
                    "extensions": [
                      "t",
                      "tr",
                      "roff",
                      "man",
                      "me",
                      "ms"
                    ],
                    "type": "text/troff",
                    "compressible": true
                  },
                  "text/turtle": {
                    "source": "iana",
                    "charset": "UTF-8",
                    "extensions": [
                      "ttl"
                    ],
                    "type": "text/turtle",
                    "compressible": true
                  },
                  "text/ulpfec": {
                    "source": "iana",
                    "type": "text/ulpfec",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/uri-list": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "uri",
                      "uris",
                      "urls"
                    ],
                    "type": "text/uri-list"
                  },
                  "text/vcard": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "vcard"
                    ],
                    "type": "text/vcard"
                  },
                  "text/vnd.a": {
                    "source": "iana",
                    "type": "text/vnd.a",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.abc": {
                    "source": "iana",
                    "type": "text/vnd.abc",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.ascii-art": {
                    "source": "iana",
                    "type": "text/vnd.ascii-art",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.curl": {
                    "source": "iana",
                    "extensions": [
                      "curl"
                    ],
                    "type": "text/vnd.curl",
                    "compressible": true
                  },
                  "text/vnd.curl.dcurl": {
                    "source": "apache",
                    "extensions": [
                      "dcurl"
                    ],
                    "type": "text/vnd.curl.dcurl",
                    "compressible": true
                  },
                  "text/vnd.curl.mcurl": {
                    "source": "apache",
                    "extensions": [
                      "mcurl"
                    ],
                    "type": "text/vnd.curl.mcurl",
                    "compressible": true
                  },
                  "text/vnd.curl.scurl": {
                    "source": "apache",
                    "extensions": [
                      "scurl"
                    ],
                    "type": "text/vnd.curl.scurl",
                    "compressible": true
                  },
                  "text/vnd.debian.copyright": {
                    "source": "iana",
                    "type": "text/vnd.debian.copyright",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.dmclientscript": {
                    "source": "iana",
                    "type": "text/vnd.dmclientscript",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.dvb.subtitle": {
                    "source": "iana",
                    "extensions": [
                      "sub"
                    ],
                    "type": "text/vnd.dvb.subtitle",
                    "compressible": true
                  },
                  "text/vnd.esmertec.theme-descriptor": {
                    "source": "iana",
                    "type": "text/vnd.esmertec.theme-descriptor",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.ficlab.flt": {
                    "source": "iana",
                    "type": "text/vnd.ficlab.flt",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.fly": {
                    "source": "iana",
                    "extensions": [
                      "fly"
                    ],
                    "type": "text/vnd.fly",
                    "compressible": true
                  },
                  "text/vnd.fmi.flexstor": {
                    "source": "iana",
                    "extensions": [
                      "flx"
                    ],
                    "type": "text/vnd.fmi.flexstor",
                    "compressible": true
                  },
                  "text/vnd.gml": {
                    "source": "iana",
                    "type": "text/vnd.gml",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.graphviz": {
                    "source": "iana",
                    "extensions": [
                      "gv"
                    ],
                    "type": "text/vnd.graphviz",
                    "compressible": true
                  },
                  "text/vnd.hgl": {
                    "source": "iana",
                    "type": "text/vnd.hgl",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.in3d.3dml": {
                    "source": "iana",
                    "extensions": [
                      "3dml"
                    ],
                    "type": "text/vnd.in3d.3dml",
                    "compressible": true
                  },
                  "text/vnd.in3d.spot": {
                    "source": "iana",
                    "extensions": [
                      "spot"
                    ],
                    "type": "text/vnd.in3d.spot",
                    "compressible": true
                  },
                  "text/vnd.iptc.newsml": {
                    "source": "iana",
                    "type": "text/vnd.iptc.newsml",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.iptc.nitf": {
                    "source": "iana",
                    "type": "text/vnd.iptc.nitf",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.latex-z": {
                    "source": "iana",
                    "type": "text/vnd.latex-z",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.motorola.reflex": {
                    "source": "iana",
                    "type": "text/vnd.motorola.reflex",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.ms-mediapackage": {
                    "source": "iana",
                    "type": "text/vnd.ms-mediapackage",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.net2phone.commcenter.command": {
                    "source": "iana",
                    "type": "text/vnd.net2phone.commcenter.command",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.radisys.msml-basic-layout": {
                    "source": "iana",
                    "type": "text/vnd.radisys.msml-basic-layout",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.senx.warpscript": {
                    "source": "iana",
                    "type": "text/vnd.senx.warpscript",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.si.uricatalogue": {
                    "source": "iana",
                    "type": "text/vnd.si.uricatalogue",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.sosi": {
                    "source": "iana",
                    "type": "text/vnd.sosi",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.sun.j2me.app-descriptor": {
                    "source": "iana",
                    "extensions": [
                      "jad"
                    ],
                    "type": "text/vnd.sun.j2me.app-descriptor",
                    "compressible": true
                  },
                  "text/vnd.trolltech.linguist": {
                    "source": "iana",
                    "type": "text/vnd.trolltech.linguist",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.wap.si": {
                    "source": "iana",
                    "type": "text/vnd.wap.si",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.wap.sl": {
                    "source": "iana",
                    "type": "text/vnd.wap.sl",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/vnd.wap.wml": {
                    "source": "iana",
                    "extensions": [
                      "wml"
                    ],
                    "type": "text/vnd.wap.wml",
                    "compressible": true
                  },
                  "text/vnd.wap.wmlscript": {
                    "source": "iana",
                    "extensions": [
                      "wmls"
                    ],
                    "type": "text/vnd.wap.wmlscript",
                    "compressible": true
                  },
                  "text/vtt": {
                    "charset": "UTF-8",
                    "compressible": true,
                    "extensions": [
                      "vtt"
                    ],
                    "type": "text/vtt",
                    "source": "mime-db"
                  },
                  "text/x-asm": {
                    "source": "apache",
                    "extensions": [
                      "s",
                      "asm"
                    ],
                    "type": "text/x-asm",
                    "compressible": true
                  },
                  "text/x-c": {
                    "source": "apache",
                    "extensions": [
                      "c",
                      "cc",
                      "cxx",
                      "cpp",
                      "h",
                      "hh",
                      "dic"
                    ],
                    "type": "text/x-c",
                    "compressible": true
                  },
                  "text/x-component": {
                    "source": "nginx",
                    "extensions": [
                      "htc"
                    ],
                    "type": "text/x-component",
                    "compressible": true
                  },
                  "text/x-fortran": {
                    "source": "apache",
                    "extensions": [
                      "f",
                      "for",
                      "f77",
                      "f90"
                    ],
                    "type": "text/x-fortran",
                    "compressible": true
                  },
                  "text/x-gwt-rpc": {
                    "compressible": true,
                    "type": "text/x-gwt-rpc",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "text/x-handlebars-template": {
                    "extensions": [
                      "hbs"
                    ],
                    "type": "text/x-handlebars-template",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/x-java-source": {
                    "source": "apache",
                    "extensions": [
                      "java"
                    ],
                    "type": "text/x-java-source",
                    "compressible": true
                  },
                  "text/x-jquery-tmpl": {
                    "compressible": true,
                    "type": "text/x-jquery-tmpl",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "text/x-lua": {
                    "extensions": [
                      "lua"
                    ],
                    "type": "text/x-lua",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/x-markdown": {
                    "compressible": true,
                    "extensions": [
                      "mkd"
                    ],
                    "type": "text/x-markdown",
                    "source": "mime-db"
                  },
                  "text/x-nfo": {
                    "source": "apache",
                    "extensions": [
                      "nfo"
                    ],
                    "type": "text/x-nfo",
                    "compressible": true
                  },
                  "text/x-opml": {
                    "source": "apache",
                    "extensions": [
                      "opml"
                    ],
                    "type": "text/x-opml",
                    "compressible": true
                  },
                  "text/x-org": {
                    "compressible": true,
                    "extensions": [
                      "org"
                    ],
                    "type": "text/x-org",
                    "source": "mime-db"
                  },
                  "text/x-pascal": {
                    "source": "apache",
                    "extensions": [
                      "p",
                      "pas"
                    ],
                    "type": "text/x-pascal",
                    "compressible": true
                  },
                  "text/x-processing": {
                    "compressible": true,
                    "extensions": [
                      "pde"
                    ],
                    "type": "text/x-processing",
                    "source": "mime-db"
                  },
                  "text/x-sass": {
                    "extensions": [
                      "sass"
                    ],
                    "type": "text/x-sass",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/x-scss": {
                    "extensions": [
                      "scss"
                    ],
                    "type": "text/x-scss",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "text/x-setext": {
                    "source": "apache",
                    "extensions": [
                      "etx"
                    ],
                    "type": "text/x-setext",
                    "compressible": true
                  },
                  "text/x-sfv": {
                    "source": "apache",
                    "extensions": [
                      "sfv"
                    ],
                    "type": "text/x-sfv",
                    "compressible": true
                  },
                  "text/x-suse-ymp": {
                    "compressible": true,
                    "extensions": [
                      "ymp"
                    ],
                    "type": "text/x-suse-ymp",
                    "source": "mime-db"
                  },
                  "text/x-uuencode": {
                    "source": "apache",
                    "extensions": [
                      "uu"
                    ],
                    "type": "text/x-uuencode",
                    "compressible": true
                  },
                  "text/x-vcalendar": {
                    "source": "apache",
                    "extensions": [
                      "vcs"
                    ],
                    "type": "text/x-vcalendar",
                    "compressible": true
                  },
                  "text/x-vcard": {
                    "source": "apache",
                    "extensions": [
                      "vcf"
                    ],
                    "type": "text/x-vcard",
                    "compressible": true
                  },
                  "text/xml": {
                    "source": "iana",
                    "compressible": true,
                    "extensions": [
                      "xml"
                    ],
                    "type": "text/xml"
                  },
                  "text/xml-external-parsed-entity": {
                    "source": "iana",
                    "type": "text/xml-external-parsed-entity",
                    "extensions": [],
                    "compressible": true
                  },
                  "text/yaml": {
                    "extensions": [
                      "yaml",
                      "yml"
                    ],
                    "type": "text/yaml",
                    "source": "mime-db",
                    "compressible": true
                  },
                  "video/1d-interleaved-parityfec": {
                    "source": "iana",
                    "type": "video/1d-interleaved-parityfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/3gpp": {
                    "source": "iana",
                    "extensions": [
                      "3gp",
                      "3gpp"
                    ],
                    "type": "video/3gpp",
                    "compressible": false
                  },
                  "video/3gpp-tt": {
                    "source": "iana",
                    "type": "video/3gpp-tt",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/3gpp2": {
                    "source": "iana",
                    "extensions": [
                      "3g2"
                    ],
                    "type": "video/3gpp2",
                    "compressible": false
                  },
                  "video/bmpeg": {
                    "source": "iana",
                    "type": "video/bmpeg",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/bt656": {
                    "source": "iana",
                    "type": "video/bt656",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/celb": {
                    "source": "iana",
                    "type": "video/celb",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/dv": {
                    "source": "iana",
                    "type": "video/dv",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/encaprtp": {
                    "source": "iana",
                    "type": "video/encaprtp",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/flexfec": {
                    "source": "iana",
                    "type": "video/flexfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/h261": {
                    "source": "iana",
                    "extensions": [
                      "h261"
                    ],
                    "type": "video/h261",
                    "compressible": false
                  },
                  "video/h263": {
                    "source": "iana",
                    "extensions": [
                      "h263"
                    ],
                    "type": "video/h263",
                    "compressible": false
                  },
                  "video/h263-1998": {
                    "source": "iana",
                    "type": "video/h263-1998",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/h263-2000": {
                    "source": "iana",
                    "type": "video/h263-2000",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/h264": {
                    "source": "iana",
                    "extensions": [
                      "h264"
                    ],
                    "type": "video/h264",
                    "compressible": false
                  },
                  "video/h264-rcdo": {
                    "source": "iana",
                    "type": "video/h264-rcdo",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/h264-svc": {
                    "source": "iana",
                    "type": "video/h264-svc",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/h265": {
                    "source": "iana",
                    "type": "video/h265",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/iso.segment": {
                    "source": "iana",
                    "type": "video/iso.segment",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/jpeg": {
                    "source": "iana",
                    "extensions": [
                      "jpgv"
                    ],
                    "type": "video/jpeg",
                    "compressible": false
                  },
                  "video/jpeg2000": {
                    "source": "iana",
                    "type": "video/jpeg2000",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/jpm": {
                    "source": "apache",
                    "extensions": [
                      "jpm",
                      "jpgm"
                    ],
                    "type": "video/jpm",
                    "compressible": false
                  },
                  "video/mj2": {
                    "source": "iana",
                    "extensions": [
                      "mj2",
                      "mjp2"
                    ],
                    "type": "video/mj2",
                    "compressible": false
                  },
                  "video/mp1s": {
                    "source": "iana",
                    "type": "video/mp1s",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/mp2p": {
                    "source": "iana",
                    "type": "video/mp2p",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/mp2t": {
                    "source": "iana",
                    "extensions": [
                      "ts"
                    ],
                    "type": "video/mp2t",
                    "compressible": false
                  },
                  "video/mp4": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "mp4",
                      "mp4v",
                      "mpg4"
                    ],
                    "type": "video/mp4"
                  },
                  "video/mp4v-es": {
                    "source": "iana",
                    "type": "video/mp4v-es",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/mpeg": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "mpeg",
                      "mpg",
                      "mpe",
                      "m1v",
                      "m2v"
                    ],
                    "type": "video/mpeg"
                  },
                  "video/mpeg4-generic": {
                    "source": "iana",
                    "type": "video/mpeg4-generic",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/mpv": {
                    "source": "iana",
                    "type": "video/mpv",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/nv": {
                    "source": "iana",
                    "type": "video/nv",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/ogg": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "ogv"
                    ],
                    "type": "video/ogg"
                  },
                  "video/parityfec": {
                    "source": "iana",
                    "type": "video/parityfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/pointer": {
                    "source": "iana",
                    "type": "video/pointer",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/quicktime": {
                    "source": "iana",
                    "compressible": false,
                    "extensions": [
                      "qt",
                      "mov"
                    ],
                    "type": "video/quicktime"
                  },
                  "video/raptorfec": {
                    "source": "iana",
                    "type": "video/raptorfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/raw": {
                    "source": "iana",
                    "type": "video/raw",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/rtp-enc-aescm128": {
                    "source": "iana",
                    "type": "video/rtp-enc-aescm128",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/rtploopback": {
                    "source": "iana",
                    "type": "video/rtploopback",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/rtx": {
                    "source": "iana",
                    "type": "video/rtx",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/smpte291": {
                    "source": "iana",
                    "type": "video/smpte291",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/smpte292m": {
                    "source": "iana",
                    "type": "video/smpte292m",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/ulpfec": {
                    "source": "iana",
                    "type": "video/ulpfec",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vc1": {
                    "source": "iana",
                    "type": "video/vc1",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vc2": {
                    "source": "iana",
                    "type": "video/vc2",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.cctv": {
                    "source": "iana",
                    "type": "video/vnd.cctv",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.dece.hd": {
                    "source": "iana",
                    "extensions": [
                      "uvh",
                      "uvvh"
                    ],
                    "type": "video/vnd.dece.hd",
                    "compressible": false
                  },
                  "video/vnd.dece.mobile": {
                    "source": "iana",
                    "extensions": [
                      "uvm",
                      "uvvm"
                    ],
                    "type": "video/vnd.dece.mobile",
                    "compressible": false
                  },
                  "video/vnd.dece.mp4": {
                    "source": "iana",
                    "type": "video/vnd.dece.mp4",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.dece.pd": {
                    "source": "iana",
                    "extensions": [
                      "uvp",
                      "uvvp"
                    ],
                    "type": "video/vnd.dece.pd",
                    "compressible": false
                  },
                  "video/vnd.dece.sd": {
                    "source": "iana",
                    "extensions": [
                      "uvs",
                      "uvvs"
                    ],
                    "type": "video/vnd.dece.sd",
                    "compressible": false
                  },
                  "video/vnd.dece.video": {
                    "source": "iana",
                    "extensions": [
                      "uvv",
                      "uvvv"
                    ],
                    "type": "video/vnd.dece.video",
                    "compressible": false
                  },
                  "video/vnd.directv.mpeg": {
                    "source": "iana",
                    "type": "video/vnd.directv.mpeg",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.directv.mpeg-tts": {
                    "source": "iana",
                    "type": "video/vnd.directv.mpeg-tts",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.dlna.mpeg-tts": {
                    "source": "iana",
                    "type": "video/vnd.dlna.mpeg-tts",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.dvb.file": {
                    "source": "iana",
                    "extensions": [
                      "dvb"
                    ],
                    "type": "video/vnd.dvb.file",
                    "compressible": false
                  },
                  "video/vnd.fvt": {
                    "source": "iana",
                    "extensions": [
                      "fvt"
                    ],
                    "type": "video/vnd.fvt",
                    "compressible": false
                  },
                  "video/vnd.hns.video": {
                    "source": "iana",
                    "type": "video/vnd.hns.video",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.iptvforum.1dparityfec-1010": {
                    "source": "iana",
                    "type": "video/vnd.iptvforum.1dparityfec-1010",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.iptvforum.1dparityfec-2005": {
                    "source": "iana",
                    "type": "video/vnd.iptvforum.1dparityfec-2005",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.iptvforum.2dparityfec-1010": {
                    "source": "iana",
                    "type": "video/vnd.iptvforum.2dparityfec-1010",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.iptvforum.2dparityfec-2005": {
                    "source": "iana",
                    "type": "video/vnd.iptvforum.2dparityfec-2005",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.iptvforum.ttsavc": {
                    "source": "iana",
                    "type": "video/vnd.iptvforum.ttsavc",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.iptvforum.ttsmpeg2": {
                    "source": "iana",
                    "type": "video/vnd.iptvforum.ttsmpeg2",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.motorola.video": {
                    "source": "iana",
                    "type": "video/vnd.motorola.video",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.motorola.videop": {
                    "source": "iana",
                    "type": "video/vnd.motorola.videop",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.mpegurl": {
                    "source": "iana",
                    "extensions": [
                      "mxu",
                      "m4u"
                    ],
                    "type": "video/vnd.mpegurl",
                    "compressible": false
                  },
                  "video/vnd.ms-playready.media.pyv": {
                    "source": "iana",
                    "extensions": [
                      "pyv"
                    ],
                    "type": "video/vnd.ms-playready.media.pyv",
                    "compressible": false
                  },
                  "video/vnd.nokia.interleaved-multimedia": {
                    "source": "iana",
                    "type": "video/vnd.nokia.interleaved-multimedia",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.nokia.mp4vr": {
                    "source": "iana",
                    "type": "video/vnd.nokia.mp4vr",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.nokia.videovoip": {
                    "source": "iana",
                    "type": "video/vnd.nokia.videovoip",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.objectvideo": {
                    "source": "iana",
                    "type": "video/vnd.objectvideo",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.radgamettools.bink": {
                    "source": "iana",
                    "type": "video/vnd.radgamettools.bink",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.radgamettools.smacker": {
                    "source": "iana",
                    "type": "video/vnd.radgamettools.smacker",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.sealed.mpeg1": {
                    "source": "iana",
                    "type": "video/vnd.sealed.mpeg1",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.sealed.mpeg4": {
                    "source": "iana",
                    "type": "video/vnd.sealed.mpeg4",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.sealed.swf": {
                    "source": "iana",
                    "type": "video/vnd.sealed.swf",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.sealedmedia.softseal.mov": {
                    "source": "iana",
                    "type": "video/vnd.sealedmedia.softseal.mov",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vnd.uvvu.mp4": {
                    "source": "iana",
                    "extensions": [
                      "uvu",
                      "uvvu"
                    ],
                    "type": "video/vnd.uvvu.mp4",
                    "compressible": false
                  },
                  "video/vnd.vivo": {
                    "source": "iana",
                    "extensions": [
                      "viv"
                    ],
                    "type": "video/vnd.vivo",
                    "compressible": false
                  },
                  "video/vnd.youtube.yt": {
                    "source": "iana",
                    "type": "video/vnd.youtube.yt",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/vp8": {
                    "source": "iana",
                    "type": "video/vp8",
                    "extensions": [],
                    "compressible": false
                  },
                  "video/webm": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "webm"
                    ],
                    "type": "video/webm"
                  },
                  "video/x-f4v": {
                    "source": "apache",
                    "extensions": [
                      "f4v"
                    ],
                    "type": "video/x-f4v",
                    "compressible": false
                  },
                  "video/x-fli": {
                    "source": "apache",
                    "extensions": [
                      "fli"
                    ],
                    "type": "video/x-fli",
                    "compressible": false
                  },
                  "video/x-flv": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "flv"
                    ],
                    "type": "video/x-flv"
                  },
                  "video/x-m4v": {
                    "source": "apache",
                    "extensions": [
                      "m4v"
                    ],
                    "type": "video/x-m4v",
                    "compressible": false
                  },
                  "video/x-matroska": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "mkv",
                      "mk3d",
                      "mks"
                    ],
                    "type": "video/x-matroska"
                  },
                  "video/x-mng": {
                    "source": "apache",
                    "extensions": [
                      "mng"
                    ],
                    "type": "video/x-mng",
                    "compressible": false
                  },
                  "video/x-ms-asf": {
                    "source": "apache",
                    "extensions": [
                      "asf",
                      "asx"
                    ],
                    "type": "video/x-ms-asf",
                    "compressible": false
                  },
                  "video/x-ms-vob": {
                    "source": "apache",
                    "extensions": [
                      "vob"
                    ],
                    "type": "video/x-ms-vob",
                    "compressible": false
                  },
                  "video/x-ms-wm": {
                    "source": "apache",
                    "extensions": [
                      "wm"
                    ],
                    "type": "video/x-ms-wm",
                    "compressible": false
                  },
                  "video/x-ms-wmv": {
                    "source": "apache",
                    "compressible": false,
                    "extensions": [
                      "wmv"
                    ],
                    "type": "video/x-ms-wmv"
                  },
                  "video/x-ms-wmx": {
                    "source": "apache",
                    "extensions": [
                      "wmx"
                    ],
                    "type": "video/x-ms-wmx",
                    "compressible": false
                  },
                  "video/x-ms-wvx": {
                    "source": "apache",
                    "extensions": [
                      "wvx"
                    ],
                    "type": "video/x-ms-wvx",
                    "compressible": false
                  },
                  "video/x-msvideo": {
                    "source": "apache",
                    "extensions": [
                      "avi"
                    ],
                    "type": "video/x-msvideo",
                    "compressible": false
                  },
                  "video/x-sgi-movie": {
                    "source": "apache",
                    "extensions": [
                      "movie"
                    ],
                    "type": "video/x-sgi-movie",
                    "compressible": false
                  },
                  "video/x-smv": {
                    "source": "apache",
                    "extensions": [
                      "smv"
                    ],
                    "type": "video/x-smv",
                    "compressible": false
                  },
                  "x-conference/x-cooltalk": {
                    "source": "apache",
                    "extensions": [
                      "ice"
                    ],
                    "type": "x-conference/x-cooltalk",
                    "compressible": false
                  },
                  "x-shader/x-fragment": {
                    "compressible": true,
                    "type": "x-shader/x-fragment",
                    "source": "mime-db",
                    "extensions": []
                  },
                  "x-shader/x-vertex": {
                    "compressible": true,
                    "type": "x-shader/x-vertex",
                    "source": "mime-db",
                    "extensions": []
                  }
                },
                "_byExtension": {
                  "123": "[Circular]",
                  "ez": "[Circular]",
                  "aw": "[Circular]",
                  "atom": "[Circular]",
                  "atomcat": "[Circular]",
                  "atomsvc": "[Circular]",
                  "bdoc": "[Circular]",
                  "ccxml": "[Circular]",
                  "cdmia": "[Circular]",
                  "cdmic": "[Circular]",
                  "cdmid": "[Circular]",
                  "cdmio": "[Circular]",
                  "cdmiq": "[Circular]",
                  "cu": "[Circular]",
                  "mpd": "[Circular]",
                  "davmount": "[Circular]",
                  "dbk": "[Circular]",
                  "dssc": "[Circular]",
                  "xdssc": "[Circular]",
                  "ecma": "[Circular]",
                  "es": "[Circular]",
                  "emma": "[Circular]",
                  "epub": "[Circular]",
                  "exi": "[Circular]",
                  "pfr": "[Circular]",
                  "geojson": "[Circular]",
                  "gml": "[Circular]",
                  "gpx": "[Circular]",
                  "gxf": "[Circular]",
                  "gz": "[Circular]",
                  "hjson": "[Circular]",
                  "stk": "[Circular]",
                  "ink": "[Circular]",
                  "inkml": "[Circular]",
                  "ipfix": "[Circular]",
                  "jar": "[Circular]",
                  "war": "[Circular]",
                  "ear": "[Circular]",
                  "ser": "[Circular]",
                  "class": "[Circular]",
                  "js": "[Circular]",
                  "mjs": "[Circular]",
                  "json": "[Circular]",
                  "map": "[Circular]",
                  "json5": "[Circular]",
                  "jsonml": "[Circular]",
                  "jsonld": "[Circular]",
                  "lostxml": "[Circular]",
                  "hqx": "[Circular]",
                  "cpt": "[Circular]",
                  "mads": "[Circular]",
                  "webmanifest": "[Circular]",
                  "mrc": "[Circular]",
                  "mrcx": "[Circular]",
                  "ma": "[Circular]",
                  "nb": "[Circular]",
                  "mb": "[Circular]",
                  "mathml": "[Circular]",
                  "mbox": "[Circular]",
                  "mscml": "[Circular]",
                  "metalink": "[Circular]",
                  "meta4": "[Circular]",
                  "mets": "[Circular]",
                  "mods": "[Circular]",
                  "m21": "[Circular]",
                  "mp21": "[Circular]",
                  "mp4s": "[Circular]",
                  "m4p": "[Circular]",
                  "doc": "[Circular]",
                  "dot": "[Circular]",
                  "mxf": "[Circular]",
                  "nq": "[Circular]",
                  "nt": "[Circular]",
                  "bin": "[Circular]",
                  "dms": "[Circular]",
                  "lrf": "[Circular]",
                  "mar": "[Circular]",
                  "so": "[Circular]",
                  "dist": "[Circular]",
                  "distz": "[Circular]",
                  "pkg": "[Circular]",
                  "bpk": "[Circular]",
                  "dump": "[Circular]",
                  "elc": "[Circular]",
                  "deploy": "[Circular]",
                  "exe": "[Circular]",
                  "dll": "[Circular]",
                  "deb": "[Circular]",
                  "dmg": "[Circular]",
                  "iso": "[Circular]",
                  "img": "[Circular]",
                  "msi": "[Circular]",
                  "msp": "[Circular]",
                  "msm": "[Circular]",
                  "buffer": "[Circular]",
                  "oda": "[Circular]",
                  "opf": "[Circular]",
                  "ogx": "[Circular]",
                  "omdoc": "[Circular]",
                  "onetoc": "[Circular]",
                  "onetoc2": "[Circular]",
                  "onetmp": "[Circular]",
                  "onepkg": "[Circular]",
                  "oxps": "[Circular]",
                  "xer": "[Circular]",
                  "pdf": "[Circular]",
                  "pgp": "[Circular]",
                  "asc": "[Circular]",
                  "sig": "[Circular]",
                  "prf": "[Circular]",
                  "p10": "[Circular]",
                  "p7m": "[Circular]",
                  "p7c": "[Circular]",
                  "p7s": "[Circular]",
                  "p8": "[Circular]",
                  "ac": "[Circular]",
                  "cer": "[Circular]",
                  "crl": "[Circular]",
                  "pkipath": "[Circular]",
                  "pki": "[Circular]",
                  "pls": "[Circular]",
                  "ai": "[Circular]",
                  "eps": "[Circular]",
                  "ps": "[Circular]",
                  "cww": "[Circular]",
                  "pskcxml": "[Circular]",
                  "raml": "[Circular]",
                  "rdf": "[Circular]",
                  "owl": "[Circular]",
                  "rif": "[Circular]",
                  "rnc": "[Circular]",
                  "rl": "[Circular]",
                  "rld": "[Circular]",
                  "rs": "[Circular]",
                  "gbr": "[Circular]",
                  "mft": "[Circular]",
                  "roa": "[Circular]",
                  "rsd": "[Circular]",
                  "rss": "[Circular]",
                  "rtf": "[Circular]",
                  "sbml": "[Circular]",
                  "scq": "[Circular]",
                  "scs": "[Circular]",
                  "spq": "[Circular]",
                  "spp": "[Circular]",
                  "sdp": "[Circular]",
                  "setpay": "[Circular]",
                  "setreg": "[Circular]",
                  "shf": "[Circular]",
                  "siv": "[Circular]",
                  "sieve": "[Circular]",
                  "smi": "[Circular]",
                  "smil": "[Circular]",
                  "rq": "[Circular]",
                  "srx": "[Circular]",
                  "gram": "[Circular]",
                  "grxml": "[Circular]",
                  "sru": "[Circular]",
                  "ssdl": "[Circular]",
                  "ssml": "[Circular]",
                  "tei": "[Circular]",
                  "teicorpus": "[Circular]",
                  "tfi": "[Circular]",
                  "tsd": "[Circular]",
                  "toml": "[Circular]",
                  "plb": "[Circular]",
                  "psb": "[Circular]",
                  "pvb": "[Circular]",
                  "tcap": "[Circular]",
                  "pwn": "[Circular]",
                  "aso": "[Circular]",
                  "imp": "[Circular]",
                  "acu": "[Circular]",
                  "atc": "[Circular]",
                  "acutc": "[Circular]",
                  "air": "[Circular]",
                  "fcdt": "[Circular]",
                  "fxp": "[Circular]",
                  "fxpl": "[Circular]",
                  "xdp": "[Circular]",
                  "xfdf": "[Circular]",
                  "ahead": "[Circular]",
                  "azf": "[Circular]",
                  "azs": "[Circular]",
                  "azw": "[Circular]",
                  "acc": "[Circular]",
                  "ami": "[Circular]",
                  "apk": "[Circular]",
                  "cii": "[Circular]",
                  "fti": "[Circular]",
                  "atx": "[Circular]",
                  "mpkg": "[Circular]",
                  "keynote": "[Circular]",
                  "m3u8": "[Circular]",
                  "numbers": "[Circular]",
                  "pages": "[Circular]",
                  "pkpass": "[Circular]",
                  "swi": "[Circular]",
                  "iota": "[Circular]",
                  "aep": "[Circular]",
                  "mpm": "[Circular]",
                  "bmi": "[Circular]",
                  "rep": "[Circular]",
                  "cdxml": "[Circular]",
                  "mmd": "[Circular]",
                  "cdy": "[Circular]",
                  "csl": "[Circular]",
                  "cla": "[Circular]",
                  "rp9": "[Circular]",
                  "c4g": "[Circular]",
                  "c4d": "[Circular]",
                  "c4f": "[Circular]",
                  "c4p": "[Circular]",
                  "c4u": "[Circular]",
                  "c11amc": "[Circular]",
                  "c11amz": "[Circular]",
                  "csp": "[Circular]",
                  "cdbcmsg": "[Circular]",
                  "cmc": "[Circular]",
                  "clkx": "[Circular]",
                  "clkk": "[Circular]",
                  "clkp": "[Circular]",
                  "clkt": "[Circular]",
                  "clkw": "[Circular]",
                  "wbs": "[Circular]",
                  "pml": "[Circular]",
                  "ppd": "[Circular]",
                  "car": "[Circular]",
                  "pcurl": "[Circular]",
                  "dart": "[Circular]",
                  "rdz": "[Circular]",
                  "uvf": "[Circular]",
                  "uvvf": "[Circular]",
                  "uvd": "[Circular]",
                  "uvvd": "[Circular]",
                  "uvt": "[Circular]",
                  "uvvt": "[Circular]",
                  "uvx": "[Circular]",
                  "uvvx": "[Circular]",
                  "uvz": "[Circular]",
                  "uvvz": "[Circular]",
                  "fe_launch": "[Circular]",
                  "dna": "[Circular]",
                  "mlp": "[Circular]",
                  "dpg": "[Circular]",
                  "dfac": "[Circular]",
                  "kpxx": "[Circular]",
                  "ait": "[Circular]",
                  "svc": "[Circular]",
                  "geo": "[Circular]",
                  "mag": "[Circular]",
                  "nml": "[Circular]",
                  "esf": "[Circular]",
                  "msf": "[Circular]",
                  "qam": "[Circular]",
                  "slt": "[Circular]",
                  "ssf": "[Circular]",
                  "es3": "[Circular]",
                  "et3": "[Circular]",
                  "ez2": "[Circular]",
                  "ez3": "[Circular]",
                  "fdf": "[Circular]",
                  "mseed": "[Circular]",
                  "seed": "[Circular]",
                  "dataless": "[Circular]",
                  "gph": "[Circular]",
                  "ftc": "[Circular]",
                  "fm": "[Circular]",
                  "frame": "[Circular]",
                  "maker": "[Circular]",
                  "book": "[Circular]",
                  "fnc": "[Circular]",
                  "ltf": "[Circular]",
                  "fsc": "[Circular]",
                  "oas": "[Circular]",
                  "oa2": "[Circular]",
                  "oa3": "[Circular]",
                  "fg5": "[Circular]",
                  "bh2": "[Circular]",
                  "ddd": "[Circular]",
                  "xdw": "[Circular]",
                  "xbd": "[Circular]",
                  "fzs": "[Circular]",
                  "txd": "[Circular]",
                  "ggb": "[Circular]",
                  "ggt": "[Circular]",
                  "gex": "[Circular]",
                  "gre": "[Circular]",
                  "gxt": "[Circular]",
                  "g2w": "[Circular]",
                  "g3w": "[Circular]",
                  "gmx": "[Circular]",
                  "gdoc": "[Circular]",
                  "gslides": "[Circular]",
                  "gsheet": "[Circular]",
                  "kml": "[Circular]",
                  "kmz": "[Circular]",
                  "gqf": "[Circular]",
                  "gqs": "[Circular]",
                  "gac": "[Circular]",
                  "ghf": "[Circular]",
                  "gim": "[Circular]",
                  "grv": "[Circular]",
                  "gtm": "[Circular]",
                  "tpl": "[Circular]",
                  "vcg": "[Circular]",
                  "hal": "[Circular]",
                  "zmm": "[Circular]",
                  "hbci": "[Circular]",
                  "les": "[Circular]",
                  "hpgl": "[Circular]",
                  "hpid": "[Circular]",
                  "hps": "[Circular]",
                  "jlt": "[Circular]",
                  "pcl": "[Circular]",
                  "pclxl": "[Circular]",
                  "sfd-hdstx": "[Circular]",
                  "mpy": "[Circular]",
                  "afp": "[Circular]",
                  "listafp": "[Circular]",
                  "list3820": "[Circular]",
                  "irm": "[Circular]",
                  "sc": "[Circular]",
                  "icc": "[Circular]",
                  "icm": "[Circular]",
                  "igl": "[Circular]",
                  "ivp": "[Circular]",
                  "ivu": "[Circular]",
                  "igm": "[Circular]",
                  "xpw": "[Circular]",
                  "xpx": "[Circular]",
                  "i2g": "[Circular]",
                  "qbo": "[Circular]",
                  "qfx": "[Circular]",
                  "rcprofile": "[Circular]",
                  "irp": "[Circular]",
                  "xpr": "[Circular]",
                  "fcs": "[Circular]",
                  "jam": "[Circular]",
                  "rms": "[Circular]",
                  "jisp": "[Circular]",
                  "joda": "[Circular]",
                  "ktz": "[Circular]",
                  "ktr": "[Circular]",
                  "karbon": "[Circular]",
                  "chrt": "[Circular]",
                  "kfo": "[Circular]",
                  "flw": "[Circular]",
                  "kon": "[Circular]",
                  "kpr": "[Circular]",
                  "kpt": "[Circular]",
                  "ksp": "[Circular]",
                  "kwd": "[Circular]",
                  "kwt": "[Circular]",
                  "htke": "[Circular]",
                  "kia": "[Circular]",
                  "kne": "[Circular]",
                  "knp": "[Circular]",
                  "skp": "[Circular]",
                  "skd": "[Circular]",
                  "skt": "[Circular]",
                  "skm": "[Circular]",
                  "sse": "[Circular]",
                  "lasxml": "[Circular]",
                  "lbd": "[Circular]",
                  "lbe": "[Circular]",
                  "apr": "[Circular]",
                  "pre": "[Circular]",
                  "nsf": "[Circular]",
                  "org": "[Circular]",
                  "scm": "[Circular]",
                  "lwp": "[Circular]",
                  "portpkg": "[Circular]",
                  "mcd": "[Circular]",
                  "mc1": "[Circular]",
                  "cdkey": "[Circular]",
                  "mwf": "[Circular]",
                  "mfm": "[Circular]",
                  "flo": "[Circular]",
                  "igx": "[Circular]",
                  "mif": "[Circular]",
                  "daf": "[Circular]",
                  "dis": "[Circular]",
                  "mbk": "[Circular]",
                  "mqy": "[Circular]",
                  "msl": "[Circular]",
                  "plc": "[Circular]",
                  "txf": "[Circular]",
                  "mpn": "[Circular]",
                  "mpc": "[Circular]",
                  "xul": "[Circular]",
                  "cil": "[Circular]",
                  "cab": "[Circular]",
                  "xls": "[Circular]",
                  "xlm": "[Circular]",
                  "xla": "[Circular]",
                  "xlc": "[Circular]",
                  "xlt": "[Circular]",
                  "xlw": "[Circular]",
                  "xlam": "[Circular]",
                  "xlsb": "[Circular]",
                  "xlsm": "[Circular]",
                  "xltm": "[Circular]",
                  "eot": "[Circular]",
                  "chm": "[Circular]",
                  "ims": "[Circular]",
                  "lrm": "[Circular]",
                  "thmx": "[Circular]",
                  "msg": "[Circular]",
                  "cat": "[Circular]",
                  "stl": "[Circular]",
                  "ppt": "[Circular]",
                  "pps": "[Circular]",
                  "pot": "[Circular]",
                  "ppam": "[Circular]",
                  "pptm": "[Circular]",
                  "sldm": "[Circular]",
                  "ppsm": "[Circular]",
                  "potm": "[Circular]",
                  "mpp": "[Circular]",
                  "mpt": "[Circular]",
                  "docm": "[Circular]",
                  "dotm": "[Circular]",
                  "wps": "[Circular]",
                  "wks": "[Circular]",
                  "wcm": "[Circular]",
                  "wdb": "[Circular]",
                  "wpl": "[Circular]",
                  "xps": "[Circular]",
                  "mseq": "[Circular]",
                  "mus": "[Circular]",
                  "msty": "[Circular]",
                  "taglet": "[Circular]",
                  "nlu": "[Circular]",
                  "ntf": "[Circular]",
                  "nitf": "[Circular]",
                  "nnd": "[Circular]",
                  "nns": "[Circular]",
                  "nnw": "[Circular]",
                  "ngdat": "[Circular]",
                  "n-gage": "[Circular]",
                  "rpst": "[Circular]",
                  "rpss": "[Circular]",
                  "edm": "[Circular]",
                  "edx": "[Circular]",
                  "ext": "[Circular]",
                  "odc": "[Circular]",
                  "otc": "[Circular]",
                  "odb": "[Circular]",
                  "odf": "[Circular]",
                  "odft": "[Circular]",
                  "odg": "[Circular]",
                  "otg": "[Circular]",
                  "odi": "[Circular]",
                  "oti": "[Circular]",
                  "odp": "[Circular]",
                  "otp": "[Circular]",
                  "ods": "[Circular]",
                  "ots": "[Circular]",
                  "odt": "[Circular]",
                  "odm": "[Circular]",
                  "ott": "[Circular]",
                  "oth": "[Circular]",
                  "xo": "[Circular]",
                  "dd2": "[Circular]",
                  "oxt": "[Circular]",
                  "pptx": "[Circular]",
                  "sldx": "[Circular]",
                  "ppsx": "[Circular]",
                  "potx": "[Circular]",
                  "xlsx": "[Circular]",
                  "xltx": "[Circular]",
                  "docx": "[Circular]",
                  "dotx": "[Circular]",
                  "mgp": "[Circular]",
                  "dp": "[Circular]",
                  "esa": "[Circular]",
                  "pdb": "[Circular]",
                  "pqa": "[Circular]",
                  "oprc": "[Circular]",
                  "paw": "[Circular]",
                  "str": "[Circular]",
                  "ei6": "[Circular]",
                  "efif": "[Circular]",
                  "wg": "[Circular]",
                  "plf": "[Circular]",
                  "pbd": "[Circular]",
                  "box": "[Circular]",
                  "mgz": "[Circular]",
                  "qps": "[Circular]",
                  "ptid": "[Circular]",
                  "qxd": "[Circular]",
                  "qxt": "[Circular]",
                  "qwd": "[Circular]",
                  "qwt": "[Circular]",
                  "qxl": "[Circular]",
                  "qxb": "[Circular]",
                  "bed": "[Circular]",
                  "mxl": "[Circular]",
                  "musicxml": "[Circular]",
                  "cryptonote": "[Circular]",
                  "cod": "[Circular]",
                  "rm": "[Circular]",
                  "rmvb": "[Circular]",
                  "link66": "[Circular]",
                  "st": "[Circular]",
                  "see": "[Circular]",
                  "sema": "[Circular]",
                  "semd": "[Circular]",
                  "semf": "[Circular]",
                  "ifm": "[Circular]",
                  "itp": "[Circular]",
                  "iif": "[Circular]",
                  "ipk": "[Circular]",
                  "twd": "[Circular]",
                  "twds": "[Circular]",
                  "mmf": "[Circular]",
                  "teacher": "[Circular]",
                  "sdkm": "[Circular]",
                  "sdkd": "[Circular]",
                  "dxp": "[Circular]",
                  "sfs": "[Circular]",
                  "sdc": "[Circular]",
                  "sda": "[Circular]",
                  "sdd": "[Circular]",
                  "smf": "[Circular]",
                  "sdw": "[Circular]",
                  "vor": "[Circular]",
                  "sgl": "[Circular]",
                  "smzip": "[Circular]",
                  "sm": "[Circular]",
                  "wadl": "[Circular]",
                  "sxc": "[Circular]",
                  "stc": "[Circular]",
                  "sxd": "[Circular]",
                  "std": "[Circular]",
                  "sxi": "[Circular]",
                  "sti": "[Circular]",
                  "sxm": "[Circular]",
                  "sxw": "[Circular]",
                  "sxg": "[Circular]",
                  "stw": "[Circular]",
                  "sus": "[Circular]",
                  "susp": "[Circular]",
                  "svd": "[Circular]",
                  "sis": "[Circular]",
                  "sisx": "[Circular]",
                  "xsm": "[Circular]",
                  "bdm": "[Circular]",
                  "xdm": "[Circular]",
                  "tao": "[Circular]",
                  "pcap": "[Circular]",
                  "cap": "[Circular]",
                  "dmp": "[Circular]",
                  "tmo": "[Circular]",
                  "tpt": "[Circular]",
                  "mxs": "[Circular]",
                  "tra": "[Circular]",
                  "ufd": "[Circular]",
                  "ufdl": "[Circular]",
                  "utz": "[Circular]",
                  "umj": "[Circular]",
                  "unityweb": "[Circular]",
                  "uoml": "[Circular]",
                  "vcx": "[Circular]",
                  "vsd": "[Circular]",
                  "vst": "[Circular]",
                  "vss": "[Circular]",
                  "vsw": "[Circular]",
                  "vis": "[Circular]",
                  "vsf": "[Circular]",
                  "wbxml": "[Circular]",
                  "wmlc": "[Circular]",
                  "wmlsc": "[Circular]",
                  "wtb": "[Circular]",
                  "nbp": "[Circular]",
                  "wpd": "[Circular]",
                  "wqd": "[Circular]",
                  "stf": "[Circular]",
                  "xar": "[Circular]",
                  "xfdl": "[Circular]",
                  "hvd": "[Circular]",
                  "hvs": "[Circular]",
                  "hvp": "[Circular]",
                  "osf": "[Circular]",
                  "osfpvg": "[Circular]",
                  "saf": "[Circular]",
                  "spf": "[Circular]",
                  "cmp": "[Circular]",
                  "zir": "[Circular]",
                  "zirz": "[Circular]",
                  "zaz": "[Circular]",
                  "vxml": "[Circular]",
                  "wasm": "[Circular]",
                  "wgt": "[Circular]",
                  "hlp": "[Circular]",
                  "wsdl": "[Circular]",
                  "wspolicy": "[Circular]",
                  "7z": "[Circular]",
                  "abw": "[Circular]",
                  "ace": "[Circular]",
                  "arj": "[Circular]",
                  "aab": "[Circular]",
                  "x32": "[Circular]",
                  "u32": "[Circular]",
                  "vox": "[Circular]",
                  "aam": "[Circular]",
                  "aas": "[Circular]",
                  "bcpio": "[Circular]",
                  "torrent": "[Circular]",
                  "blb": "[Circular]",
                  "blorb": "[Circular]",
                  "bz": "[Circular]",
                  "bz2": "[Circular]",
                  "boz": "[Circular]",
                  "cbr": "[Circular]",
                  "cba": "[Circular]",
                  "cbt": "[Circular]",
                  "cbz": "[Circular]",
                  "cb7": "[Circular]",
                  "vcd": "[Circular]",
                  "cfs": "[Circular]",
                  "chat": "[Circular]",
                  "pgn": "[Circular]",
                  "crx": "[Circular]",
                  "cco": "[Circular]",
                  "nsc": "[Circular]",
                  "cpio": "[Circular]",
                  "csh": "[Circular]",
                  "udeb": "[Circular]",
                  "dgc": "[Circular]",
                  "dir": "[Circular]",
                  "dcr": "[Circular]",
                  "dxr": "[Circular]",
                  "cst": "[Circular]",
                  "cct": "[Circular]",
                  "cxt": "[Circular]",
                  "w3d": "[Circular]",
                  "fgd": "[Circular]",
                  "swa": "[Circular]",
                  "wad": "[Circular]",
                  "ncx": "[Circular]",
                  "dtb": "[Circular]",
                  "res": "[Circular]",
                  "dvi": "[Circular]",
                  "evy": "[Circular]",
                  "eva": "[Circular]",
                  "bdf": "[Circular]",
                  "gsf": "[Circular]",
                  "psf": "[Circular]",
                  "pcf": "[Circular]",
                  "snf": "[Circular]",
                  "pfa": "[Circular]",
                  "pfb": "[Circular]",
                  "pfm": "[Circular]",
                  "afm": "[Circular]",
                  "arc": "[Circular]",
                  "spl": "[Circular]",
                  "gca": "[Circular]",
                  "ulx": "[Circular]",
                  "gnumeric": "[Circular]",
                  "gramps": "[Circular]",
                  "gtar": "[Circular]",
                  "hdf": "[Circular]",
                  "php": "[Circular]",
                  "install": "[Circular]",
                  "jardiff": "[Circular]",
                  "jnlp": "[Circular]",
                  "latex": "[Circular]",
                  "luac": "[Circular]",
                  "lzh": "[Circular]",
                  "lha": "[Circular]",
                  "run": "[Circular]",
                  "mie": "[Circular]",
                  "prc": "[Circular]",
                  "mobi": "[Circular]",
                  "application": "[Circular]",
                  "lnk": "[Circular]",
                  "wmd": "[Circular]",
                  "wmz": "[Circular]",
                  "xbap": "[Circular]",
                  "mdb": "[Circular]",
                  "obd": "[Circular]",
                  "crd": "[Circular]",
                  "clp": "[Circular]",
                  "com": "[Circular]",
                  "bat": "[Circular]",
                  "mvb": "[Circular]",
                  "m13": "[Circular]",
                  "m14": "[Circular]",
                  "wmf": "[Circular]",
                  "emf": "[Circular]",
                  "emz": "[Circular]",
                  "mny": "[Circular]",
                  "pub": "[Circular]",
                  "scd": "[Circular]",
                  "trm": "[Circular]",
                  "wri": "[Circular]",
                  "nc": "[Circular]",
                  "cdf": "[Circular]",
                  "pac": "[Circular]",
                  "nzb": "[Circular]",
                  "pl": "[Circular]",
                  "pm": "[Circular]",
                  "p12": "[Circular]",
                  "pfx": "[Circular]",
                  "p7b": "[Circular]",
                  "spc": "[Circular]",
                  "p7r": "[Circular]",
                  "rar": "[Circular]",
                  "rpm": "[Circular]",
                  "ris": "[Circular]",
                  "sea": "[Circular]",
                  "sh": "[Circular]",
                  "shar": "[Circular]",
                  "swf": "[Circular]",
                  "xap": "[Circular]",
                  "sql": "[Circular]",
                  "sit": "[Circular]",
                  "sitx": "[Circular]",
                  "srt": "[Circular]",
                  "sv4cpio": "[Circular]",
                  "sv4crc": "[Circular]",
                  "t3": "[Circular]",
                  "gam": "[Circular]",
                  "tar": "[Circular]",
                  "tcl": "[Circular]",
                  "tk": "[Circular]",
                  "tex": "[Circular]",
                  "tfm": "[Circular]",
                  "texinfo": "[Circular]",
                  "texi": "[Circular]",
                  "obj": "[Circular]",
                  "ustar": "[Circular]",
                  "hdd": "[Circular]",
                  "ova": "[Circular]",
                  "ovf": "[Circular]",
                  "vbox": "[Circular]",
                  "vbox-extpack": "[Circular]",
                  "vdi": "[Circular]",
                  "vhd": "[Circular]",
                  "vmdk": "[Circular]",
                  "src": "[Circular]",
                  "webapp": "[Circular]",
                  "der": "[Circular]",
                  "crt": "[Circular]",
                  "pem": "[Circular]",
                  "fig": "[Circular]",
                  "xlf": "[Circular]",
                  "xpi": "[Circular]",
                  "xz": "[Circular]",
                  "z1": "[Circular]",
                  "z2": "[Circular]",
                  "z3": "[Circular]",
                  "z4": "[Circular]",
                  "z5": "[Circular]",
                  "z6": "[Circular]",
                  "z7": "[Circular]",
                  "z8": "[Circular]",
                  "xaml": "[Circular]",
                  "xdf": "[Circular]",
                  "xenc": "[Circular]",
                  "xhtml": "[Circular]",
                  "xht": "[Circular]",
                  "xml": "[Circular]",
                  "xsl": "[Circular]",
                  "xsd": "[Circular]",
                  "rng": "[Circular]",
                  "dtd": "[Circular]",
                  "xop": "[Circular]",
                  "xpl": "[Circular]",
                  "xslt": "[Circular]",
                  "xspf": "[Circular]",
                  "mxml": "[Circular]",
                  "xhvml": "[Circular]",
                  "xvml": "[Circular]",
                  "xvm": "[Circular]",
                  "yang": "[Circular]",
                  "yin": "[Circular]",
                  "zip": "[Circular]",
                  "3gpp": "[Circular]",
                  "adp": "[Circular]",
                  "au": "[Circular]",
                  "snd": "[Circular]",
                  "mid": "[Circular]",
                  "midi": "[Circular]",
                  "kar": "[Circular]",
                  "rmi": "[Circular]",
                  "mp3": "[Circular]",
                  "m4a": "[Circular]",
                  "mp4a": "[Circular]",
                  "mpga": "[Circular]",
                  "mp2": "[Circular]",
                  "mp2a": "[Circular]",
                  "m2a": "[Circular]",
                  "m3a": "[Circular]",
                  "oga": "[Circular]",
                  "ogg": "[Circular]",
                  "spx": "[Circular]",
                  "s3m": "[Circular]",
                  "sil": "[Circular]",
                  "uva": "[Circular]",
                  "uvva": "[Circular]",
                  "eol": "[Circular]",
                  "dra": "[Circular]",
                  "dts": "[Circular]",
                  "dtshd": "[Circular]",
                  "lvp": "[Circular]",
                  "pya": "[Circular]",
                  "ecelp4800": "[Circular]",
                  "ecelp7470": "[Circular]",
                  "ecelp9600": "[Circular]",
                  "rip": "[Circular]",
                  "wav": "[Circular]",
                  "weba": "[Circular]",
                  "aac": "[Circular]",
                  "aif": "[Circular]",
                  "aiff": "[Circular]",
                  "aifc": "[Circular]",
                  "caf": "[Circular]",
                  "flac": "[Circular]",
                  "mka": "[Circular]",
                  "m3u": "[Circular]",
                  "wax": "[Circular]",
                  "wma": "[Circular]",
                  "ram": "[Circular]",
                  "ra": "[Circular]",
                  "rmp": "[Circular]",
                  "xm": "[Circular]",
                  "cdx": "[Circular]",
                  "cif": "[Circular]",
                  "cmdf": "[Circular]",
                  "cml": "[Circular]",
                  "csml": "[Circular]",
                  "xyz": "[Circular]",
                  "ttc": "[Circular]",
                  "otf": "[Circular]",
                  "ttf": "[Circular]",
                  "woff": "[Circular]",
                  "woff2": "[Circular]",
                  "exr": "[Circular]",
                  "apng": "[Circular]",
                  "bmp": "[Circular]",
                  "cgm": "[Circular]",
                  "drle": "[Circular]",
                  "fits": "[Circular]",
                  "g3": "[Circular]",
                  "gif": "[Circular]",
                  "heic": "[Circular]",
                  "heics": "[Circular]",
                  "heif": "[Circular]",
                  "heifs": "[Circular]",
                  "hej2": "[Circular]",
                  "hsj2": "[Circular]",
                  "ief": "[Circular]",
                  "jls": "[Circular]",
                  "jp2": "[Circular]",
                  "jpg2": "[Circular]",
                  "jpeg": "[Circular]",
                  "jpg": "[Circular]",
                  "jpe": "[Circular]",
                  "jph": "[Circular]",
                  "jhc": "[Circular]",
                  "jpm": "[Circular]",
                  "jpx": "[Circular]",
                  "jpf": "[Circular]",
                  "jxr": "[Circular]",
                  "jxra": "[Circular]",
                  "jxrs": "[Circular]",
                  "jxs": "[Circular]",
                  "jxsc": "[Circular]",
                  "jxsi": "[Circular]",
                  "jxss": "[Circular]",
                  "ktx": "[Circular]",
                  "png": "[Circular]",
                  "btif": "[Circular]",
                  "pti": "[Circular]",
                  "sgi": "[Circular]",
                  "svg": "[Circular]",
                  "svgz": "[Circular]",
                  "t38": "[Circular]",
                  "tif": "[Circular]",
                  "tiff": "[Circular]",
                  "tfx": "[Circular]",
                  "psd": "[Circular]",
                  "azv": "[Circular]",
                  "uvi": "[Circular]",
                  "uvvi": "[Circular]",
                  "uvg": "[Circular]",
                  "uvvg": "[Circular]",
                  "djvu": "[Circular]",
                  "djv": "[Circular]",
                  "sub": "[Circular]",
                  "dwg": "[Circular]",
                  "dxf": "[Circular]",
                  "fbs": "[Circular]",
                  "fpx": "[Circular]",
                  "fst": "[Circular]",
                  "mmr": "[Circular]",
                  "rlc": "[Circular]",
                  "ico": "[Circular]",
                  "dds": "[Circular]",
                  "mdi": "[Circular]",
                  "wdp": "[Circular]",
                  "npx": "[Circular]",
                  "tap": "[Circular]",
                  "vtf": "[Circular]",
                  "wbmp": "[Circular]",
                  "xif": "[Circular]",
                  "pcx": "[Circular]",
                  "webp": "[Circular]",
                  "3ds": "[Circular]",
                  "ras": "[Circular]",
                  "cmx": "[Circular]",
                  "fh": "[Circular]",
                  "fhc": "[Circular]",
                  "fh4": "[Circular]",
                  "fh5": "[Circular]",
                  "fh7": "[Circular]",
                  "jng": "[Circular]",
                  "sid": "[Circular]",
                  "pic": "[Circular]",
                  "pct": "[Circular]",
                  "pnm": "[Circular]",
                  "pbm": "[Circular]",
                  "pgm": "[Circular]",
                  "ppm": "[Circular]",
                  "rgb": "[Circular]",
                  "tga": "[Circular]",
                  "xbm": "[Circular]",
                  "xpm": "[Circular]",
                  "xwd": "[Circular]",
                  "disposition-notification": "[Circular]",
                  "u8msg": "[Circular]",
                  "u8dsn": "[Circular]",
                  "u8mdn": "[Circular]",
                  "u8hdr": "[Circular]",
                  "eml": "[Circular]",
                  "mime": "[Circular]",
                  "wsc": "[Circular]",
                  "3mf": "[Circular]",
                  "gltf": "[Circular]",
                  "glb": "[Circular]",
                  "igs": "[Circular]",
                  "iges": "[Circular]",
                  "msh": "[Circular]",
                  "mesh": "[Circular]",
                  "silo": "[Circular]",
                  "dae": "[Circular]",
                  "dwf": "[Circular]",
                  "gdl": "[Circular]",
                  "gtw": "[Circular]",
                  "mts": "[Circular]",
                  "ogex": "[Circular]",
                  "x_b": "[Circular]",
                  "x_t": "[Circular]",
                  "usdz": "[Circular]",
                  "bsp": "[Circular]",
                  "vtu": "[Circular]",
                  "wrl": "[Circular]",
                  "vrml": "[Circular]",
                  "x3db": "[Circular]",
                  "x3dbz": "[Circular]",
                  "x3dv": "[Circular]",
                  "x3dvz": "[Circular]",
                  "x3d": "[Circular]",
                  "x3dz": "[Circular]",
                  "appcache": "[Circular]",
                  "manifest": "[Circular]",
                  "ics": "[Circular]",
                  "ifb": "[Circular]",
                  "coffee": "[Circular]",
                  "litcoffee": "[Circular]",
                  "css": "[Circular]",
                  "csv": "[Circular]",
                  "html": "[Circular]",
                  "htm": "[Circular]",
                  "shtml": "[Circular]",
                  "jade": "[Circular]",
                  "jsx": "[Circular]",
                  "less": "[Circular]",
                  "markdown": "[Circular]",
                  "md": "[Circular]",
                  "mml": "[Circular]",
                  "mdx": "[Circular]",
                  "n3": "[Circular]",
                  "txt": "[Circular]",
                  "text": "[Circular]",
                  "conf": "[Circular]",
                  "def": "[Circular]",
                  "list": "[Circular]",
                  "log": "[Circular]",
                  "in": "[Circular]",
                  "ini": "[Circular]",
                  "dsc": "[Circular]",
                  "rtx": "[Circular]",
                  "sgml": "[Circular]",
                  "sgm": "[Circular]",
                  "shex": "[Circular]",
                  "slim": "[Circular]",
                  "slm": "[Circular]",
                  "stylus": "[Circular]",
                  "styl": "[Circular]",
                  "tsv": "[Circular]",
                  "t": "[Circular]",
                  "tr": "[Circular]",
                  "roff": "[Circular]",
                  "man": "[Circular]",
                  "me": "[Circular]",
                  "ms": "[Circular]",
                  "ttl": "[Circular]",
                  "uri": "[Circular]",
                  "uris": "[Circular]",
                  "urls": "[Circular]",
                  "vcard": "[Circular]",
                  "curl": "[Circular]",
                  "dcurl": "[Circular]",
                  "mcurl": "[Circular]",
                  "scurl": "[Circular]",
                  "fly": "[Circular]",
                  "flx": "[Circular]",
                  "gv": "[Circular]",
                  "3dml": "[Circular]",
                  "spot": "[Circular]",
                  "jad": "[Circular]",
                  "wml": "[Circular]",
                  "wmls": "[Circular]",
                  "vtt": "[Circular]",
                  "s": "[Circular]",
                  "asm": "[Circular]",
                  "c": "[Circular]",
                  "cc": "[Circular]",
                  "cxx": "[Circular]",
                  "cpp": "[Circular]",
                  "h": "[Circular]",
                  "hh": "[Circular]",
                  "dic": "[Circular]",
                  "htc": "[Circular]",
                  "f": "[Circular]",
                  "for": "[Circular]",
                  "f77": "[Circular]",
                  "f90": "[Circular]",
                  "hbs": "[Circular]",
                  "java": "[Circular]",
                  "lua": "[Circular]",
                  "mkd": "[Circular]",
                  "nfo": "[Circular]",
                  "opml": "[Circular]",
                  "p": "[Circular]",
                  "pas": "[Circular]",
                  "pde": "[Circular]",
                  "sass": "[Circular]",
                  "scss": "[Circular]",
                  "etx": "[Circular]",
                  "sfv": "[Circular]",
                  "ymp": "[Circular]",
                  "uu": "[Circular]",
                  "vcs": "[Circular]",
                  "vcf": "[Circular]",
                  "yaml": "[Circular]",
                  "yml": "[Circular]",
                  "3gp": "[Circular]",
                  "3g2": "[Circular]",
                  "h261": "[Circular]",
                  "h263": "[Circular]",
                  "h264": "[Circular]",
                  "jpgv": "[Circular]",
                  "jpgm": "[Circular]",
                  "mj2": "[Circular]",
                  "mjp2": "[Circular]",
                  "ts": "[Circular]",
                  "mp4": "[Circular]",
                  "mp4v": "[Circular]",
                  "mpg4": "[Circular]",
                  "mpeg": "[Circular]",
                  "mpg": "[Circular]",
                  "mpe": "[Circular]",
                  "m1v": "[Circular]",
                  "m2v": "[Circular]",
                  "ogv": "[Circular]",
                  "qt": "[Circular]",
                  "mov": "[Circular]",
                  "uvh": "[Circular]",
                  "uvvh": "[Circular]",
                  "uvm": "[Circular]",
                  "uvvm": "[Circular]",
                  "uvp": "[Circular]",
                  "uvvp": "[Circular]",
                  "uvs": "[Circular]",
                  "uvvs": "[Circular]",
                  "uvv": "[Circular]",
                  "uvvv": "[Circular]",
                  "dvb": "[Circular]",
                  "fvt": "[Circular]",
                  "mxu": "[Circular]",
                  "m4u": "[Circular]",
                  "pyv": "[Circular]",
                  "uvu": "[Circular]",
                  "uvvu": "[Circular]",
                  "viv": "[Circular]",
                  "webm": "[Circular]",
                  "f4v": "[Circular]",
                  "fli": "[Circular]",
                  "flv": "[Circular]",
                  "m4v": "[Circular]",
                  "mkv": "[Circular]",
                  "mk3d": "[Circular]",
                  "mks": "[Circular]",
                  "mng": "[Circular]",
                  "asf": "[Circular]",
                  "asx": "[Circular]",
                  "vob": "[Circular]",
                  "wm": "[Circular]",
                  "wmv": "[Circular]",
                  "wmx": "[Circular]",
                  "wvx": "[Circular]",
                  "avi": "[Circular]",
                  "movie": "[Circular]",
                  "smv": "[Circular]",
                  "ice": "[Circular]"
                }
              },
              "plugins": {},
              "registrations": {},
              "settings": {
                "port": 3000,
                "routes": {
                  "cache": {
                    "statuses": [
                      200,
                      204
                    ],
                    "otherwise": "no-cache"
                  },
                  "compression": {},
                  "cors": false,
                  "ext": {},
                  "files": {
                    "relativeTo": "."
                  },
                  "json": {
                    "replacer": null,
                    "space": null,
                    "suffix": null,
                    "escape": false
                  },
                  "log": {
                    "collect": false
                  },
                  "payload": {
                    "output": "data",
                    "parse": true,
                    "protoAction": "error",
                    "maxBytes": 1048576,
                    "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                    "failAction": "error",
                    "timeout": 10000,
                    "defaultContentType": "application/json",
                    "compression": {}
                  },
                  "response": {
                    "disconnectStatusCode": 499,
                    "emptyStatusCode": 200,
                    "failAction": "error",
                    "options": {},
                    "ranges": true
                  },
                  "security": false,
                  "state": {
                    "parse": true,
                    "failAction": "error"
                  },
                  "timeout": {
                    "server": false
                  },
                  "validate": {
                    "failAction": "error",
                    "options": {}
                  }
                },
                "compression": {
                  "minBytes": 1024
                },
                "debug": {
                  "request": [
                    "implementation"
                  ]
                },
                "load": {
                  "sampleInterval": 0,
                  "concurrent": 0
                },
                "mime": null,
                "operations": {
                  "cleanStop": true
                },
                "query": {},
                "router": {
                  "isCaseSensitive": true,
                  "stripTrailingSlash": false
                },
                "autoListen": true
              },
              "states": {
                "settings": {
                  "strictHeader": true,
                  "ignoreErrors": false,
                  "isSecure": true,
                  "isHttpOnly": true,
                  "isSameSite": "Strict",
                  "path": null,
                  "domain": null,
                  "ttl": null,
                  "encoding": "none"
                },
                "cookies": {},
                "names": []
              },
              "type": "tcp",
              "version": "18.4.0",
              "realm": {
                "_extensions": {
                  "onPreAuth": {
                    "_topo": {
                      "_items": [],
                      "nodes": []
                    },
                    "_core": "[Circular]",
                    "_routes": [
                      {
                        "method": "get",
                        "path": "/{path*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": null,
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "payload": null,
                            "headers": null,
                            "params": null,
                            "query": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {}
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": false,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "path"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "get",
                          "path": "/{path*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 4,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          },
                          "onPreAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreAuth",
                            "nodes": null
                          },
                          "onCredentials": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onCredentials",
                            "nodes": null
                          },
                          "onPostAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostAuth",
                            "nodes": null
                          },
                          "onPreHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreHandler",
                            "nodes": null
                          },
                          "onPostHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostHandler",
                            "nodes": null
                          }
                        },
                        "_cycle": [
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      },
                      {
                        "method": "post",
                        "path": "/{path*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": {
                            "output": "data",
                            "parse": true,
                            "protoAction": "error",
                            "maxBytes": 1048576,
                            "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                            "failAction": "error",
                            "timeout": 10000,
                            "defaultContentType": "application/json",
                            "compression": {},
                            "decoders": {}
                          },
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "headers": null,
                            "params": null,
                            "query": null,
                            "payload": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {}
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": false,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "path"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "post",
                          "path": "/{path*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 5,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          },
                          "onPreAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreAuth",
                            "nodes": null
                          },
                          "onCredentials": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onCredentials",
                            "nodes": null
                          },
                          "onPostAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostAuth",
                            "nodes": null
                          },
                          "onPreHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreHandler",
                            "nodes": null
                          },
                          "onPostHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostHandler",
                            "nodes": null
                          }
                        },
                        "_cycle": [
                          null,
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      },
                      {
                        "method": "put",
                        "path": "/{path*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": {
                            "output": "data",
                            "parse": true,
                            "protoAction": "error",
                            "maxBytes": 1048576,
                            "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                            "failAction": "error",
                            "timeout": 10000,
                            "defaultContentType": "application/json",
                            "compression": {},
                            "decoders": "[Circular]"
                          },
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "headers": null,
                            "params": null,
                            "query": null,
                            "payload": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {}
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": false,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "path"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "put",
                          "path": "/{path*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 6,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          },
                          "onPreAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreAuth",
                            "nodes": null
                          },
                          "onCredentials": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onCredentials",
                            "nodes": null
                          },
                          "onPostAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostAuth",
                            "nodes": null
                          },
                          "onPreHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreHandler",
                            "nodes": null
                          },
                          "onPostHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostHandler",
                            "nodes": null
                          }
                        },
                        "_cycle": [
                          null,
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      },
                      {
                        "method": "patch",
                        "path": "/{path*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": {
                            "output": "data",
                            "parse": true,
                            "protoAction": "error",
                            "maxBytes": 1048576,
                            "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                            "failAction": "error",
                            "timeout": 10000,
                            "defaultContentType": "application/json",
                            "compression": {},
                            "decoders": "[Circular]"
                          },
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "headers": null,
                            "params": null,
                            "query": null,
                            "payload": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {}
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": false,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "path"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "patch",
                          "path": "/{path*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 7,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          },
                          "onPreAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreAuth",
                            "nodes": null
                          },
                          "onCredentials": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onCredentials",
                            "nodes": null
                          },
                          "onPostAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostAuth",
                            "nodes": null
                          },
                          "onPreHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreHandler",
                            "nodes": null
                          },
                          "onPostHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostHandler",
                            "nodes": null
                          }
                        },
                        "_cycle": [
                          null,
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      },
                      {
                        "method": "delete",
                        "path": "/{path*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": {
                            "output": "data",
                            "parse": true,
                            "protoAction": "error",
                            "maxBytes": 1048576,
                            "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                            "failAction": "error",
                            "timeout": 10000,
                            "defaultContentType": "application/json",
                            "compression": {},
                            "decoders": "[Circular]"
                          },
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "headers": null,
                            "params": null,
                            "query": null,
                            "payload": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {}
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": false,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "path"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "delete",
                          "path": "/{path*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 8,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          },
                          "onPreAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreAuth",
                            "nodes": null
                          },
                          "onCredentials": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onCredentials",
                            "nodes": null
                          },
                          "onPostAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostAuth",
                            "nodes": null
                          },
                          "onPreHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreHandler",
                            "nodes": null
                          },
                          "onPostHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostHandler",
                            "nodes": null
                          }
                        },
                        "_cycle": [
                          null,
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      },
                      {
                        "method": "options",
                        "path": "/{path*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": {
                            "output": "data",
                            "parse": true,
                            "protoAction": "error",
                            "maxBytes": 1048576,
                            "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                            "failAction": "error",
                            "timeout": 10000,
                            "defaultContentType": "application/json",
                            "compression": {},
                            "decoders": "[Circular]"
                          },
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "headers": null,
                            "params": null,
                            "query": null,
                            "payload": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {}
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": false,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "path"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "options",
                          "path": "/{path*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 9,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          },
                          "onPreAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreAuth",
                            "nodes": null
                          },
                          "onCredentials": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onCredentials",
                            "nodes": null
                          },
                          "onPostAuth": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostAuth",
                            "nodes": null
                          },
                          "onPreHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreHandler",
                            "nodes": null
                          },
                          "onPostHandler": {
                            "_topo": {
                              "_items": [],
                              "nodes": []
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPostHandler",
                            "nodes": null
                          }
                        },
                        "_cycle": [
                          null,
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      }
                    ],
                    "type": "onPreAuth",
                    "nodes": null
                  },
                  "onCredentials": {
                    "_topo": {
                      "_items": [],
                      "nodes": []
                    },
                    "_core": "[Circular]",
                    "_routes": [
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]"
                    ],
                    "type": "onCredentials",
                    "nodes": null
                  },
                  "onPostAuth": {
                    "_topo": {
                      "_items": [],
                      "nodes": []
                    },
                    "_core": "[Circular]",
                    "_routes": [
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]"
                    ],
                    "type": "onPostAuth",
                    "nodes": null
                  },
                  "onPreHandler": {
                    "_topo": {
                      "_items": [],
                      "nodes": []
                    },
                    "_core": "[Circular]",
                    "_routes": [
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]"
                    ],
                    "type": "onPreHandler",
                    "nodes": null
                  },
                  "onPostHandler": {
                    "_topo": {
                      "_items": [],
                      "nodes": []
                    },
                    "_core": "[Circular]",
                    "_routes": [
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]"
                    ],
                    "type": "onPostHandler",
                    "nodes": null
                  },
                  "onPreResponse": {
                    "_topo": {
                      "_items": [],
                      "nodes": []
                    },
                    "_core": "[Circular]",
                    "_routes": [
                      {
                        "method": "_special",
                        "path": "/{p*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": {
                            "output": "data",
                            "parse": true,
                            "protoAction": "error",
                            "maxBytes": 1048576,
                            "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                            "failAction": "error",
                            "timeout": 10000,
                            "defaultContentType": "application/json",
                            "compression": {},
                            "decoders": "[Circular]"
                          },
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "headers": null,
                            "params": null,
                            "query": null,
                            "payload": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {},
                          "auth": false
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": true,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "p"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "_special",
                          "path": "/{p*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 2,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          }
                        },
                        "_cycle": [
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      },
                      {
                        "method": "_special",
                        "path": "/{p*}",
                        "settings": {
                          "cache": {
                            "statuses": [
                              200,
                              204
                            ],
                            "otherwise": "no-cache"
                          },
                          "compression": {},
                          "cors": false,
                          "ext": {},
                          "files": {
                            "relativeTo": "."
                          },
                          "json": {
                            "replacer": null,
                            "space": null,
                            "suffix": null,
                            "escape": false
                          },
                          "log": {
                            "collect": false
                          },
                          "payload": {
                            "output": "data",
                            "parse": true,
                            "protoAction": "error",
                            "maxBytes": 1048576,
                            "uploads": "/var/folders/9y/7qbnb2jj1hlc3ksfzg2ph60m0000gn/T",
                            "failAction": "error",
                            "timeout": 10000,
                            "defaultContentType": "application/json",
                            "compression": {},
                            "decoders": "[Circular]"
                          },
                          "response": {
                            "disconnectStatusCode": 499,
                            "emptyStatusCode": 200,
                            "failAction": "error",
                            "options": {},
                            "ranges": true
                          },
                          "security": null,
                          "state": {
                            "parse": true,
                            "failAction": "error"
                          },
                          "timeout": {
                            "server": false
                          },
                          "validate": {
                            "failAction": "error",
                            "options": {},
                            "headers": null,
                            "params": null,
                            "query": null,
                            "payload": null,
                            "state": null
                          },
                          "plugins": {},
                          "app": {},
                          "auth": false
                        },
                        "_core": "[Circular]",
                        "realm": "[Circular]",
                        "_special": true,
                        "_analysis": {
                          "segments": [
                            {
                              "wildcard": true
                            }
                          ],
                          "fingerprint": "/#",
                          "params": [
                            "p"
                          ]
                        },
                        "params": "[Circular]",
                        "fingerprint": "/#",
                        "public": {
                          "method": "_special",
                          "path": "/{p*}",
                          "realm": "[Circular]",
                          "settings": "[Circular]",
                          "fingerprint": "/#",
                          "auth": {}
                        },
                        "_prerequisites": null,
                        "_extensions": {
                          "onPreResponse": {
                            "_topo": {
                              "_items": [
                                {
                                  "seq": 0,
                                  "sort": 3,
                                  "before": [],
                                  "after": [],
                                  "group": "?",
                                  "node": {
                                    "realm": "[Circular]"
                                  }
                                }
                              ],
                              "nodes": [
                                "[Circular]"
                              ]
                            },
                            "_core": "[Circular]",
                            "_routes": [],
                            "type": "onPreResponse",
                            "nodes": "[Circular]"
                          }
                        },
                        "_cycle": [
                          null,
                          null
                        ],
                        "_postCycle": [
                          "[Circular]"
                        ],
                        "_marshalCycle": [
                          null,
                          null,
                          null,
                          null,
                          null
                        ]
                      },
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]",
                      "[Circular]"
                    ],
                    "type": "onPreResponse",
                    "nodes": null
                  }
                },
                "modifiers": {
                  "route": {}
                },
                "parent": null,
                "pluginOptions": {},
                "plugins": {},
                "_rules": null,
                "settings": {
                  "files": {}
                }
              }
            },
            "settings": "[Circular]",
            "type": "tcp",
            "app": "[Circular]",
            "auth": {
              "_core": "[Circular]",
              "_schemes": {},
              "_strategies": {},
              "settings": {
                "default": null
              },
              "api": {}
            },
            "caches": {},
            "compression": {
              "encodings": [
                "identity",
                "gzip",
                "deflate"
              ],
              "_encoders": {
                "identity": null
              },
              "_decoders": "[Circular]",
              "_common": {}
            },
            "controlled": null,
            "decorations": "[Circular]",
            "dependencies": [],
            "events": "[Circular]",
            "heavy": {
              "settings": {
                "sampleInterval": 0,
                "maxHeapUsedBytes": 0,
                "maxRssBytes": 0,
                "maxEventLoopDelay": 0,
                "concurrent": 0
              },
              "_eventLoopTimer": null,
              "_loadBench": {
                "ts": 145183750.210231
              },
              "load": "[Circular]"
            },
            "instances": {},
            "methods": {
              "core": "[Circular]",
              "methods": "[Circular]"
            },
            "mime": "[Circular]",
            "plugins": "[Circular]",
            "queue": {
              "settings": "[Circular]",
              "active": 0,
              "queue": []
            },
            "registrations": "[Circular]",
            "registring": 0,
            "requestCounter": {
              "value": 10001,
              "min": 10000,
              "max": 99999
            },
            "router": {
              "settings": {
                "isCaseSensitive": true,
                "stripTrailingSlash": false
              },
              "routes": {
                "get": {
                  "routes": [
                    {
                      "path": "/{path*}",
                      "route": "[Circular]",
                      "segments": "[Circular]",
                      "params": "[Circular]",
                      "fingerprint": "/#",
                      "settings": "[Circular]"
                    }
                  ],
                  "router": {
                    "_edge": null,
                    "_fulls": null,
                    "_literals": null,
                    "_param": null,
                    "_mixed": null,
                    "_wildcard": {
                      "segment": "[Circular]",
                      "record": "[Circular]"
                    }
                  }
                },
                "post": {
                  "routes": [
                    {
                      "path": "/{path*}",
                      "route": "[Circular]",
                      "segments": "[Circular]",
                      "params": "[Circular]",
                      "fingerprint": "/#",
                      "settings": "[Circular]"
                    }
                  ],
                  "router": {
                    "_edge": null,
                    "_fulls": null,
                    "_literals": null,
                    "_param": null,
                    "_mixed": null,
                    "_wildcard": {
                      "segment": "[Circular]",
                      "record": "[Circular]"
                    }
                  }
                },
                "put": {
                  "routes": [
                    {
                      "path": "/{path*}",
                      "route": "[Circular]",
                      "segments": "[Circular]",
                      "params": "[Circular]",
                      "fingerprint": "/#",
                      "settings": "[Circular]"
                    }
                  ],
                  "router": {
                    "_edge": null,
                    "_fulls": null,
                    "_literals": null,
                    "_param": null,
                    "_mixed": null,
                    "_wildcard": {
                      "segment": "[Circular]",
                      "record": "[Circular]"
                    }
                  }
                },
                "patch": {
                  "routes": [
                    {
                      "path": "/{path*}",
                      "route": "[Circular]",
                      "segments": "[Circular]",
                      "params": "[Circular]",
                      "fingerprint": "/#",
                      "settings": "[Circular]"
                    }
                  ],
                  "router": {
                    "_edge": null,
                    "_fulls": null,
                    "_literals": null,
                    "_param": null,
                    "_mixed": null,
                    "_wildcard": {
                      "segment": "[Circular]",
                      "record": "[Circular]"
                    }
                  }
                },
                "delete": {
                  "routes": [
                    {
                      "path": "/{path*}",
                      "route": "[Circular]",
                      "segments": "[Circular]",
                      "params": "[Circular]",
                      "fingerprint": "/#",
                      "settings": "[Circular]"
                    }
                  ],
                  "router": {
                    "_edge": null,
                    "_fulls": null,
                    "_literals": null,
                    "_param": null,
                    "_mixed": null,
                    "_wildcard": {
                      "segment": "[Circular]",
                      "record": "[Circular]"
                    }
                  }
                },
                "options": {
                  "routes": [
                    {
                      "path": "/{path*}",
                      "route": "[Circular]",
                      "segments": "[Circular]",
                      "params": "[Circular]",
                      "fingerprint": "/#",
                      "settings": "[Circular]"
                    }
                  ],
                  "router": {
                    "_edge": null,
                    "_fulls": null,
                    "_literals": null,
                    "_param": null,
                    "_mixed": null,
                    "_wildcard": {
                      "segment": "[Circular]",
                      "record": "[Circular]"
                    }
                  }
                }
              },
              "ids": {},
              "vhosts": null,
              "specials": {
                "badRequest": {
                  "route": "[Circular]"
                },
                "notFound": {
                  "route": "[Circular]"
                },
                "options": null
              }
            },
            "phase": "started",
            "sockets": {},
            "actives": {},
            "started": true,
            "states": "[Circular]",
            "toolkit": {
              "reserved": [
                "abandon",
                "authenticated",
                "close",
                "context",
                "continue",
                "entity",
                "redirect",
                "realm",
                "request",
                "response",
                "state",
                "unauthenticated",
                "unstate"
              ]
            },
            "extensionsSeq": 10,
            "extensions": {
              "server": {
                "onPreStart": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [],
                  "type": "onPreStart",
                  "nodes": null
                },
                "onPostStart": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [],
                  "type": "onPostStart",
                  "nodes": null
                },
                "onPreStop": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [],
                  "type": "onPreStop",
                  "nodes": null
                },
                "onPostStop": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [],
                  "type": "onPostStop",
                  "nodes": null
                }
              },
              "route": {
                "onRequest": {
                  "_topo": {
                    "_items": [
                      {
                        "seq": 0,
                        "sort": 0,
                        "before": [],
                        "after": [],
                        "group": "?",
                        "node": {
                          "realm": "[Circular]"
                        }
                      }
                    ],
                    "nodes": [
                      "[Circular]"
                    ]
                  },
                  "_core": "[Circular]",
                  "_routes": [],
                  "type": "onRequest",
                  "nodes": "[Circular]"
                },
                "onPreAuth": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]"
                  ],
                  "type": "onPreAuth",
                  "nodes": null
                },
                "onCredentials": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]"
                  ],
                  "type": "onCredentials",
                  "nodes": null
                },
                "onPostAuth": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]"
                  ],
                  "type": "onPostAuth",
                  "nodes": null
                },
                "onPreHandler": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]"
                  ],
                  "type": "onPreHandler",
                  "nodes": null
                },
                "onPostHandler": {
                  "_topo": {
                    "_items": [],
                    "nodes": []
                  },
                  "_core": "[Circular]",
                  "_routes": [
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]"
                  ],
                  "type": "onPostHandler",
                  "nodes": null
                },
                "onPreResponse": {
                  "_topo": {
                    "_items": [
                      {
                        "seq": 0,
                        "sort": 1,
                        "before": [],
                        "after": [],
                        "group": "?",
                        "node": {
                          "realm": "[Circular]"
                        }
                      }
                    ],
                    "nodes": [
                      "[Circular]"
                    ]
                  },
                  "_core": "[Circular]",
                  "_routes": [
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]",
                    "[Circular]"
                  ],
                  "type": "onPreResponse",
                  "nodes": "[Circular]"
                }
              }
            },
            "_decorations": {
              "handler": {},
              "request": {},
              "server": {},
              "toolkit": {},
              "requestApply": null
            },
            "listener": "[Circular]",
            "info": "[Circular]"
          },
          "_entity": null,
          "_eventContext": {
            "request": "[Circular]"
          },
          "_events": null,
          "_expectContinue": false,
          "_isPayloadPending": false,
          "_isReplied": true,
          "_route": "[Circular]",
          "_serverTimeoutId": null,
          "_states": {},
          "_urlError": null,
          "app": {},
          "headers": {
            "accept": "application/vnd.interoperability.quotes+json;version=1",
            "date": "Wed, 06 Nov 2019 12:45:50 GMT",
            "fspiop-source": "payerfsp",
            "fspiop-destination": "payeefsp",
            "user-agent": "PostmanRuntime/7.20.1",
            "cache-control": "no-cache",
            "postman-token": "c6ce3a4d-2390-4aa3-a028-57584438dc8e",
            "host": "localhost:3000",
            "accept-encoding": "gzip, deflate",
            "content-length": "791",
            "connection": "keep-alive"
          },
          "info": {
            "received": 1574945483911,
            "remoteAddress": "127.0.0.1",
            "remotePort": 58166,
            "referrer": "",
            "host": "localhost:3000",
            "hostname": "localhost",
            "id": "1574945483911:Vijays-MacBook-Pro.local:42624:k3ipviq0:10000",
            "acceptEncoding": "gzip",
            "cors": null,
            "responded": 0,
            "completed": 0
          },
          "jsonp": null,
          "logs": [],
          "method": "post",
          "mime": "application/json",
          "orig": {},
          "params": {
            "path": "quotes"
          },
          "paramsArray": [
            "quotes"
          ],
          "path": "/quotes",
          "payload": {
            "quoteId": "a9878eee-cc2a-4b38-aa0e-23d877dd5cce",
            "transactionId": "d07dbe11-f108-42c7-93c5-fccec160f361",
            "payer": {
              "partyIdInfo": {
                "partyIdType": "MSISDN",
                "partyIdentifier": "22507008181",
                "fspId": "payerfsp"
              },
              "personalInfo": {
                "complexName": {
                  "firstName": "Mats",
                  "lastName": "Hagman"
                },
                "dateOfBirth": "1983-10-25"
              }
            },
            "payee": {
              "partyIdInfo": {
                "partyIdType": "MSISDN",
                "partyIdentifier": "22556999125",
                "fspId": "payeefsp"
              }
            },
            "amountType": "SEND",
            "amount": {
              "amount": "60",
              "currency": "USD"
            },
            "transactionType": {
              "scenario": "TRANSFER",
              "initiator": "PAYER",
              "initiatorType": "CONSUMER"
            },
            "note": "hej",
            "expiration": "3000"
          },
          "plugins": {
            "negotiatedContentType": "application/vnd.interoperability.quotes+json;version=1.1"
          },
          "pre": {},
          "preResponses": {},
          "raw": {
            "req": {
              "_readableState": {
                "objectMode": false,
                "highWaterMark": 16384,
                "buffer": {
                  "head": null,
                  "tail": null,
                  "length": 0
                },
                "length": 0,
                "pipes": null,
                "pipesCount": 0,
                "flowing": false,
                "ended": true,
                "endEmitted": true,
                "reading": false,
                "sync": false,
                "needReadable": false,
                "emittedReadable": false,
                "readableListening": false,
                "resumeScheduled": false,
                "paused": false,
                "emitClose": true,
                "destroyed": false,
                "defaultEncoding": "utf8",
                "awaitDrain": 0,
                "readingMore": false,
                "decoder": null,
                "encoding": null
              },
              "readable": false,
              "_events": {
                "end": [
                  null,
                  null
                ],
                "error": [
                  null,
                  null
                ]
              },
              "_eventsCount": 4,
              "socket": {
                "connecting": false,
                "_hadError": false,
                "_handle": {
                  "reading": true,
                  "onconnection": null,
                  "_consumed": true
                },
                "_parent": null,
                "_host": null,
                "_readableState": {
                  "objectMode": false,
                  "highWaterMark": 16384,
                  "buffer": {
                    "head": null,
                    "tail": null,
                    "length": 0
                  },
                  "length": 0,
                  "pipes": null,
                  "pipesCount": 0,
                  "flowing": true,
                  "ended": false,
                  "endEmitted": false,
                  "reading": true,
                  "sync": false,
                  "needReadable": true,
                  "emittedReadable": false,
                  "readableListening": false,
                  "resumeScheduled": false,
                  "paused": false,
                  "emitClose": false,
                  "destroyed": false,
                  "defaultEncoding": "utf8",
                  "awaitDrain": 0,
                  "readingMore": false,
                  "decoder": null,
                  "encoding": null
                },
                "readable": true,
                "_events": {
                  "end": [
                    null,
                    null
                  ],
                  "drain": [
                    null,
                    null
                  ],
                  "close": [
                    null,
                    null,
                    null
                  ]
                },
                "_eventsCount": 8,
                "_writableState": {
                  "objectMode": false,
                  "highWaterMark": 16384,
                  "finalCalled": false,
                  "needDrain": false,
                  "ending": false,
                  "ended": false,
                  "finished": false,
                  "destroyed": false,
                  "decodeStrings": false,
                  "defaultEncoding": "utf8",
                  "length": 0,
                  "writing": false,
                  "corked": 0,
                  "sync": true,
                  "bufferProcessing": false,
                  "writecb": null,
                  "writelen": 0,
                  "bufferedRequest": null,
                  "lastBufferedRequest": null,
                  "pendingcb": 0,
                  "prefinished": false,
                  "errorEmitted": false,
                  "emitClose": false,
                  "bufferedRequestCount": 0,
                  "corkedRequestsFree": {
                    "next": null,
                    "entry": null
                  }
                },
                "writable": true,
                "allowHalfOpen": true,
                "_sockname": null,
                "_pendingData": null,
                "_pendingEncoding": "",
                "server": "[Circular]",
                "_server": "[Circular]",
                "timeout": 120000,
                "parser": {
                  "_headers": [],
                  "_url": "",
                  "socket": "[Circular]",
                  "incoming": "[Circular]",
                  "outgoing": null,
                  "maxHeaderPairs": 2000,
                  "_consumed": true,
                  "parsingHeadersStart": 1574945483908
                },
                "_paused": false,
                "_httpMessage": {
                  "_events": {
                    "finish": [
                      null,
                      null
                    ]
                  },
                  "_eventsCount": 1,
                  "output": [],
                  "outputEncodings": [],
                  "outputCallbacks": [],
                  "outputSize": 0,
                  "writable": true,
                  "_last": false,
                  "chunkedEncoding": false,
                  "shouldKeepAlive": true,
                  "useChunkedEncodingByDefault": true,
                  "sendDate": true,
                  "_removedConnection": false,
                  "_removedContLen": false,
                  "_removedTE": false,
                  "_contentLength": null,
                  "_hasBody": true,
                  "_trailer": "",
                  "finished": false,
                  "_headerSent": false,
                  "socket": "[Circular]",
                  "connection": "[Circular]",
                  "_header": null,
                  "_sent100": false,
                  "_expect_continue": false
                },
                "_peername": {
                  "address": "127.0.0.1",
                  "family": "IPv4",
                  "port": 58166
                }
              },
              "connection": "[Circular]",
              "httpVersionMajor": 1,
              "httpVersionMinor": 1,
              "httpVersion": "1.1",
              "complete": true,
              "headers": "[Circular]",
              "rawHeaders": [
                "Accept",
                "application/vnd.interoperability.quotes+json;version=1",
                "Date",
                "Wed, 06 Nov 2019 12:45:50 GMT",
                "FSPIOP-Source",
                "payerfsp",
                "FSPIOP-Destination",
                "payeefsp",
                "User-Agent",
                "PostmanRuntime/7.20.1",
                "Cache-Control",
                "no-cache",
                "Postman-Token",
                "c6ce3a4d-2390-4aa3-a028-57584438dc8e",
                "Host",
                "localhost:3000",
                "Accept-Encoding",
                "gzip, deflate",
                "Content-Length",
                "791",
                "Connection",
                "keep-alive"
              ],
              "trailers": {},
              "rawTrailers": [],
              "aborted": false,
              "upgrade": false,
              "url": "/quotes",
              "method": "POST",
              "statusCode": null,
              "statusMessage": null,
              "client": "[Circular]",
              "_consuming": true,
              "_dumped": false
            },
            "res": "[Circular]"
          },
          "response": "[Circular]",
          "route": "[Circular]",
          "query": {},
          "server": "[Circular]",
          "state": {},
          "url": "http://localhost:3000/quotes",
          "auth": {
            "isAuthenticated": false,
            "isAuthorized": false,
            "credentials": null,
            "artifacts": null,
            "strategy": null,
            "mode": null,
            "error": null
          }
        },
        "source": {
          "errorInformation": {
            "errorCode": "3100",
            "errorDescription": "should have required property 'content-type'",
            "extensionList": [
              {
                "key": "keyword",
                "value": "required"
              },
              {
                "key": "dataPath",
                "value": ".header"
              },
              {
                "key": "missingProperty",
                "value": "content-type"
              }
            ]
          }
        },
        "statusCode": 400,
        "variety": "plain",
        "settings": {
          "charset": "utf-8",
          "compressed": null,
          "encoding": "utf8",
          "message": null,
          "passThrough": true,
          "stringify": null,
          "ttl": null,
          "varyEtag": false
        },
        "_events": null,
        "_payload": null,
        "_error": null,
        "_contentType": "application/json",
        "_takeover": false,
        "_statusCode": true,
        "_processors": {},
        "temporary": null,
        "permanent": null,
        "rewritable": null
      }
    }
