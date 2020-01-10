Rules Engine
============

Table of Contents
=================

  - [Json Rules Engine:](#json-rules-engine)
  - [Implementation in Self Testing Toolkit](#implementation-in-self-testing-toolkit)
    - [Rules File](#rules-file)
    - [Defining Conditions](#defining-conditions)
    - [Events](#events)
      - [FIXED_ERROR_CALLBACK and FIXED_CALLBACK](#fixed_error_callback-and-fixed_callback)
      - [Configurable parameters](#configurable-parameters)
      - [MOCK_ERROR_CALLBACK and MOCK_CALLBACK](#mock_error_callback-and-mock_callback)
    - [Priority of rules](#priority-of-rules)
  
This Self Testing Toolkit implemented "Rules Engine" by taking advantage of ***Json Rules Engine*** (JRE).

## Json Rules Engine (JRE):
*"Json Rules Engine"* is a powerful, lightweight rules engine. Rules are composed of simple json structures, making them human readable and easy to persist.

Rules are composed of two components: conditions and events. Conditions are a set of requirements that must be met to trigger the rule's event.

You can refer https://www.npmjs.com/package/json-rules-engine for further information on JRE.

## Implementation in Self Testing Toolkit

The rules in self testing toolkit are implemented at two levels.
* Validation Rules - for validating the incoming request and sending error callback if the validation rule matches.
* Callback Rules - for generating callbacks if the callback rule matches.

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
  
      Example: /transfers, /parties/MSSDN/9876543210 ... etc

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
      
      Example: Type & ID of pathParams from the get request /parties/{Type}/{ID}
    * operationPath - This is used for matching the path syntax from open API file

      Example: operationPath contains the value /parties/{Type}/{ID} instead of /parties/MSISDN/9876543210 which can actually be found in the fact 'path'.

  * Operator - The ```operator``` compares the value returned by the ```fact``` to what is stored in the ```value``` property.  If the result is true, the condition passes.
    There are number of operators available to compare the values

    * String and Numeric operators:

      ```equal``` - _fact_ must equal _value_

      ```notEqual```  - _fact_ must not equal _value_

      _these operators use strict equality (===) and inequality (!==)_

    * Numeric operators:

      ```lessThan``` - _fact_ must be less than _value_

      ```lessThanInclusive```- _fact_ must be less than or equal to _value_

      ```greaterThan``` - _fact_ must be greater than _value_

      ```greaterThanInclusive```- _fact_ must be greater than or equal to _value_

    * Array operators:

      ```in```  - _fact_ must be included in _value_ (an array)

      ```notIn```  - _fact_ must not be included in _value_ (an array)

      ```contains```  - _fact_ (an array) must include _value_

      ```doesNotContain```  - _fact_ (an array) must not include _value_
  * Value - The actual value to compare
    
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

#### FIXED_ERROR_CALLBACK and FIXED_CALLBACK

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

The following is the list of configurable parameters that you can define anywhere in path, headers & body values.
* $request.params - Parameters in the request path
* $request.body - Request body
* $request.path - Entire request path
* $request.headers - Http headers of the request
* $config.<param_name> - Configuration parameter value from environment or local.env file
* $session.negotiatedContentType - Negotiated content type. Can be sent to callbacks and error callbacks
* $session.uniqueId - UniqueID for the request session


**Advanced parameters for developers:**

There are some advanced parameters type *$function* for advanced users / developers. Here is the exammple syntax:

* $function.sample.getSampleText (For development purpose)

The above parameter calls the function 'getSampleText' in 'sample.js' file located at 'lib/mocking/custom-functions' folder. An argument will be passed to this function from which the developer can get the request parameters to process, for example 'arg1.request.body.quoteId', 'arg1.request.headers.date' ...etc

Please note that these javascript files can not be changed at runtime and need to be compilated prior to running.


#### MOCK_ERROR_CALLBACK and MOCK_CALLBACK

For MOCK_ERROR_CALLBACK & MOCK_CALLBACK, we don't need to supply the details like path, method, headers & body. The toolkit will generate the callback based on the openAPI definition file.

Let's look at an example of an event type *MOCK_ERROR_CALLBACK*
```
"event": {
  "type": "MOCK_ERROR_CALLBACK",
  "params": {
  }
}
```

That's all that is required; the self testing toolkit will generate a mock callback based on the open API file with random values. 

**Also you can define the params like in fixed callbacks to override a particular value.**

See the following example in which the generated values of the firstName & name will be replaced accordingly

```
"event": {
  "type": "MOCK_CALLBACK",
  "params": {
    "body": {
      "party": {
        "personalInfo": {
          "complexName": {
            "firstName": "A fixed value",
          }
        }
        "name": "The party with phone number ${request.params.ID}"
      }
    }
  }
}

```

### Priority of rules

The 'priority' property in a rule dictates when rule should be run, relative to other rules. Higher priority rules are run before lower priority rules. Rules with the same priority are ran in parallel. Priority must be a positive, non-zero integer.

**Example:** DJM: can we please discuss

In the example below, the rule which compares the amount value will be executed first, and then the other rule will be executed. Thus if the amount is equal to 50, then we will get FIXED_CALLBACK event in first place, and in other cases we get MOCK_CALLBACK.

```
[
  {
    "ruleId": 1,
    "priority": 2,
    "description": "If the transfer amount is equal to 50 USD, send a fixed callback",
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
          "value": "50",
          "path": "amount.amount"
        }
      ]
    },
    "event": {
      "type": "FIXED_CALLBACK",
      "params": {
        ...Some fixed callback
      }
    }
  },
  {
    "ruleId": 2,
    "priority": 1,
    "description": "Send a mock callback for all the remaining transfer requests",
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
        }
      ]
    },
    "event": {
      "type": "MOCK_CALLBACK",
      "params": {
      }
    }
  },
```
