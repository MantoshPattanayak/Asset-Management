// let moment = require('moment');

// // console.log(moment().diff(moment().add(3, 'days'), 'days'));

// console.log(moment('22/07/22', 'DD/MM/YY').format('MM/DD/YYYY'));

// generating current date 

// console.log('generating current date : ' + moment());

//date formate 

// console.log('Format YYYY - ' + moment().format('YYYY'));
// console.log('Format YY - ' + moment().format('YY'));
// console.log('Format MMMM - ' + moment().format('MMMM'));
// console.log('Format MMM - ' + moment().format('MMM'));
// console.log('Format MM (Zero padded) - ' + moment().format('MM'));
// console.log('Format M (non zero padding) - ' + moment().format('M'));
// console.log('Format DD (zero padding) - ' + moment().format('DD'));
// console.log('Format D (non zero padding)- ' + moment().format('D'));
// console.log('Format Do - ' + moment().format('Do'));
// console.log('Format MMMM Do YYYY, h:mm:ss a (no zero padding for hour) - ' + moment().format('MMMM Do YYYY, h:mm:ss a'));
// console.log('Format MMMM Do YYYY, h:mm:ss a (zero padding for hour) - ' + moment().format('MMMM Do YYYY, hh:mm:ss a'));
// console.log('Format YYYY [text] YYYY - ' + moment().format('YYYY [text] YYYY'));
// console.log('Format dddd (returns name of the day) - ' + moment().format('dddd'));
// console.log('Format DDDD (returns the day number out of 365 in that year) - ' + moment().format('DDDD'));
// console.log('Format dd (returns the day number in the current week ) - ' + (moment().format('d')));
// console.log('Format dd (returns the first two letters of the days name) - ' + (moment().format('dd')));
// console.log('Format dd (returns the first three letters of the days name) - ' + (moment().format('ddd')));
// console.log(moment().format('m'));
// console.log(moment().format('mm'));
// -------------------------------------------------------------------------------------------------------------------------------------------------------
// Era
// console.log('Format ( N ) returns AD or BC : ' + moment().format('N'));
// console.log('Format ( NN ) returns AD or BC : ' + moment().format('NN'));
// console.log('Format ( NNN ) returns AD or BC : ' + moment().format('NNN'));
// console.log(`Format ( N , NN ) returns AD or BC twice consecutively separated by a ',' : `  +moment().format('N,NN'));
// console.log(`Format ( N, NN, NNN ) returns AD or BC thrice consecutively separated by a ',' : ` + moment().format('N,NN,NNN'));
// // // Era year
// console.log(`Format ( y ) returns the current era which coincidentally matches the current year as well : ` + moment().format('y'));
// console.log(`Format ( y , y ) returns the current era which coincidentally matches the current year as well twice consecutively separated by a ',' : ` + moment().format('y,y'));
// console.log(`Format ( y , y , y ) returns the current era which coincidentally matches the current year as well thrice consecutively separated by a ',' : ` + moment().format('y,y,y'));
// // // Week Year
// console.log('Format ( gg ) returns the last 2 digits of the current year : ' + moment().format('gg'));
// console.log('Format ( gggg ) returns the entire current year (4 digits) : ' + moment().format('gggg'));
// // console.log(moment().week());
// // // Week Year (ISO)
// console.log('Format ( GG ) returns the last 2 digits of the current year : ' + moment().format('GG'));
// console.log('Format ( GGGG ) returns the entire current year (4 digits) : ' + moment().format('GGGG'));
// // // Year
// console.log('Format ( Y ) returns the full current year ' + moment().format('Y'));
// console.log('Format ( YY ) returns the last two digits of the current year : ' + moment().format('YY'));
// console.log('Format( YYY ) is not a real format but a composition of Y and YY format, hence it returns the last 2 digits of the current year and then the current year in full : ' + moment().format('YYY'));
// console.log('Format ( YYYY ) returns the full current year : ' + moment().format('YYYY'));
// console.log('Format ( YYYYY ) is not a real format , it ignores the first ( Y ) and replaces its positon with 0 and then considers the next 4 ( YYYY ) and returns the full current year : ' + moment().format('YYYYY'));
// console.log('Format ( YYYYYY ) returns Expanded year format and covers a range of 273,790 years on either side of 01 January, 1970 : ' + moment().format('YYYYYY'));
// // // Quarter
// console.log(' Format ( Q ) returns the value of the on going quarter in the current year : ' + moment().format('Q'));
// console.log('Format ( Qo ) returns the value of the on going quarter in the current year : ' + moment().format('Qo'));
// // // Month
// console.log('Format ( M ) returns the value of the current month out of 12 : ' + moment().format('M'));
// console.log('Format ( Mo ) returns the value of the current month out of 12 : ' + moment().format('Mo'));
// console.log('Format ( MM ) returns the value of the current month with zero padding : ' + moment().format('MM'));
// console.log('Format ( MMM ) returns the first three letters of the current month : ' + moment().format('MMM'));
// console.log('Format ( MMMM ) returns the full name of the current month : ' + moment().format('MMMM'));
// // // Week
// // // Week of the year
// console.log('Format ( w ) returns the current week value out of 53 weeks per year : ' + moment().format('w'));
// console.log('Format ( wo ) returns the current week value out of 53 weeks per year : ' + moment().format('wo'));
// console.log('Format ( ww ) returns the current week value out of 53 weeks per year :' + moment().format('ww'));
// // // Week of the year (ISO)
// console.log('Format ( W ) returns the week value within the current year as per ISO standards : ' + moment().format('W'));
// console.log('Format ( W ) returns the week value within the current year as per ISO standards : ' + moment().format('Wo'));
// console.log('Format ( W ) returns the week value within the current year as per ISO standards : ' + moment().format('WW'));
// // // Day
// // // Day of the week
// console.log('Format (d) returns the value of day of the week : ' + moment().format('d'));
// console.log('Format (d) returns the value of day of the week : ' + moment().format('do'));
// console.log('Format (dd) returns the first two letters of the name of the current day : ' + moment().format('dd'));
// console.log('Format (ddd) returns the first three letters of the name of the current day : ' + moment().format('ddd'));
// console.log('Format (dddd) returns the full name of the current day : ' + moment().format('dddd'));
// // // Day of the month
// console.log('Format ( D ) returns the day number of the current day in the current month : ' + moment().format('D'));
// console.log('Format ( D ) returns the day number of the current day in the current month : ' + moment().format('Do'));
// console.log(moment().format('DD'));
// // Day of the year
// console.log(moment().format('DDD'));
// console.log(moment().format('DDDo'));
// console.log(moment().format('DDDD'));
// // Day of the week (Locale)
// console.log(moment().format('e'));
// // Day of the week (ISO)
// console.log(moment().format('E'));
// //  AM/PM
// console.log(moment().format('a'));
// console.log(moment().format('A'));
// console.log(moment().format('AA'));
// console.log(moment().format('aA'));
// console.log(moment().format('Aa'));
// console.log(moment().format('A,a'));
// // Hour
// console.log(moment().format('H'));
// console.log(moment().format('HH'));
// console.log(moment().format('h'));
// console.log(moment().format('hh'));
// console.log(moment().format('k'));
// console.log(moment().format('kk'));
// // Minute
// console.log(moment().format('m'));
// console.log(moment().format('mm'));
// // Second
// console.log(moment().format('s'));
// console.log(moment().format('ss'));
// // Fractional second
// console.log(moment().format('S'));
// console.log(moment().format('SS'));
// console.log(moment().format('SSS'));
// // Time zone
// console.log(moment().format('z'));
// console.log(moment().format('zz'));
// console.log(moment().format('Z'));
// console.log(moment().format('ZZ'));
// // Unix timestamp
// console.log(moment().format('X'));
// // Unix millisecond timestamp
// console.log(moment().format('x'));


// let express = require('express');
// let cors = require('cors');
// let moment = require('moment');

// let app = express();

// app.use(express.urlencoded({extended : false}));
// app.use(
//     cors({
//         origin : '*',
//         methods : ['GET', 'POST', 'PUT', 'DELETE'],
//         allowHEaders : ['Content-Type']
//     })
// );
// app.listen(3000);

// app.post('/dateTest', (req, res)=>{
//     let date = req.body.date;
//     let testDate = '1/8/2022';
//     console.log('Received Date : ' + date);
//     console.log('Formatted Date : ' + moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'));
// })

// console.log(moment().add(2, 'days').format('DD/MM/YYYY'));
// console.log(moment().format('DD/MM/YYYY'));
// console.log(moment().add(2, 'days').diff(moment(), 'days'));




const express = require('express');
const cors = require('cors');
const nodeMailer = require('nodemailer');
const mssql = require('mssql');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const e = require('express');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended:false}));
app.use(
    cors({
        origin : '*',
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        allowHeaders : ['Content-Type']
    })
);
const sqlConfig = {
    server : '10.0.2.19',
    user : 'SA',
    password : 'Soulsvciot01',
    database : 'asset',
    options : {
        encrypt : false,
        trustServerCertificate : false
    }
}

const transporter = nodeMailer.createTransport({
    host : 'smtp.mail.yahoo.com',
    port : 465,
    service : 'yahoo',
    secure : false,
    auth : {
        user : 'assetsoul@yahoo.com',
        pass : 'tjyfimogvchahdja'
    },
    debug : false,
    logger : false
});

mssql.connect(sqlConfig, (err, result)=>{
    if(err) throw err
    else{
        console.log('Connected to DB');
    }
})


app.listen(port, ()=>{
    console.log('listening to port : ' + port);
}).on('error', (err)=>{
    console.log('Error occurred : ' + err.messsage);
})

app.post('/assetSearch', (req, res)=>{
    let department = 'COMMON ELECTRONICS ENGG';

    let arr = JSON.parse(req.body.dataArr);

    let employeeFieldValue = arr[0];
    let assetFieldValue = arr[1];
    let startDateFieldValue = arr[2];
    let endDateFieldValue = arr[3];
    let locationFieldValue = arr[4];

    // console.log(arr);

    // console.log(employeeFieldValue);
    // console.log(assetFieldValue);
    // console.log(startDateFieldValue);
    // console.log(endDateFieldValue);
    // console.log(locationFieldValue);

    let employeeFieldValueLength = employeeFieldValue.length;
    let assetFieldValueLength = assetFieldValue.length;
    let startDateFieldValueLength = startDateFieldValue.length;
    let endDateFieldValueLength = endDateFieldValue.length;
    let locationFieldValueLength = locationFieldValue.length;
    
    let employeeFieldState = isNaN(employeeFieldValue);
    let assetFieldValueState = isNaN(assetFieldValue);
    let locationFieldValueState = isNaN(locationFieldValue);

    let query;

    if(employeeFieldValueLength != 0 && employeeFieldState == false && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength == 0){
        // return records of all the assets owned by an employee using employee ID
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.emp_no = '${employeeFieldValue}'`;
    }
    else if(employeeFieldValueLength != 0 && employeeFieldState == true && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength == 0 ){
        // return records of all the assets owned by an employee(s) using employee name
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND Users.user_name = '${employeeFieldValue}'`;
    }
    else if(employeeFieldValueLength != 0 && employeeFieldState == false && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false){
        // return records of all the assets owned by an employee that are present at a location using location ID , employee ID
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_id = '${locationFieldValue}' AND assets.asset_no = '${employeeFieldValue}'`;

    }
    else if(employeeFieldValueLength != 0 && employeeFieldState == true && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false){
        // return records of all the assets owned by an employee(s) that are present at a location using location ID, employee name
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_id = '${locationFieldValue}' AND Users.user_name = '${employeeFieldValue}'`;

    }
    else if(employeeFieldValueLength != 0 && employeeFieldState == false && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength == 0 && locationFieldValueState == true){
        // return records of all the assets owned by an employee that are present at a location using location name, employee ID
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_name = '${locationFieldValue}' AND Users.user_name = '${employeeFieldValue}'`;

    }
    else if(employeeFieldValueLength != 0 && employeeFieldState == true && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == true){
        // return records of all the assets owned by an employee that are present at a location using location name, employee name
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_name = '${locationFieldValue}' AND Users.user_name = '${employeeFieldValue}'`;

    }
    else if(employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == false && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false){
        // return records of all the assets present at a location using asset ID and location ID
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_id = '${assetFieldValue}' AND location.location_id = '${locationFieldValue}'`;

    }
    else if(employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == false && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == true){
        // return records of all the assets present at a location using asset ID and location name
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_id = '${assetFieldValue}' AND location.location_name = '${locationFieldValue}'`;

    }
    else if(employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == true && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false){
        // return records of all the assets present at a location using asset name and locatio ID
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.aset_name = '${assetFieldValue}' AND location.location_id = '${locationFieldValue}'`;

    }
    else  if(employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == true && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == true){
        // return records of all the assets present at a location using asset name and location name
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_name = '${assetFieldValue}' AND location.location_name = '${locationFieldValue}'`;

    }
    else if(employeeFieldValueLength == 0  && assetFieldValueLength != 0 && assetFieldValueState == false && startDateFieldValueLength != 0 && endDateFieldValueLength != 0 && locationFieldValueLength == 0){
        // return records of all the movements made by an asset within a time period using asset ID , start date and end date
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id INNER JOIN History ON Users.user_id = History.emp_id WHERE department.dept_name = '${department}' AND assets.asset_id = '${assetFieldValue}' AND  SUBSTRING(History.movement_time, 1, 10) BETWEEN '${startDateFieldValue}' AND '${endDateFieldValue}'`;

    }
    else if(employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == true && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength == 0 && locationFieldValueState == false){
            // return records of all the movements made by asset(s) within a time period using asset name , start date and end date
            query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id INNER JOIN History ON Users.user_id = History.emp_id WHERE department.dept_name = '${department}' AND assets.asset_name = '${assetFieldValue}' AND  SUBSTRING(History.movement_time, 1, 10) BETWEEN '${startDateFieldValue}' AND '${endDateFieldValue}'`;
    }
    else if(employeeFieldValueLength == 0 && assetFieldValueLength == 0 && startDateFieldValueLength != 0 && endDateFieldValueLength != 0 && locationFieldValueLength == 0){
        // return records of all the movements made by asset(s) within a time period using start date and end date
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id INNER JOIN History ON Users.user_id = History.emp_id WHERE department.dept_name = '${department}' AND  SUBSTRING(History.movement_time, 1, 10) BETWEEN '${startDateFieldValue}' AND '${endDateFieldValue}'`;
    }
    else{
        query = 'else';
        console.log('else');
    }

    console.log(query);
    console.log('----------------------------------------------------------------------------------------------------------------------------------');

    queryResult = mssql.query(query, (err, result)=>{
        if(err){
            console.log(`Error in /assetSearch query : '${query}'`);
        }
        else{
            res.send(result.recordset);
        }
    })
})