# input validator
Previously part of [utilities](https://www.github.com/ribeiro-tiago/utilities) now it's it's own library. The purpose? To validate user input according to x or y rule and show any validation errors to the end user. 
This class uses [utilities](https://www.github.com/ribeiro-tiago/utilities) for the validation rules.

# Instalation
You can either download and include the script to your file: `` <script src="path/to/script"></script> `` manually or you can use ecmascript 6's `` require("input-validator") ``

In this repo there's also some CSS for the error handling bit that you can use by downloading the CSS and including it on your code  ( `` <link rel="stylesheet" href="css/style.css">`` ). Alternatively you can also make your own error handling / css thingy.

The error handling function adds a `` has-error `` to the parent element of input and creates a `` span `` element for the error message.

# Usage

After including the file on your project all you need to do is `` validateInputs(validationObject, handleErrors); ``, where is an object (or array of objects in case of multiple field validation) with the element to validate and respective rule(s) (further explanation below) and handleErrors is a boolean that defaults to true that indicates whether the error messages are to be handled by this library or not. 

# validateInputs
This function validates DOM fields or simple values. Some of the rules also require a rule value, for instance when you using maxvalue you have to specify what's the max value. Every rule has it's own error message, however you can send your own custom error message (showed below).
This function accepts either and object or an array of objects. This object contains the field / value to be validated, the rule, a custom message (optional), ruleValue (depends on the which rule we're applying) and optional (which is in itself optional)

Validation object composition: 
```sh
{
  field: DOM element or value,
  rule: validation rule (string),
  message: a custom message you want for validation errors (string),
  ruleValue: some rules require a rulevalue (see below) 
  optional: for the times when a value is optional but must meet certain criteria (boolean)
}
```


Currently supports the following rules:
  - [required](#required)
  - [number](#number)
  - [even](#even)
  - [maxvalue](#maxvalue)
  - [minvalue](#minvalue)
  - [positive](#positive)
  - [maxlen](#maxlen)
  - [minlen](#minlen)
  - [email](#email)
  - [equal](#equal)
  - [phone](#phone)

## Examples
There are several ways for you to validate what you need. You can:
   - validate only one field with one validation rule
   - validate only one field with multiple validation rule
   - validate multiple fields with one validation rule each
   - validate multiple fields with multiple validation rule each
   - validate multiple fields with one validation rule for some fields and multiple for others
You can also have a specific custom message for each validation rule

#### One field, one rule
```sh
validateInputs({
  input: value,
  rule: "required"
});
```

#### One field, multiple rules
```sh
validateInputs({
  input: value, 
  rule: ["required", "number"]
});
```

#### Multiple fields, one rule each
```sh
validateInputs([
  {input: value, rule: "required"},
  {input: value2, rule: "email"},
  {input: value3, rule: "even"}
]);
```

#### Multiple fields, multiple rules
```sh
validateInputs([
  {input: value, rule: ["required", "even"]},
  {input: value2, rule: ["email", "positive"]}
]);
```

#### Multiple fields, mixed rules
```sh
validateInputs([
  {input: value, rule: "required"},
  {input: value2, rule: ["email", "positive"]}
]);
```

#### Multiple rules with custom message each
```sh
validateInputs([
  {input: value, rule: "required"},
  {input: value2, rule: [
    {rule: "email", message: "Custom message"},
    {rule: "positive", message: "Custom message 2"} 
  ]}
]);
```

#### Rules with rule value
```sh
validateInputs([
  {input: value, rule: "maxvalue", ruleValue: 5},
  {input: value2, rule: "required", message: "something"},
  {input: value3, rule: "maxvalue", ruleValue: 5, message: "another something"},
  {input: value4, rule: [
    {rule: "minlen", message: "Custom message", ruleValue: 5},
    {rule: "positive", message: "Custom message 2"},
    {rule: "required"}
  ]}
]);
```

### required
Checks if the value has something
```sh
validateInputs({input: value, rule: "required"});
```

### number
Checks if the value is a number
```sh
validateInputs({input: value, rule: "number"});
```

### even
Checks if the value is a number and if it's an even number
```sh
validateInputs({input: value, rule: "even"});
```

### maxvalue
Checks if the value is lower than the given rule value
```sh
validateInputs({input: value, rule: "maxvalue", ruleValue: 5});
```

### minvalue
Checks if the value is higher than the given rule value
```sh
validateInputs({input: value, rule: "minvalue", ruleValue: 5});
```

### positive
Checks if the value is a number and if it's positive
```sh
validateInputs({input: value, rule: "maxvalue", ruleValue: 5});
```

### equal 
Checks if the value equals the value(s) from the rule value
```sh
validateInputs({input: value, rule: "equal", ruleValue: 5});
```
or 
```sh
validateInputs({input: value, rule: "equal", ruleValue: [5, 2, 3]});
```

### maxlen
Checks if the value length is lower than the given rule value
```sh
validateInputs({input: value, rule: "maxlen", ruleValue: 5});
```

### minlen
Checks if the value length is higher than the given rule value
```sh
validateInputs({input: value, rule: "minlen", ruleValue: 5});
```

### email
Checks if the value is a valid email
```sh
validateInputs({input: value, rule: "email"});
```

### phone
Checks if the value is a valid phone number, according to the cirteria set by the rule value
```sh
validateInputs({input: value, rule: "phone", ruleValue: ["### ### ###", "#########"]});
```
or 
```sh
validateInputs({input: value, rule: "phone", ruleValue: "#########"});
```