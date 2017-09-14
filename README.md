# utils

##API


### isObject
params:
* some: any

returns boolean

example
```typescript
import {isObject} from 'ts-utils';

isObject(1); //false
isObject({}); //true
isObject([]); //false
```

### isEmpty
params:
* some: any

returns boolean

example
```typescript
import {isEmpty} from 'ts-utils';

isEmpty(0); //false
isEmpty(''); //false
isEmpty(null); //true
isEmpty(undefined); //true
```

### isNotEmpty
params:
* some: any

returns boolean

example
```typescript
import {isNotEmpty} from 'ts-utils';

isNotEmpty(0); //true
isNotEmpty(''); //true
isNotEmpty(null); //false
isNotEmpty(undefined); //false
```

### isString
params:
* some: any

returns boolean

example
```typescript
import {isString} from 'ts-utils';

isString(0); //false
isString(''); //true
isString(new String('')); //true
```

### isNumber
params:
* some: any

returns boolean

example
```typescript
import {isNumber} from 'ts-utils';

isNumber(0); //true
isNumber(new Number(0)); //true
isNumber(''); //false
```

### isArray
params:
* some: any

returns boolean

example
```typescript
import {isArray} from 'ts-utils';

isArray(0); //false
isArray([]); //true
isArray({}); //false
```

### isNull
params:
* some: any

returns boolean

example
```typescript
import {isArray} from 'ts-utils';

isArray(0); //false
isArray(null); //true
isArray(undefined); //false
```

### isUndefined
params:
* some: any

returns boolean

example
```typescript
import {isUndefined} from 'ts-utils';

isUndefined(0); //false
isUndefined(undefined); //true
isUndefined(null); //false
```

### isNaN
params:
* some: any

returns boolean

example
```typescript
import {isNaNCheck} from 'ts-utils';

isNaNCheck(0); //false
isNaNCheck(NaN); //true
isNaNCheck(null); //false
isNaNCheck(undefined); //false
```

### isFunction
params:
* some: any

returns boolean

example
```typescript
import {isFunction} from 'ts-utils';

isFunction(0); //false
isFunction(''.trim); //true
isFunction(null); //false
isFunction(undefined); //false
```

### numToLength
params:
* num: number
* len: number

returns string

example
```typescript
import {numToLength} from 'ts-utils';

numToLength(1, 2); //'01'
numToLength(1, 3); //'001'
numToLength(110, 3); //'110'
```

### round
params:
* num: number
* len?: number (default = 2)

returns string

example
```typescript
import {round} from 'ts-utils';

round(1.12213); //1.12
round(1.1239, 3); //1.124
```

### splitRange
params:
* num: number
* options?: {nbsp?: boolean; separator?: string}

returns string

example
```typescript
import {splitRange} from 'ts-utils';

splitRange(1000); //'1 000'
splitRange(1000.22); //'1 000.22'
splitRange(1000.22, {separator: ','}); //'1 000,22'
```

### each
params:
* someObject: Object,
* callback: (value?: any, key?: string) => any //Iterator

returns void

example
```typescript
import {each} from 'ts-utils';

let names = [];
each({a: 1, b: 2}, (value: number, key: string) => {
  names.push(key);
});
console.log(names); //['a', 'b']
```

### some
params:
* someObject: Object,
* callback: (value?: any, key?: string) => boolean //Iterator

returns boolean

example
```typescript
import {some} from 'ts-utils';

some({a: 1, b: 2}, (value: number, key: string) => {
  return key === 'b';
}); //true
```

## API filters

### not
params:
* processor?: (data: any) => any;

returns (data: any): boolean

example
```typescript
import {not} from 'ts-utils';

let filter = not((some: any) => some === 5 ? false : some);

filter(1) //false
filter(4) //false
filter(0) //true
filter('') //true
filter(5) //true
```

### empty
prams:
* options?: {
    skipNumber?: boolean;
    skipString?: boolean;
    skipNotEmpty?: boolean;
    skipNull?: boolean;
    skipUndefined?: boolean;
 }
 
 returns (data: any): boolean;
 
 example
 ```typescript
 import {empty} from 'ts-utils';

 let filter = empty();
 
 filter('') //false;
 filter(0) //false;
 filter(null) //false;
 filter(1) //true;
 filter({}) //true;
 
 let filter = empty({skipNull: true});
 
 filter('') //false;
 filter(0) //false;
 filter(null) //true;
 filter(1) //true;
 
 let filter = empty({skipNumber: true});
  
 filter('') //false;
 filter(0) //true;
 filter(null) //false;
 filter(1) //true;
  
 let filter = empty({skipNumber: true});
    
 filter('') //false;
 filter(0) //true;
 filter(null) //false;
 filter(1) //true;
 
 let filter = empty({skipNotEmpty: true});
    
 filter('') //true;
 filter(0) //true;
 filter(null) //false;
```
 
### contains
params: 
* data: Object

returns (data: any): boolean;

```typescript
import {contains} from 'ts-utils';

let filter = contains({id: 1});

filter(1) //false
filter({a: 1}) //false
filter({id: 1}) //true

[{id: 2}, {id: 1}, {id: 3}].filter(filter) // [{id: 1}];

```

### notContains
params:
* data: Object

returns (data: any): boolean;

```typescript
import {notContains} from 'ts-utils';

let filter = notContains({id: 1});

filter(1) //true
filter({a: 1}) //true
filter({id: 1}) //false

[{id: 2}, {id: 1}, {id: 3}].filter(filter) // [{id: 2}, {id: 3}];
```

### roundFilter
params:
* data: number

returns (data: number): number;

```typescript
import {roundFilter} from 'ts-utils';

let filter = roundFilter(3);

filter(1) //1
filter(22.22) //22.22
filter(22.226) //22.23
```

### roundFilter
params: 
* data: {nbsp: boolean; separator: string}
* \[processor\]: (data: any): number

returns (data: number): string;

```typescript
import {roundFilter} from 'ts-utils';

let filter = roundFilter({separator: ','});

filter(2222.22) // 2 222,22

let filter = roundFilter({separator: '.'});
filter(2222.22) // 2 222.22
```

### roundSplit
params: 
* len: number
* data: {nbsp: boolean; separator: string}

returns (data: number): string;

```typescript
import {roundSplit} from 'ts-utils';

let filter = roundSplit({separator: ','});

filter(2222.22) // 2 222,22

let filter = roundFilter({separator: '.'});
filter(2222.22) // 2 222.22
```

### Change log

## v3.0.0 
   * change method 'getPaths'
   * add method 'merge'
   * add method 'clone'
   * add method 'cloneDeep'
   * add method 'defaults'
   * fix method 'typeOf'

## v2.0.0

* rename isNaN to isNaNCheck
* add nodejs support
