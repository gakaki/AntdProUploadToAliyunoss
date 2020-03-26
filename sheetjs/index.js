var XLSX = require('xlsx');
const path =  `${__dirname}/dirfiles/李佳市医保患者个人及用药信息收集表最新151.xlsx`
var workbook = XLSX.readFile(path);

var first_sheet_name = workbook.SheetNames[3];
var address_of_cell = 'Z2';

var worksheet = workbook.Sheets[first_sheet_name];
const json = XLSX.utils.sheet_to_json(worksheet)
const lastColumn = Object.keys(json[0]).splice(-1)
const pics_names = [...new Set([...json.map( r => r[lastColumn] )])]
console.log(pics_names.length,pics_names)


// npm install --save fs-extra

var fs = require('fs-extra');

const file_original_name = './dirfiles/1.png'
for(let fn of pics_names){
    fs.copySync(file_original_name, './dirfiles/' + fn);
}
