# node-utils

Collection of utility functions I find myself needing across multiple projects

## Docs

### generateRandomString(nChars, constraints)

Generate a string of length `nChars` that satisfies `constraints`

#### Parameters

###### nChars

Required. Must be a whole number.

###### constraints

Object specifying what characters can be in the generated string.
It can have the following keys:

| Key       | Type    | Effect                                  |
| --------- | ------- | --------------------------------------- |
| lowercase | Boolean | if `true`, include lowercase characters |
| uppercase | Boolean | if `true`, include uppercase chracters  |
| digits    | Boolean | if `true`, include digits               |
| symbols   | Boolean | if `true`, include symbols              |

If `constraints` is not provided or is empty, it is assumed that all characters are allowed

#### Usage

```
const {generateRandomString: rsg} = require('@ack_inc/utils');
console.log(rsg(<anything but a whole number>)); //=> throws TypeError
console.log(rsg(0)); //=> ""
console.log(rsg(5)); //=> "3`8aE"
console.log(rsg(5, { lowercase: true })); //=> "fewjk"
console.log(rsg(5, { lowercase: true, uppercase: true, digits: true, symbols: true })); //=> "%q31G"
```

## To Do

- generateRandomString
  - Constraint: whitelisted chars
  - Constraint: blacklisted chars
  - Constraint: symbols that can be part of a url-component (See https://stackoverflow.com/questions/695438/what-are-the-safe-characters-for-making-urls)
