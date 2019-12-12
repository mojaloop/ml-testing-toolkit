# Rules Engine

This Self Testing Tookit implemented "Rules Engine" by taking advantage of ***Json Rules Engine***.

## Json Rules Engine:
*"Json Rules Engine"* is a powerful, lightweight rules engine. Rules are composed of simple json structures, making them human readable and easy to persist.

Rules are composed of two components: conditions and events. Conditions are a set of requirements that must be met to trigger the rule's event.

You can refer https://www.npmjs.com/package/json-rules-engine for further information on JRE.

## Implementation in Self Testing Tookit

The rules in self testing toookit are implemented in two levels.
* One for validating the incoming request and send error callback if the validation rule matches.
* Another for generating callbacks if the callback rule matches.

In both cases the conditions syntax is same as per the Json Rules Engine, where as the event types will be different for the two levels.

### Rules File
The rules file is a json file with an array of individual rules.

A typical validation rule file syntax is like below.
```
[
  {
    "ruleId": 1,
    "description": "If the transfer amount is equal to 2 USD, send a fixed error callback",
    "conditions": {
      "all": [
        {
          "fact": "path",
          "operator": "equal",
          "value": "/transfers"
        },
        {
          "fact": "method",
          "operator": "equal",
          "value": "post"
        },
        {
          "fact": "body",
          "operator": "equal",
          "value": "2",
          "path": "amount.amount"
        }
      ]
    },
    "event": {
      "type": "FIXED_ERROR_CALLBACK",
      "params": {
        "path": "/transfers/{$request.body.transferId}/error",
        "method": "put",
        "headers": {},
        "delay": 100,
        "body": {
          "errorInformation": {
            "errorCode": "5001",
            "errorDescription": "The amount is less than the required amount"
          }
        }
      }
    }
  }
]
```

### Defining Conditions

Conditions can be defined with either "all" or "any" type of arrays. In each array there are objects containing three basic properties "fact", "operator" and "value".

  * Fact - facts are the variable names that can be one of the following
    * path - The request path
  
      Example: /transfers, /parties/MSISDN/9876543210 ... etc

    * method - The http method of the request in lowercase
  
      Example: get, post ... etc

    * body - The request body object. The properties of the body can be specified using a *condition helper* called **"path"**.
      
      Example: amount.amount from the body '{ "amount": { "amount": 20, "type": "USD" } }' can be compared with the following condition
      ```
      {
        "fact": "body",
        "operator": "equal",
        "value": "100",
        "path": "amount.amount"
      }
      ```
  
    * pathParams - By using this the parameter values from the request path can be compared.
      
      Example: Type & ID of pathParams from the get request /parties/{Type}/{ID})
    
    Following are the examples of conditions

    ```
    "all": [
        {
          "fact": "path",
          "operator": "equal",
          "value": "/transfers"
        },
        {
          "fact": "method",
          "operator": "equal",
          "value": "post"
        }
    ]
    ```

    ```
    "any": [
        {
          "fact": "body",
          "path": "amount.type",
          "operator": "equal",
          "value": "GBP"
        },
        {
          "fact": "body",
          "path": "amount.type",
          "operator": "equal",
          "value": "USD"
        }
    ]
    ```

### Events

And event can be defined with "type" and "params" properties.

There are different type of events based on the rules engine level.

* Validation Rules Engine
  * FIXED_ERROR_CALLBACK
  * MOCK_ERROR_CALLBACK
* Callbacks Rules Engine
  * FIXED_CALLBACK
  * MOCK_CALLBACK

#### FIXED_ERROR_CALLBACK & FIXED_CALLBACK:

For FIXED_ERROR_CALLBACK & FIXED_CALLBACK, we need to supply every detail for sending callback like path, method, headers & body
Let's look at an example of an event type *FIXED_ERROR_CALLBACK*
```
"event": {
  "type": "FIXED_ERROR_CALLBACK",
  "params": {
    "path": "/parties/{$request.params.Type}/{$request.params.ID}/error",
    "method": "put",
    "headers": {},
    "delay": 100,
    "body": {
      "errorInformation": {
        "errorCode": "5001",
        "errorDescription": "The party {$request.params.ID} is not found"
      }
    }
  }
}
```

#### Configurable parameters

You can observe the configurable parameters '\{\$request.params.Type\}' and '\{\$request.params.ID\}'. These values will be replaced with the values from the request in run time.

The following is the list of configurable paramers that you can define anywhere in path, headers & body values.
* $request.params - Parameters in the request path
* $request.body - Request body
* $request.path - Entire request path
* $request.headers - Http headers of the request


#### MOCK_ERROR_CALLBACK & MOCK_CALLBACK:

For MOCK_ERROR_CALLBACK & MOCK_CALLBACK, we don't need to supply the details like path, method, headers & body. The toolkit will generate the callback based on the openAPI definition file.

Let's look at an example of an event type *MOCK_ERROR_CALLBACK*
```
"event": {
  "type": "MOCK_ERROR_CALLBACK",
  "params": {
  }
}
```

That's it, the self testing toolkit can be able to generate a mock callback based on the open API file with random values. 

**Also you can define the params like fixed callbacks to override a perticular value.**