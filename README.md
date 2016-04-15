# utils

##API
### isObject
params:
* some: any

returns boolean

example
```typescript
utils.isObject(1); //false
utils.isObject({}); //true
utils.isObject([]); //false
```

### isEmpty
params:
* some: any

returns boolean

example
```typescript
utils.isEmpty(0); //false
utils.isEmpty(''); //false
utils.isEmpty(null); //true
utils.isEmpty(undefined); //true
```

### isNotEmpty
params:
* some: any

returns boolean

example
```typescript
utils.isNotEmpty(0); //true
utils.isNotEmpty(''); //true
utils.isNotEmpty(null); //false
utils.isNotEmpty(undefined); //false
```

### isString
params:
* some: any

returns boolean

example
```typescript
utils.isString(0); //false
utils.isString(''); //true
utils.isString(new String('')); //true
```

### isNumber
params:
* some: any

returns boolean

example
```typescript
utils.isNumber(0); //true
utils.isNumber(new Number(0)); //true
utils.isNumber(''); //false
```

### isArray
params:
* some: any

returns boolean

example
```typescript
utils.isArray(0); //false
utils.isArray([]); //true
utils.isArray({}); //false
```

### isNull
params:
* some: any

returns boolean

example
```typescript
utils.isArray(0); //false
utils.isArray(null); //true
utils.isArray(undefined); //false
```

### isUndefined
params:
* some: any

returns boolean

example
```typescript
utils.isUndefined(0); //false
utils.isUndefined(undefined); //true
utils.isUndefined(null); //false
```

### isNaN
params:
* some: any

returns boolean

example
```typescript
utils.isNaN(0); //false
utils.isNaN(NaN); //true
utils.isNaN(null); //false
utils.isNaN(undefined); //false
```

### isFunction
params:
* some: any

returns boolean

example
```typescript
utils.isFunction(0); //false
utils.isFunction(''.trim); //true
utils.isFunction(null); //false
utils.isFunction(undefined); //false
```

### numToLength
params:
* num: number
* len: number

returns string

example
```typescript
utils.numToLength(1, 2); //'01'
utils.numToLength(1, 3); //'001'
utils.numToLength(110, 3); //'110'
```

### round
params:
* num: number
* len?: number (default = 2)

returns string

example
```typescript
utils.round(1.12213); //1.12
utils.round(1.1239, 3); //1.124
```

### splitRange
params:
* num: number
* options?: {nbsp?: boolean; separator?: string}

returns string

example
```typescript
utils.splitRange(1000); //'1 000'
utils.splitRange(1000.22); //'1 000.22'
utils.splitRange(1000.22, {separator: ','}); //'1 000,22'
```

### each
params:
* someObject: Object,
* callback: (value?: any, key?: string) => any //Iterator

returns void

example
```typescript
let names = [];
utils.each({a: 1, b: 2}, (value: number, key: string) => {
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
utils.some({a: 1, b: 2}, (value: number, key: string) => {
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
let filter = utils.filters.not((some: any) => some === 5 ? false : some);

filter(1) //false
filter(4) //false
filter(0) //true
filter('') //true
filter(5) //true
```
