# xml2csv
[![Tymly Package](https://img.shields.io/badge/tymly-package-blue.svg)](https://tymly.io/)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/xml2csv.svg)](https://www.npmjs.com/package/@wmfs/xml2csv)
[![CircleCI](https://circleci.com/gh/wmfs/xml2csv.svg?style=svg)](https://circleci.com/gh/wmfs/xml2csv)
[![codecov](https://codecov.io/gh/wmfs/xml2csv/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/xml2csv)
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/xml2csv/badge)](https://www.codefactor.io/repository/github/wmfs/xml2csv)
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly/blob/master/packages/pg-concat/LICENSE)

> Takes an XML file and transforms it into a CSV file, based on format of the map you provide with options. 

## <a name="install"></a>Install
```bash
$ npm install xml2csv --save
```


## <a name="usage"></a>Usage

```javascript
const xml2csv = require('xml2csv')

xml2csv(
  {
    xmlPath: 'path/to/file.xml',
    csvPath: 'path/to/file.csv',
    rootXMLElement: 'Record',
    headerMap: [
      ['Name', 'name', 'string'],
      ['Age', 'age', 'integer'],
      ['Gender', 'gender', 'string'],
      ['Brother', 'brother', 'string', 'Siblings'],
      ['Sister', 'sister', 'string', 'Siblings']
    ]
  },
  function (err, info) {
    console.log(err, info)
    // Done!
  }
)

```
Input: 
```
<People>
    <Person>
        <Name>Maggie</Name>
        <Age>3</Age>
        <Gender>Female</Gender>
        <Siblings>
            <Brother>Bart</Brother>
            <Sister>Lisa</Sister>
        </Siblings>
    </Person>
    <Person>
        <Name>Marge</Name>
        <Age>45</Age>
        <Gender>Female</Gender>
    </Person>
</People>
```

Output:
```
name, age, gender, brother, sister
"Maggie",3,"Female","Bart","Lisa"
"Marge",45,"Female",,
```

## xml2csv(`options`, `callback`)

### Options

| Property              | Type      | Notes  |
| --------              | ----      | -----  |
| `xmlPath`             | `string`  | A path to the xml input file.
| `csvPath`             | `string`  | The path and filename of the generated CSV output file (note that any intermediate folders will be created).
| `rootXMLElement`      | `string`  | The XML root tag for each record, element to split records on in XML file.
| `headerMap`           | `[array]` | See the [Header Map](#headerMap) section for more details.

### <a name="headerMap"></a>options.headerMap

options.headerMap needs to be in the structure of:

```
[
    [xmlTag, csvHeader, type, parent],
    [xmlTag, csvHeader, type, parent],
    ...
]
```
* xmlTag and csvHeader must be the related fields
* type must be integer, date or string
* parent is optional, must be the parent tag in format of the XML tag


## <a name="test"></a>Testing


```bash
$ npm test
```


## <a name="license"></a>License
[MIT](https://github.com/wmfs/tymly/xml2csv/blob/master/LICENSE)
