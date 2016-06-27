# eslint-plugin-custom-curly

custom curly rule

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-custom-curly`:

```
$ npm install eslint-plugin-custom-curly --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-custom-curly` globally.

## Usage

Add `custom-curly` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "custom-curly"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "custom-curly/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





