const express = require('express');
const cors = require('cors');
const nodeMailer = require('nodemailer');
const mssql = require('mssql');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');


const app = express();
const port = 3000;

// app.use(express.urlencoded({extended:false}));
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowHeaders: ['Content-Type']
    })
);
const sqlConfig = {
    server: '10.0.2.18',
    user: 'SA',
    password: 'Soulsvciot01',
    database: 'asset',
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
};



const transporter = nodeMailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: false,
    auth: {
        user: 'assetsoul@yahoo.com',
        pass: 'tjyfimogvchahdja'
    },
    debug: false,
    logger: false
});

mssql.connect(sqlConfig, (err, result) => {
    if (err) throw err
    else {
        console.log('Connected to DB');
    }
})


app.listen(port, () => {
    console.log('listening to port : ' + port);
}).on('error', (err) => {
    console.log('Error occurred : ' + err.messsage);
})

// Landing page 

app.post('/login', (req, res) => {
    let userEmail = req.body.userEmail.toLowerCase();
    let userPass = req.body.userPass;

    let query1 = `SELECT password FROM Users WHERE email = '${userEmail}'`;
    let query2 = `SELECT dept_work, user_type, user_name, user_id FROM Employees INNER JOIN Users ON Employees.emp_no = Users.user_id WHERE Users.email = '${userEmail}'`;
    let query3 = `INSERT INTO Session(users, start_time, session_status)values('${userEmail}', '${moment().format('hh:mm:ss')}', open)`;

    let queryResult1 = mssql.query(query1, (err1, result1) => {
        if (err1) throw err1
        else {
            let hash = Object.values(result1.recordset[0])[0];
            console.log(hash);
            let cryptResult = bcrypt.compare(userPass, hash, function (err, result) {
                if (err) throw err
                else if (result) {
                    // password matched
                    let queryResult2 = mssql.query(query2, (err2, result2) => {
                        if (err2) throw err2
                        else {
                            let dept = Object.values(result2.recordset[0])[0];
                            let privilege = Object.values(result2.recordset[0])[1];
                            let userName = Object.values(result2.recordset[0])[2];
                            let userID = Object.values(result2.recordset[0])[3];
                            if (privilege == 'user') {
                                res.send(['2', userName, userID, dept]);
                            }
                            else if (privilege = 'Admin') {
                                res.send(['1', userName, userID, dept]);
                            }
                        }
                    })
                }
                else {
                    // password didnt match
                    res.send(['0']);
                }

            })
        }
    })
})


// Single Asset registration - Here a single user can do the registration without the consent of the Admin!
// but in the case of the multiuser the admin have to provide the consent to do the registration so that the registration can be done in both employee and user table simultaneously.
app.get('/d', (req, res) => {
    let query = `select distinct  dept_name from asset.dbo.department`;
    let query2 = `select distinct Parent_org from asset.dbo.department`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err;
        else {
            let queryResult2 = mssql.query(query2, (err, result2) => {
                console.log(result2.recordset)
                // res.sendFile('index.html', { root: __dirname+ "/public" })
                console.log(result.recordset);
                // const { Parent_org,dept_name } = result.recordset[0]
                // // console.log(Parent_org);
                // res.json({message:Parent_org,
                // answer:dept_name})
                res.json({
                    message: result.recordset,
                    answer: result2.recordset
                })

            })
        }
    })


})



app.post('/done', (req, res) => {
    const { fname, mname, lname, email, password, parental, empid } = req.body
    console.log(fname)
    console.log(lname)
    console.log(mname)
    console.log(email)
    console.log(empid)
    const user = 'user';
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        console.log(hash)

        // const username=fname+mname+lname
        // console.log(username)

        let query = `            
        SELECT em.official_email, em.personal_email, emp_no, first_name, 
        middle_name,
          last_name
   FROM asset.dbo.Employees e
   INNER JOIN asset.dbo.Employee_master em ON e.emp_no = em.emp_id
   WHERE e.emp_no = '${empid}' 
         AND e.first_name = '${fname}' 
         AND e.last_name = '${lname}' 
         AND (em.official_email = '${email}' OR em.personal_email = '${email}')
           AND (middle_name = '${mname}' OR middle_name = '' OR middle_name IS NULL)
        `;


        let query1 = `Insert into asset.dbo.Users (first_name,middle_name,last_name,user_id,user_name,email,password,user_type,Parent_org) 
       VALUES ('${fname}','${mname}','${lname}','${empid}','${email}','${email}','${hash}','${user}','${parental}')`;


        let query2 = `select user_id from asset.dbo.Users where user_id='${empid}' or user_name='${email}'`;




        mssql.query(query, (err, result) => {
            console.log(result)
            if (result.recordset == "") {

                res.send({
                    code: "Employee_Doesn't_exist",
                    response: "Employee doesn't exist"
                });

            }
            else if (result.recordset[0].emp_no == empid) {

                console.log(result)
                mssql.query(query2, (err, result2) => {
                    if (err) throw err;
                    if (result2.recordset.length != 0) {
                        res.send({
                            code: "user_already_exist",
                            response: "User already Exist"
                        })
                    }
                    else {


                        mssql.query(query1, (error, result1) => {

                            if (error) throw error

                            else {
                                console.log('Insertion has been done successfully')
                                res.send({
                                    code: 'Registration_done_Successfully',
                                    response: "Registration done Successfully"
                                })

                            }

                        })

                    }

                })

            }
        });

    })
})

//Mantosh Work starts here


/////Edit overview page:::___
app.post('/editAssets', (req, res) => {

    console.log('1')
    const { asset_name, asset_type, asset_id, location_name } = req.body
    console.log(req.body.asset_name)
    console.log(req.body.asset_type)
    console.log(req.body.location_name)
    let query1 = `select asset_desc from asset.dbo.asset_class where asset_desc='${asset_type}'`
    let query2 = `select location_name from asset.dbo.location where location_name='${location_name}'`
    mssql.query(query1, (err, result1) => {
        if (err) throw err;
        mssql.query(query2, (err, result2) => {
            if (err) throw err;
            if (result1.recordset.length != 0) {
                if (result2.recordset.length != 0) {
                    let query = `
            UPDATE a
            SET a.asset_name = '${asset_name}'
            FROM asset.dbo.assets a WHERE a.asset_id = '${asset_id}'
            
            
            
            UPDATE a
            SET a.asset_type = '${asset_type}'
            FROM asset.dbo.assets a
            WHERE a.asset_id = '${asset_id}'
            
            
            UPDATE a
            SET a.location_id  = (select location_id from location where location_name ='${location_name}')
            FROM asset.dbo.assets a
            INNER JOIN asset.dbo.location l ON l.location_id = a.location_id
            WHERE a.asset_id = '${asset_id}'`
                    // let query = `update

                    // asset.dbo.assets a

                    // inner join  asset.dbo.department d on a.dept_id =d.dept_id

                    // inner join asset.dbo.Employees e on e.dept_work = d.dept_name

                    // inner join asset.dbo.location l on l.location_id =d.location_id

                    // set  a.asset_type='${asset_type}',a.asset_name='${asset_name}',l.location_name='${location_name}' where a.asset_id='${asset_id}',d.dept_name='${dept_name}',e.emp_name='${emp_name}',e.emp_no='${emp_no}'`;

                    let queryResult = mssql.query(query, (err, result) => {

                        if (err) {

                            console.log('Error in update asset query');
                        }

                        else {


                            console.log(result);

                            // console.log(result.recordset[0].asset_id)

                            // res.send(result.recordset);  
                            res.send({
                                code: 'Updation_done_Successfully',
                                response: "Updation done Successfully"
                            })
                        }
                    })
                }
                else {
                    res.send({
                        code: 'Invalid location_name',
                        response: "Invalid location_name"
                    })

                }
            }
            else {

                res.send({
                    code: 'Invalid asset_type',
                    response: "Invalid asset_type"
                })



            }

        })
    })
})


// Mantosh Work ends here
// Mantosh work starts here

//all assets for overview
app.post('/AllAssets', (req, res) => {
    let total_rows;
    let page_size = req.body.page_size;
    let answer;

    let page_number = req.body.page_number;
    let c = 1;

    let query1 = `SELECT COUNT(*) AS TotalRows
        FROM asset.dbo.assets a
        inner join department d on d.dept_id =a.dept_id
    
        inner join Employees e on e.emp_no = a.emp_no
        
        inner join location l on l.location_id =a.location_id `;

    let query = `       
        SELECT *
        FROM (
            SELECT
                a.asset_id,
                a.asset_type,
                a.asset_name,
                d.dept_name,
                CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name) AS emp_name,
                e.emp_no,
                l.location_name,
                ROW_NUMBER() OVER (ORDER BY a.asset_id) AS RowNum
            FROM
                asset.dbo.assets a
                inner join department d on d.dept_id =a.dept_id
    
                inner join Employees e on e.emp_no = a.emp_no
    
                inner join location l on l.location_id =a.location_id 
    
        ) AS SubQuery
        WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
        AND RowNum <= @total_rows;
    
        SELECT @total_rows AS TotalRows
    `;

    let request1 = new mssql.Request();

    request1.query(query1, (err, result1) => {
        if (err) {
            console.log('Error in total rows of assets query:', err);
            res.sendStatus(500);
            return;
        }

        total_rows = result1.recordset[0].TotalRows;
        console.log('Total Rows:', total_rows);

        let request2 = new mssql.Request();
        request2.input('total_rows', mssql.Int, total_rows);
        request2.input('page_size', mssql.Int, page_size);
        request2.input('page_number', mssql.Int, page_number);
        request2.input('c', mssql.Int, c);

        request2.query(query, (err, result) => {
            if (err) {
                console.log('Error in All assets query:', err);
                res.sendStatus(500);
                return;
            }

            const data = result.recordset;
            // const totalPages = Math.ceil(total_rows / page_size)
            const allPages = { total_rows }
            answer = {
                answer: data,
                allPages: allPages
            };
            res.send({ answer: answer });
        });
    });
});


// Mantosh work ends here
// app.get('/assetSort', (req, res) => {

//         let query = `SELECT top(5) asset_id, asset_type,asset_name,dept_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = 'COMMON ELECTRONICS ENGG' AND asset_type = 'Machinery & Lab Equipments'`;
//         let query1 = `select distinct dept_name from dbo.department;`
//         let query2 = `select distinct asset_type from dbo.assets`

//         // if (criteria != null && crieria != ''){
//         //     query += "and"
//         // }

//         let queryResult = mssql.query(query, (err, result0) => {
//             if (err) {
//                 console.log('Error in /assetSort1 in query');
//             }
//             else {

//                 // console.log(result.recordset);
//                 // res.send(result.recordset);
//                 // console.log(dn);
//                 let queryResult1 = mssql.query(query1, (err, result1) => {
//                     if (err) {
//                         console.log('Error in /assetSort2 in query');
//                     }
//                     else {

//                         // console.log(result.recordset);
//                         // res.send(result.recordset);
//                         // console.log(dn);
//                         let queryResult2 = mssql.query(query2, (err, result2) => {
//                             if (err) {
//                                 console.log('Error in /assetSort3 in query');
//                             }
//                             else {

//                                 // console.log(result.recordset);
//                                 // res.send(result.recordset);
//                                 // console.log(dn);

//                                 let val0 = Object.values(result0.recordset);
//                                 let val1 = Object.values(result1.recordset);
//                                 let val2 = Object.values(result2.recordset);
//                                 res.send(val0, val1, val2)
//                                 console.log(val0)
//                                 console.log(val1)
//                                 console.log(val2)
//                             }
//                         })

//                     }
//                 })
//             }
//         })

//     })   

////Mantosh Kumar
app.get('/editfetch', (req, res) => {

    let message, answer;
    let query = `select asset_desc from asset.dbo.asset_class`

    let query2 = `select location_name from asset.dbo.location`

    mssql.query(query, (err, result) => {

        if (err) throw err





        answer = {

            asset_type: result.recordset,


        }
    })
    mssql.query(query2, (err, result2) => {


        if (err) throw err

        message = {

            location_name: result2.recordset
        }

        res.send({ message: message, answer: answer });




    })

})








//satyam vivek works
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });


//multiple asset reg
app.post('/assetupload', upload.single('uploadFile'), function (req, res) {
    const filePath = req.file.path;
    let results = [];

    try {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', function (row) {
                results.push(row);

            })
            .on('end', function () {
                let responseStr = '';
                let taguuid = /^SA\/[a-z]{3}\/[a-z]\d\/\d{4}$/;
                let deptid = /^(?:[1-35-9]|1[0-8])$/;
                let empno = /^\d{6}$/;

                if (results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].asset_price == '' && results[i].asset_id == '' && results[i].emp_no
                            == '' && results[i].tag_uuid
                            == '' && results[i].asset_type
                            == '' && results[i].asset_name
                            == '' && results[i].dept_id
                            == '') {
                            responseStr += 'file is empty or remove the empty row';
                        }
                        else {

                            if (!taguuid.test(results[i].tag_uuid)) {
                                console.log('INVALID::::' + results[i].tag_uuid);
                                responseStr += `MATCH THE FORMAT tag_uuid(SA/abc/a1/0000) :::: ${results[i].tag_uuid} at row no ${i + 1}\n`;
                            }
                            if (!deptid.test(results[i].dept_id)) {
                                console.log('INVALID::::' + results[i].dept_id);
                                responseStr += `MATCH THE FORMAT dept_id(between 1 to 18) :::: ${results[i].dept_id} at row no ${i + 1} \n`;
                            }

                            if (!empno.test(results[i].emp_no)) {
                                console.log('INVALID::::' + results[i].emp_no);
                                responseStr += `MATCH THE FORMAT emp_no(6digit) :::: ${results[i].emp_no} at row no ${i + 1}\n`;
                            }
                            // if ((results[i].asset_type != 'Medical Equipments' && results[i].asset_type != 'Land & Land Developments' && results[i].asset_type != 'Buildings' && results[i].asset_type != 'Furniture, Fixture & Office Equipments' && results[i].asset_type != 'Motor Vehicles' && results[i].asset_type != 'Crockery and Utensils' && results[i].asset_type != 'Books and Library' && results[i].asset_type != 'Electrical, Electronics Equipments' && results[i].asset_type != 'Machinery & Lab Equipments' && results[i].asset_type != 'Photo Copier' && results[i].asset_type != 'Audio & Visual Equipment' && results[i].asset_type != 'Telephone & EPABX' && results[i].asset_type != 'Transformer & Generator' && results[i].asset_type != 'Laptop' && results[i].asset_type != 'Computer Related' && results[i].asset_type != 'Computer Software' && results[i].asset_type != 'Air Conditioner' && results[i].asset_type != 'Solar Power Systems' && results[i].asset_type != 'Solar Water Heating System' && results[i].asset_type != 'Sculpture Garden' && results[i].asset_type != 'Central Medical Gas' && results[i].asset_type != 'Electrical, Electronics Equipments for R&D' && results[i].asset_type != 'Machinery & Lab Equipments for R&D' && results[i].asset_type != 'Furniture, Fixture & Office Equipments for R&D' && results[i].asset_type != 'Surveylliance Equipment' && results[i].asset_type != 'Sports & Musical Equipment' && results[i].asset_type != 'Computer Related for R&D' && results[i].asset_type != 'Smart Class Room' && results[i].asset_type != 'Asset Under Construction')) {
                            //     console.log('INVALID::::' + results[i].asset_type);
                            //     responseStr += `MATCH THE FORMAT asset_type :::: ${results[i].asset_type} at row no ${i + 1}\n`;
                            // }

                        }
                    }
                }
                else {
                    responseStr += 'file is empty';
                }
                if (responseStr)
                    res.send((responseStr));
                else {
                    res.send('file uploaded succesfully');
                    // console.log(results);
                    for (let i = 0; i < results.length; i++) {
                        insertDataToAsDatabase1(results[i]);
                        insertDataToAsDatabase2(results[i]);
                        console.log('data inserted in db');
                    }
                }

            })
    } catch (err) {
        res.status(400).json(err);
    }

});



function insertDataToAsDatabase1(Asdata1) {

    console.log(Asdata1);
    mssql.query(`INSERT INTO assets (asset_price,asset_id,emp_no,tag_uuid,asset_type,asset_name,dept_id) VALUES ( '${Asdata1.asset_price}','${Asdata1.asset_id
        }','${Asdata1.emp_no
        }','${Asdata1.tag_uuid}','${Asdata1.asset_type}', '${Asdata1.asset_name}','${Asdata1.dept_id}')`, function (err) {
            if (err) {
                console.error('Error inserting data into the database1: ', err);
            }
        });
}

function insertDataToAsDatabase2(Asdata2) {
    let tagt = 'RFID';

    mssql.query(`INSERT INTO tags (tag_type,tag_uuid) VALUES ( '${tagt}','${Asdata2.tag_uuid}')`, function (err) {
        if (err) {
            console.error('Error inserting data into the database1: ', err);
        }
    });
}



var newstr = '';
var count = 0;
//multiple user upload(csv files)
app.post('/userupload', upload.single('uploadFile'), function (req, res) {
    const filePath = req.file.path;
    let results = [];

    try {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', function (row) {
                results.push(row);

            })

            .on('end', function () {
                console.log(results);
                let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let phonePattern = /^[1-9]\d{9}$/;
                let useridPattern = /^\d{6}$/;
                let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;

                let responseStr = '';
                if (results.length > 0) {//this is not working
                    for (let i = 0; i < results.length; i++) {
                        //if condition for reading 1st row of csv file
                        if (results[i].email == '' && results[i].user_id == '' && results[i].first_name
                            == '' && results[i].middle_name
                            == '' && results[i].last_name
                            == '' && results[i].password
                            == '' && results[i].user_type
                            == '' && results[i].Parent_org
                            == ''
                        ) {
                            responseStr += 'file is empty or remove the empty row';
                        }
                        else {

                            if (!emailPattern.test(results[i].email)) {
                                console.log('INVALID::::' + results[i].email);
                                responseStr += `MATCH THE FORMAT OF email(abc@gmail.com) :::: ${results[i].email} at row no ${i + 1}\n`;
                            }


                            // if (!phonePattern.test(results[i].contact_no)) {
                            //     console.log('INVALID::::' + results[i].contact_no);
                            //     responseStr += `MATCH THE FORMAT OF contact_no(10 digit):::: ${results[i].contact_no} at row no ${i + 1} \n`;
                            // }

                            if (!passwordPattern.test(results[i].password)) {
                                console.log('INVALID::::' + results[i].password);
                                responseStr += `MATCH THE FORMAT OF password(Use a mix of alphabetical and numeric, a mixture of upper and lowercase, and special characters):::: ${results[i].password} at row no ${i + 1}\n`;
                            }



                            if (results[i].user_type != 'Admin' && results[i].user_type != 'user') {
                                console.log('INVALID::::' + results[i].user_type);
                                responseStr += `MATCH THE FORMAT OF user_type(Admin or user) :::: ${results[i].user_type} at row no ${i + 1}\n`;
                            }

                            if (!useridPattern.test(results[i].user_id)) {
                                console.log('INVALID::::' + results[i].user_id);
                                responseStr += `MATCH THE FORMAT OF user_id(6 digit) :::: ${results[i].user_id} at row no ${i + 1}\n`;
                            }
                            if (results[i].first_name == '' || results[i].last_name == '') {
                                console.log('INVALID::::' + results[i].first_name);
                                console.log('INVALID::::' + results[i].last_name);
                                responseStr += `first name :::: ${results[i].first_name} and lastname :::: ${results[i].last_name} are mandatory at row no ${i + 1} \n`;

                            }
                            if (results[i].Parent_org != 'KIIT') {
                                console.log('INVALID::::' + results[i].Parent_org);
                                responseStr += `MATCH THE FORMAT(KIIT)  OF parent_org:::: ${results[i].Parent_org} at row no ${i + 1} \n`;
                            }
                            // if ((results[i].dept_work != 'ICT CELL KIIT CORE' && results[i].dept_work != 'COMMON ELECTRONICS ENGG' && results[i].dept_work != 'MECHANICAL' && results[i].dept_work != 'BIOTECH' && results[i].dept_work != 'CIVIL' && results[i].dept_work != 'APPLIED SCIENCE' && results[i].dept_work != 'AUDITORIUM' && results[i].dept_work != 'FINANCIAL AND HUMAN SCIENCE' && results[i].dept_work != 'SCHOOL OF HUMANITIES' && results[i].dept_work != 'COMPUTER SCIENCE-1' && results[i].dept_work != 'COMPUTER SCIENCE-2' && results[i].dept_work != 'ELECTRICAL' && results[i].dept_work != 'KIIT SCHOOL OF RURAL MANAGEMENT' && results[i].dept_work != 'ANNEX BUILDING' && results[i].dept_work != 'LAW' && results[i].dept_work != 'KIIT SCHOOL OF ACTIVITY CENTER' && results[i].dept_work != 'KIIT SCHOOL OF MANAGEMENT')) {

                            //     console.log('INVALID::::' + results[i].dept_work);
                            //     responseStr += `MATCH THE FORMAT OF dept_work:::: ${results[i].dept_work} at row no ${i + 1} \n`;

                            // }

                        }
                    }
                }
                else {
                    responseStr += 'file is empty';
                }
                //response 
                if (responseStr)
                    res.send((responseStr));
                else {

                    for (let i = 0; i < results.length; i++) {
                        insertDataToDatabase1(results[i], function (dbvalue) {
                            // console.log(dbvalue);   
                            // newstr.push( `${dbvalue} at row ${i + 1} \n`); 
                            newstr += `${dbvalue} at row ${i + 1} \n`
                            console.log('outerloop data===', newstr);
                            console.log('outervalue----------------', results.length, i);
                            count++;
                            console.log(`count value outer: ${count}`)
                            if (count === results.length) {
                                console.log('innervalue--------------', results.length, i);
                                console.log(`count value inner: ${count}`)
                                // res.send(newstr)
                                sendResponse();
                                console.log('inner loop data===', newstr)
                            }
                            // console.log(newstr); 

                        });

                    }
                    function sendResponse() {
                        res.send(newstr);
                    }



                }
            })


    } catch (err) {
        res.status(400).json(err);
    }

});



function insertDataToDatabase1(data1, callback) {
    mssql.query(`SELECT em.official_email, em.personal_email, emp_no, first_name, 
    middle_name,
    last_name
    FROM asset.dbo.Employees e
    INNER JOIN asset.dbo.Employee_master em ON e.emp_no = em.emp_id
    WHERE e.emp_no = '${data1.user_id}' 
    AND e.first_name = '${data1.first_name}' 
    AND e.last_name = '${data1.last_name}' 
    AND (em.official_email = '${data1.email}' OR em.personal_email = '${data1.email}')
    AND (middle_name = '${data1.middle_name}' OR middle_name = '' OR middle_name IS NULL)`, function (err, result) {
        console.log(result);
        if (err) {
            console.log('Error ', err);
            callback(null);
            return;
        }

        //  for(let i=0;i<result.recordset.length;i++) {
        if (result.recordset.length == 0) {
            console.log('Employee does not exist');
            var dbvalue = 'Employee does not exist';
            callback(dbvalue);
        }

        else if (result.recordset.length != 0) {
            console.log('1')
            mssql.query(`select user_id from asset.dbo.Users where user_id='${data1.user_id}' or user_name='${data1.email}'`, function (err, result1) {
                if (err) {
                    console.error('Error: ', err);
                    callback(null);
                    return;
                }
                if (result1.recordset.length != 0) {
                    console.log('2');
                    console.log('user alredy exist');
                    callback('user alredy exist');
                }
                else {
                    console.log('3')
                    mssql.query(`INSERT INTO Users (first_name,middle_name,last_name,user_id,user_name,email,password,user_type,Parent_org) VALUES ('${data1.first_name}','${data1.middle_name}','${data1.last_name}','${data1.user_id}', '${data1.email}', '${data1.email}','${data1.password}','${data1.user_type}','${data1.Parent_org}')`, function (err) {
                        if (err) {
                            console.error('Error inserting data into the database1: ', err);
                            callback(null);
                            return;
                        }
                    });
                    console.log('data inserted successfully in db');
                    callback('Data inserted successfully');
                }
            });
            // }
        }

    });
}



//advance serach for auditoverview
app.post('/advanceSearchForAudit',(req,res) =>{
    //requestQueries
    let Location_id=req.query.Location_id;
    let DepartmentId=req.query.DepartmentId;
    let emp_no=req.query.emp_no;

    //databse query
    let query=`select * from AuditDetails where 1=1 `;
   
    //checking conditions for multiple column data search(advance serching)
      if(Location_id !=null){
       query+=`and Location_id =${Location_id}`;
      }

    //additional field
      if(DepartmentId !=null){
        query+=` and DepartmentId =${DepartmentId}`;
      }

    //additional field
      if(emp_no !=null){
        query+=` and emp_no=${emp_no}`
      }  
    
    //query result
      sql.query(query,(err,result) =>{
        if (err) throw err;
         res.send(result);
      })
    
})




//satyam vivek work end  

// Mantosh work

///single Asset Reg    
app.get('/fetchdname', (req, res) => {
    let query = `select dept_name from asset.dbo.department order by 1`;
    let query1 = `select distinct asset_desc from asset.dbo.asset_class a order by 1`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err;
        else {
            // res.sendFile('index.html', { root: __dirname+ "/public" })
            let queryResult1 = mssql.query(query1, (err, result1) => {
                if (err) throw err;
                const message = {

                    dept_name: result.recordset

                }
                console.log(message)
                const answer = {
                    asset_type: result1.recordset
                }
                res.send({ message: message, answer: answer });
                console.log(answer)
            })
        }

    })

})

app.get('/ddata', (req, res) => {
    const dn = req.query.dn;
    console.log('dn value in fetch api: ' + dn)
    let query = `select dept_id from asset.dbo.department where dept_name='${dn}' `
    let queryResult = mssql.query(query, (err, result) => {

        if (err) throw err
        if (result.recordset != "") {
            const message = {
                dn: dn,
                dept_id: result.recordset[0].dept_id,

            }
            res.send({ message: message });
            console.log(message)
        }
        else {
            res.json({ message: 'No existing department!!!' })
        }
    })

})
// Mantosh work ends here

app.get('/assetclass', (req, res) => {
    let at = req.query.at;
    console.log(`"${at}"`)
    console.log('assetype value in fetch api: ' + at)
    let query = `select asset_class from asset.dbo.asset_class  where asset_desc='${at}'`
    let queryResult = mssql.query(query, (err, result) => {

        if (err) throw err
        if (result.recordset != "") {
            const message = {
                at: at,
                asset_class: result.recordset[0].asset_class,

            }
            res.send({ message: message });
            console.log(message)
        }

        else {
            res.json({ message: 'No existing asset_class' })
        }
    })

})


// Mantosh work here  

app.post('/assetreg', (req, res) => {
    const { assetd, assetn, assett, assetp, deptid, empid, taguid, assetc } = req.body
    console.log(req.body)
    let tag_t = "RFID";

    let query = `select tag_uuid from asset.dbo.tags where  tag_uuid='${taguid}'`;

    let query1 = `select * from asset.dbo.assets where tag_uuid='${taguid}'`

    let query2 = `insert into asset.dbo.assets(asset_id,asset_type,asset_price,asset_name,dept_id,emp_no,tag_uuid,asset_class)
    Values('${assetd}','${assett}','${assetp}','${assetn}','${deptid}','${empid}','${taguid}')`


    let query3 = `insert into  asset.dbo.tags (tag_type,tag_uuid) Values('${tag_t}','${taguid}','${assetc}')`

    let query4 = `insert  
    into  asset.dbo.tags (tag_type,tag_uuid) Values('${tag_t}','${taguid}')`


    let query5 = `insert into asset.dbo.assets(asset_id,asset_type,asset_price,asset_name,dept_id,emp_no,tag_uuid,asset_class)
    Values('${assetd}','${assett}','${assetp}','${assetn}','${deptid}','${empid}','${taguid}','${assetc}')`




    let queryResult = mssql.query(query, (err, result) => {
        console.log(result)

        if (result.recordset == "") {

            let queryResult1 = mssql.query(query1, (err, result1) => {


                if (result1.recordset == "") {

                    let queryResult4 = mssql.query(query4, (err, result4) => {

                        if (err) throw err;

                        else {

                            let queryResult5 = mssql.query(query5, (err, result5) => {

                                if (err) throw err;

                                console.log('Insertion has been done to tags and assets');
                                res.send({
                                    code: 'Insertion has been done to tags and assets',
                                    response: 'Registration has been done to tags and assets'
                                })
                            })
                        }

                    })

                }

                else {
                    let queryResult3 = mssql.query(query3, (err, result3) => {

                        if (err) throw err;

                        else {

                            console.log('Insertion has been done to tags');
                            res.send({
                                code: 'Insertion has been done to tags',
                                response: 'Registration has been done to tags'
                            });

                        }


                    })

                }

            })

        }
        else {
            let queryResult1 = mssql.query(query1, (err, result1) => {


                if (result1.recordset == "") {

                    let queryResult2 = mssql.query(query2, (err, result2) => {

                        if (err) throw err;

                        else {
                            console.log('Insertion has been done to assets');
                            res.send({ response: 'Registration has been done to assets' });
                        }
                    })
                }
                else {
                    console.log('This asset_id with the tag_id is already present')
                    res.send({ response: 'This asset_id with the tag_id is already present' });
                }
            }
            )
        }
    })
})


///Adavance seach drop-down alok
app.get('/fetch', (req, res) => {
    let query = `select distinct dept_name from asset.dbo.department`;
    let query1 = `select distinct asset_type from asset.dbo.assets a where asset_type is not null order by 1`
    let query2 = `select location_name from asset.dbo.location`
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err;
        else {
            // res.sendFile('index.html', { root: __dirname+ "/public" })
            let queryResult1 = mssql.query(query1, (err, result1) => {
                if (err) throw err;

                else {

                    let queryResult2 = mssql.query(query2, (err, result2) => {
                        if (err) throw err;

                        const message = {

                            dept_name: result.recordset

                        }
                        const answer = {


                            asset_type: result1.recordset
                        }


                        const answer2 = {
                            location_name: result2.recordset
                        }

                        res.send({ message: message, answer: answer, answer2: answer2 });

                        console.log(message)

                        console.log(answer)
                    })
                }


            })
        }

    })

})

//Mantosh works end here


app.post('/reqAccess', (req, res) => {

    // 1 - code for success
    // 0 - code for failure

    let appName = req.body.appName.replace(/\s+/g, " ").trim().toLowerCase();
    let appID = req.body.appID.toLowerCase();
    let appEmail = req.body.appEmail.toLowerCase();
    let appContact = req.body.appContact.toLowerCase();

    let firstName = appName.split(" ")[0];
    let lastName = appName.split(" ")[1];
    let uName = appName.replace(/\s+/g, " ").trim();
    // console.log(firstName.length);
    // console.log(lastName.length);

    let adminMail = '1804407@kiit.ac.in';
    let adminMailSubject = 'Access Request';
    let adminMailMsg = `Access request recived from ${appName} with ID : ${appID}. If needed, kindly contact the applicant at ${appContact} or at ${appEmail}`;

    let receiverMail = 'sayantansnt@gmail.com';
    let receiverMailSubject = 'Received request for access';
    let receiverMailMsg = `Request received. Our team will review your request and send a follow up mail`;

    let query = `SELECT * FROM Access_request WHERE applicant_id = '${appID}' AND Request_status = 'Pending'`;
    let query0 = `SELECT * FROM Employees INNER JOIN Users ON Employees.emp_no = Users.user_id WHERE emp_no = '${appID}' AND first_name = '${firstName}' AND last_name = '${lastName}' AND email = '${appEmail}'`;
    let query1 = `SELECT * FROM Users WHERE user_id = '${appID}' AND user_name = '${uName}' AND user_type = 'Admin'`;
    let query2 = `SELECT * FROM Users WHERE email = '${appEmail}'`;
    let query3 = `INSERT INTO Access_request(applicant_name, applicant_id, email, date, contact)values('${uName}','${appID}','${appEmail}','${moment().format('YYYY-MM-DD')}','${appContact}')`;

    // console.log(query);
    // console.log(query0);
    // console.log(query1);
    // console.log(query2);
    // console.log(query3);

    // console.log(query1);
    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) throw err0
        else if (result0.recordset.length == 1) {
            let queryResult = mssql.query(query, (err, result) => {
                if (err) throw err
                else if (result.recordset.length == 0) {
                    // requestor is a valid employee
                    let queryResult1 = mssql.query(query1, (err1, result1) => {
                        if (err1) throw err1
                        else if (result1.recordset.length == 0) {
                            // console.log(result1.recordset);
                            let queryResult3 = mssql.query(query3, (err3, result3) => {
                                if (err3) throw err3
                                else {
                                    //  record inserted into the access request table
                                    // let adminMailResponse = sendEmail(adminMail,adminMailSubject, adminMailMsg);
                                    // let receiverMailResponse = sendEmail(receiverMail, receiverMailSubject, receiverMailMsg);
                                    res.send(['1', 'Kindly check your mail']);
                                }
                            })
                        }
                        else {
                            // query1 else. Requestor is an existing user
                            res.send(['0', 'User exists']);
                        }
                    });
                }
                else {
                    // query0 else. Not a valid employee
                    res.send(['0', 'previous request havent been resolved']);
                }
            });
        }
        else {
            // unresolved request exists
            res.send(['0', 'Kindly check your credentials']);
        }
    })
})
app.post('/contactUs', (req, res) => {
    // console.log('entered route');
    let visitorName = req.body.visitorName;
    let visitorID = req.body.visitorID;
    let visitorMsg = req.body.visitorMsg;

    let firstName = visitorName.split(" ")[0];
    let lastName = visitorName.split(" ")[1];


    let adminMail = '1804407@kiit.ac.in';
    let adminMailSubject = 'Contact us mail';

    let query0 = `SELECT * FROM Employees WHERE emp_no = '${visitorID}' AND first_name = '${firstName}' AND last_name = '${lastName}'`;

    console.log(query0);
    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) {
            // console.log('error 0 in /contactUs');
        }
        if (result0.recordset.length > 0) {
            // let mailResponse = sendEmail(adminMail, adminMailSubject, visitorMsg);
            // console.log(mailResponse);
            if (mailResponse == 1) {
                res.send('1');
            }
            else {
                res.send('0');
            }
        }
        else {
            // visitor not allowed to send a mail
            // console.log('employee not found');
            res.send('0');
        }
    })
});


// Dashboard page

app.post('/dashboardCards', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';;
    let department = req.body.department;
    let arr = [];
    /*Dashboard query 0 - COUNT all the assets owned by a department*/
    let query0 = `SELECT COUNT(*) FROM assets INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}'`;

    /*Dashboard query 1 - COUNT all the assets owned by a department that are being moved*/
    let query1 = `SELECT COUNT(*) FROM assets INNER JOIN Activity ON assets.tag_id = Activity.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}'`;

    /* Count all the available assest by subtracting query2 result from query1 */

    /*Dashboard query 2 - all the tags assigned to a department*/
    let query2 = `SELECT COUNT(*) FROM tags INNER JOIN department ON tags.dept_id = department.dept_id WHERE department.dept_name = '${department}'`;

    /*Dashboard query 3 - all the tags assigned to a department thats attached to an asset*/
    let query3 = `SELECT COUNT(*) FROM tags INNER JOIN assets on tags.tag_id = assets.tag_id INNER JOIN department ON tags.dept_id = department.dept_id WHERE department.dept_name = '${department}'`;

    /*Count all the  tags assigned to a department but not assigned to an asset by subtracting query 3 result from query 2*/

    /*Dashboard query 4 - COUNT all the readers assigned to a department*/
    let query4 = `SELECT COUNT(*) FROM reader INNER JOIN department ON reader.dept_id = department.dept_id WHERE department.dept_name = '${department}'`;

    /*Dashboard query 5 - COUNT all the readers assigned to a department that are connected*/
    let query5 = `SELECT COUNT(*) FROM reader INNER JOIN department ON reader.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND reader_status = 'Connected'`;

    /*Dashboard query 6 - COUNT all the readers assigned to a department that are disconnected*/
    let query6 = `SELECT COUNT(*) FROM reader INNER JOIN department ON reader.dept_id = department.dept_id WHERE department.dept_name = '${department}' and reader_status = 'Disconnected'`;

    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) {
            console.log('Error in /dashboardCard query0');
            // throw err0;
        }
        else {
            let val0 = Object.values(result0.recordset[0])[0];
            let queryResult1 = mssql.query(query1, (err1, result1) => {
                if (err1) {
                    console.log('Error in /dashboardCard query1');
                }
                else {
                    let val1 = Object.values(result1.recordset[0])[0];
                    let queryResult2 = mssql.query(query2, (err2, result2) => {
                        if (err2) {
                            console.log('Error in /dashboardCard query2');
                        }
                        else {
                            let val2 = Object.values(result2.recordset[0])[0];
                            let queryResult3 = mssql.query(query3, (err3, result3) => {
                                if (err3) {
                                    console.log('Error in /dashboardCard query3');
                                }
                                else {
                                    let val3 = Object.values(result3.recordset[0])[0];
                                    let queryResult4 = mssql.query(query4, (err4, result4) => {
                                        if (err4) {
                                            console.log('Error in /dashboardCard query4');
                                            throw err4;
                                        }
                                        else {
                                            let val4 = Object.values(result4.recordset[0])[0];
                                            let queryResult5 = mssql.query(query5, (err5, result5) => {
                                                if (err5) {
                                                    console.log('Error in /dashboardCard query5');
                                                }
                                                else {
                                                    let val5 = Object.values(result5.recordset[0])[0];
                                                    let queryResult6 = mssql.query(query6, (err6, result6) => {
                                                        if (err6) {
                                                            console.log('Error in /dashboardCard query6');
                                                        }
                                                        else {
                                                            let val6 = Object.values(result6.recordset[0])[0];
                                                            arr.push(val0, val0 - val1, val1, val2, val2 - val3, val3, val4, val5, val6);
                                                            res.send(arr);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
app.post('/movementChartData', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';;
    let department = req.body.department;
    let dataArr = [];
    let labelArr = [];
    let totalArr = [];
    let count = 0;

    for (let i = 0; i < 7; i++) {
        labelArr.push(moment().subtract(i, 'days').format('ddd'));
        let query = `SELECT count(*) AS '${i}' FROM History INNER JOIN Employees ON Employees.emp_no = History.emp_id INNER JOIN department ON Employees.dept_work = department.dept_name WHERE dept_work = '${department}' AND SUBSTRING(movement_time, 1, 10) = '${moment().subtract(i, 'days').format('DD/MM/YYYY')}'`;
        let queryResult = mssql.query(query, (err, result) => {
            if (err) {
                console.log('Error in /movementChartData query');
            }
            else {
                let index = parseInt(Object.keys(result.recordset[0]));
                let value = parseInt(Object.values(result.recordset[0]));
                dataArr[index] = value;
                if (count == 6) {
                    totalArr.push(labelArr, dataArr);
                    res.send(totalArr);
                }
                else {
                    count++;
                }
            }
        })
    }
})
app.post('/movementChartSearch', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    console.log('Start Date : ' + startDate);
    console.log('End date : ' + endDate);
    let dateCount = moment(startDate).diff(moment(endDate), 'days');
    console.log('date count : ' + dateCount);
    let labelArr = [];
    let dataArr = [];
    let totalArr = [];
    let count = 0;
    for (let i = 0; i <= dateCount; i++) {
        let query = `SELECT COUNT(*) AS '${i}' FROM History INNER JOIN Employees ON Employees.emp_no = History.emp_id INNER JOIN department ON Employees.dept_work = department.dept_name WHERE dept_work = '${department}' AND SUBSTRING(movement_time, 1, 10) = '${moment(startDate).subtract(i, 'days').format('DD/MM/YYYY')}'`;
        console.log('---------------------------------------');
        console.log(query);
        console.log('---------------------------------------');
        labelArr.push(moment(startDate).subtract(i, 'days').format('ddd'));
        let queryResult = mssql.query(query, (err, result) => {
            if (err) {
                console.log('Error in /movementChartSearch query');
            }
            else {
                let index = parseInt(Object.keys(result.recordset[0]));
                let value = parseInt(Object.values(result.recordset[0]));
                dataArr[index] = value;
                if (count == dateCount) {
                    totalArr.push(labelArr, dataArr);
                    res.send(totalArr);
                }
                else {
                    count++;
                }
            }
        })
    }
})
app.post('/alertsChartData', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';;
    let department = req.body.department;
    let dataArr = [];
    let labelArr = [];
    let totalArr = [];
    let count = 0;

    for (let i = 0; i < 7; i++) {
        let query = `SELECT COUNT(*) AS '${i}' FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND date = '${moment().subtract(i, 'days').format('DD/MM/YYYY')}'`;
        let day = moment().subtract(i, 'days').format('D/MM');
        labelArr.push(day);

        let queryResult = mssql.query(query, (err, result) => {
            if (err) {
                console.log('Error in /alertsChartData query');
            }
            else {
                let index = parseInt(Object.keys(result.recordset[0]));
                let value = parseInt(Object.values(result.recordset[0]));
                dataArr[index] = value;
                if (count == 6) {
                    totalArr.push(labelArr, dataArr);
                    res.send(totalArr);
                }
                else {
                    count++;
                }
            }
        })
    }
})
app.post('/alertChartSearch', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';;
    let department = req.body.department;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let dateCount = moment(startDate).diff(moment(endDate), 'days');
    let labelArr = [];
    let dataArr = [];
    let totalArr = [];
    let count = 0;

    for (let i = 0; i <= dateCount; i++) {
        let query = `SELECT COUNT(*) AS '${i}' FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date = '${moment().subtract(i, 'days').format('YYYY-MM-DD')}'`;

        labelArr.push(moment(startDate).subtract(i, 'days').format('D/MM'));

        let queryResult = mssql.query(query, (err, result) => {
            if (err) {
                console.log('Error in /alertsChartSearch query');
            }
            else {
                let index = parseInt(Object.keys(result.recordset[0]));
                let value = parseInt(Object.values(result.recordset[0]));
                dataArr[index] = value;
                if (count == dateCount) {
                    totalArr.push(labelArr, dataArr);
                    res.send(totalArr);
                }
                else {
                    count++;
                }
            }
        })
    }
})
app.post('/latestAssetRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;

    let query = `SELECT TOP(20)
                Movement_request.serial,
                Movement_request.asset_id,
                assets.asset_name,
                Movement_request.starting_point,
                Movement_request.destination,
                Movement_request.time,
                Movement_request.date,
                Movement_request.requester_name,
                Movement_request.requester_id,
                Movement_request.Request_status
                FROM Movement_request INNER JOIN assets ON assets.asset_id = Movement_request.asset_id
                INNER JOIN department ON assets.dept_id = department.dept_id
                WHERE dept_name = '${department}'`;

    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /latestAssetRequests query');
        }
        else {
            res.send(result.recordset);
        }
    })
})
app.post('/assetsPerDept', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT dept_name , count(*) as Total FROM assets INNER JOIN department ON assets.dept_id = department.dept_id group by dept_name`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /assetsPerDept');
        }
        else {
            let deptName = [];
            let assetQuantity = [];
            let arr = [];
            for (x in result.recordset) {
                deptName.push(Object.values(result.recordset[x])[0]);
                assetQuantity.push(Object.values(result.recordset[x])[1]);
            }
            arr.push(deptName, assetQuantity);
            // console.log(arr);
            res.send(arr);
        }
    })
})
app.post('/systemStatistics', (req, res) => {
    let specName = [];
    let specValue = [];
    let performance = [];
    let query = `SELECT TOP 1 * FROM Performance`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /systemStatistics query');
        }
        else {
            specName = Object.keys(result.recordset[0]);
            specValue = Object.values(result.recordset[0]);
            performance.push(specName, specValue);
            res.send(performance);
        }
    });
})



// Alerts page

app.post('/setAlertCards', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let arr = [];
    let query0 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}'`;
    let query1 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date = '${moment().format('YYYY-MM-DD')}'`;
    let query2 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date BETWEEN '${moment().format('YYYY-MM-DD')}' AND '${moment().subtract(7, 'days').format('YYYY-MM-DD')}'`;
    let query3 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date BETWEEN '${moment().format('YYYY-MM-DD')}' AND '${moment().subtract(1, 'month').format('YYYY-MM-DD')}'`;
    // console.log(query2);
    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) {
            console.log('Error in /alertCards query0');
        }
        else {
            // console.log('result : ' + result0.recordset);
            let val0 = Object.values(result0.recordset[0])[0];
            // console.log('val 0  : ' + val0);
            let queryResult1 = mssql.query(query1, (err1, result1) => {
                if (err1) {
                    console.log('Error in /alertCards query1');
                }
                else {
                    let val1 = Object.values(result1.recordset[0])[0];
                    let queryResult2 = mssql.query(query2, (err2, result2) => {
                        if (err2) {
                            console.log('Error in /alertCards query2');
                        }
                        else {
                            let val2 = Object.values(result2.recordset[0])[0];
                            let queryResult3 = mssql.query(query3, (err3, result3) => {
                                if (err3) {
                                    console.log('Error in /alertCards query3');
                                }
                                else {
                                    let val3 = Object.values(result3.recordset[0])[0];
                                    arr.push(val0, val1, val2, val3);
                                    // console.log(arr);
                                    res.send(arr);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
app.post('/allAlerts', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /allAlerts query');
        }
        else {
            res.send(result.recordset);
        }
    })
})
app.post('/alertsToday', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `  SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date = '${moment().format('YYYY-MM-DD')}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /alertsToday query');
        }
        else {
            res.send(result.recordset);
        }
    })
})
app.post('/alertsWeekly', (req, res) => {
    // let department ='COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `  SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date BETWEEN '${moment().subtract(7, 'days').format('YYYY-MM-DD')}' AND '${moment().format('YYYY-MM-DD')}'`;
    console.log(query);
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            // console.log('Error in /alertsWeekly query');
            throw err;
        }
        else {
            res.send(result.recordset);
        }
    })
})
app.post('/alertsMonthly', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date BETWEEN '${moment().subtract(1, 'month').format('YYYY-MM-DD')}' AND '${moment().format('YYYY-MM-DD')}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /alertsMonthly query');
        }
        else {
            res.send(result.recordset);
        }
    })
})
app.post('/alertSearch', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;

    let searchTerm = req.body.searchTerm;
    let tableIndex = req.body.tableIndex;
    let query;

    if (tableIndex == 1) {
        query = `SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND asset_id = '${searchTerm}'`;
    }
    else if (tableIndex == 2) {
        query = `  SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date = '${moment().format('YYYY-MM-DD')}' AND asset_id = '${searchTerm}'`;
    }
    else if (tableIndex == 3) {
        query = `SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date BETWEEN '${moment().format('YYYY-MM-DD')}' AND '${moment().subtract(7, 'days').format('YYYY-MM-DD')}' AND asset_id = '${searchTerm}'`;
    }
    else if (tableIndex == 4) {
        query = `SELECT asset_id, asset_name, reader.reader_id, location.location_name,Alert.date, Alert.time, Alert.alert_desc FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id INNER JOIN reader ON Alert.reader_id = reader.reader_id INNER JOIN location ON reader.location_id = location.location_id INNER JOIN Users ON emp_no = Users.user_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE department.dept_name = '${department}' AND date BETWEEN '${moment().format('YYYY-MM-DD')}' AND '${moment().subtract(1, 'month').format('YYYY-MM-DD')}' AND asset_id = '${searchTerm}'`;
    }
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /alertSearch query');
        }
        else {
            res.send(result.recordset);
        }
    })
})

//Requests page

app.post('/requestCards', (req, res) => {
    let arr = [];
    // let dept = 'COMMON ELECTRONICS ENGG';
    let dept = req.body.department;

    let query0 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}'`;
    let query1 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Pending'`;
    let query2 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Approved'`;
    let query3 = `SELECT COUNT(*) FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${dept}' AND Request_status = 'Denied';`
    let query4 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}'`;
    let query5 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Pending'`;
    let query6 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Approved'`;
    let query7 = `SELECT COUNT (*) FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${dept}' AND Request_status = 'Denied'`;

    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) throw err0
        else if (result0.recordset.length > 0) {
            arr.push(Object.values(result0.recordset[0])[0]);
            let queryResult1 = mssql.query(query1, (err1, result1) => {
                if (err1) throw err1
                else if (result1.recordset.length > 0) {
                    arr.push(Object.values(result1.recordset[0])[0]);
                    let queryResult2 = mssql.query(query2, (err2, result2) => {
                        if (err2) throw err2
                        else if (result2.recordset.length > 0) {
                            arr.push(Object.values(result2.recordset[0])[0]);
                            let queryResult3 = mssql.query(query3, (err3, result3) => {
                                if (err3) throw err3
                                else if (result3.recordset.length > 0) {
                                    arr.push(Object.values(result3.recordset[0])[0]);
                                    let queryResult4 = mssql.query(query4, (err4, result4) => {
                                        if (err4) throw err4
                                        else if (result4.recordset.length > 0) {
                                            arr.push(Object.values(result4.recordset[0])[0]);
                                            let queryResult5 = mssql.query(query5, (err5, result5) => {
                                                if (err5) throw err5
                                                else if (result5.recordset.length > 0) {
                                                    arr.push(Object.values(result5.recordset[0])[0]);
                                                    let queryResult6 = mssql.query(query6, (err6, result6) => {
                                                        if (err6) throw err6
                                                        else if (result6.recordset.length > 0) {
                                                            arr.push(Object.values(result6.recordset[0])[0]);
                                                            let queryResult7 = mssql.query(query7, (err7, result7) => {
                                                                if (err7) throw err7
                                                                else if (result7.recordset.length > 0) {
                                                                    arr.push(Object.values(result7.recordset[0])[0]);
                                                                    res.send(arr);
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
app.post('/allMovementRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;

    let query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/pendingMovementRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND Request_status = 'Pending'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/approvedMovementRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND Request_status = 'Approved'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/deniedMovementRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND Request_status = 'Denied'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/allAccessRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/pendingAccessRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}' AND Request_status = 'Pending'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/approvedAccessRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}' AND Request_status = 'Approved'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/deniedAccessRequests', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}' AND Request_status = 'Denied'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else if (result.recordset.length >= 0) {
            res.send(result.recordset);
        }
    })
})
app.post('/requestSearch', (req, res) => {
    let panelIndex = req.body.panelIndex;
    let cardIndex = req.body.cardIndex;
    let searchTerm = req.body.searchTerm;
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query;
    console.log('/requestSearch');
    if (panelIndex == 1) {
        console.log('Movement request');
        if (cardIndex == 1) {
            query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND Movement_request.asset_id = '${searchTerm}'`;
        }
        else if (cardIndex == 2) {
            query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND Request_status = 'Pending' AND Movement_request.asset_id = '${searchTerm}'`;
        }
        else if (cardIndex == 3) {
            query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND Request_status = 'Approved' AND Movement_request.asset_id = '${searchTerm}'`;
        }
        else if (cardIndex == 4) {
            query = `SELECT Movement_request.serial, Movement_Request.asset_id, assets.asset_name,  Movement_request.starting_point, Movement_request.destination, Movement_request.time, Movement_request.date, Movement_request.requester_id,  Movement_request.requester_name,  Movement_request.Request_status FROM Movement_request INNER JOIN assets ON Movement_request.asset_id = assets.asset_id INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${department}' AND Request_status = 'Denied' AND Movement_request.asset_id = '${searchTerm}'`;
        }
    }
    else if (panelIndex == 2) {
        console.log('accessRequest');
        if (cardIndex == 1) {
            query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}' AND Access_request.applicant_id = '${searchTerm}'`;
        }
        else if (cardIndex == 2) {
            query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}' AND Request_status = 'Pending' AND Asset_request.applicant_id = '${searchTerm}'`;
        }
        else if (cardIndex == 3) {
            query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}' AND Request_status = 'Approved' AND Asset_request.applicant_id = '${searchTerm}'`;
        }
        else if (cardIndex == 4) {
            query = `SELECT Access_request.serial,Access_request.applicant_name, Access_request.applicant_id, Access_request.email, Access_request.date, Access_request.contact, Access_request.Request_status FROM Access_request INNER JOIN Employees ON Access_request.applicant_id = Employees.emp_no INNER JOIN department ON Employees.dept_work = department.dept_name WHERE department.dept_name = '${department}' AND Request_status = 'Denied' AND Asset_request.applicant_id = '${searchTerm}'`;
        }
    }

    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /requestSearch query, ' + `Panel Index : ${panelIndex},` + `Card Index : ${cardIndex}`);
        }
        else {
            res.send(result.recordset);
        }
    })
})

app.post('/mApprovedRequest', (req, res) => {
    let id = req.body.reqID;
    let serial = req.body.reqSerial;
    let start = req.body.start;
    let dest = req.body.dest;
    let empID = req.body.empID;

    let query0 = `SELECT  (SELECT location_id FROM   location where location_name='${start}') AS start,(SELECT location_id FROM location where location_name='${dest}') AS dest`;
    let queryResult = mssql.query(query0, (err0, result0) => {
        if (err0) console.log('/mAppr err');
        else {
            // console.log(result0.recordset);
            let start_id = Object.values(result0.recordset[0])[0];
            let dest_id = Object.values(result0.recordset[0])[1];
            let query1 = `SELECT tag_id FROM assets WHERE asset_id = '${id}'`;
            let queryResult1 = mssql.query(query1, (err1, result1) => {
                if (err1) throw err1
                else {
                    let tagID = result1.recordset[0].tag_id;
                    let query2 = `INSERT INTO Activity (approve_date, approve_time, emp_id, starting_point, destination, tag_id, approve_status) values('${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}','${empID}', '${start_id}', '${dest_id}', '${tagID}', 'Approved' )`;
                    console.log(query2);
                    let queryResult1 = mssql.query(query2, (err2, result2) => {
                        if (err2) console.log(err2)
                        else {
                            let query3 = `UPDATE Movement_request SET Request_status='Approved' from Movement_request where asset_id='${id}' AND serial = '${serial}'`;
                            let queryResult2 = mssql.query(query3, (err3, result3) => {
                                if (err3) console.log(err3)
                                else {
                                    res.send(id.toString());
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
app.post('/mDeniedRequest', (req, res) => {
    let id = req.body.reqID;
    let serial = req.body.reqSerial;

    let q1 = `UPDATE Movement_request SET Request_status='Denied' from Movement_request where asset_id='${id}' AND serial = '${serial}'`;
    // console.log(q2);
    let queryResult1 = mssql.query(q1, (err1, result1) => {
        if (err1) console.log('failed deny query1')
        else {
            res.send('Denied');
        }
    })
})
app.post('/aApprovedRequest', (req, res) => {
    let id = req.body.reqID;
    let serial = req.body.reqSerial;
    let userName = req.body.userName;
    let email = req.body.email;
    let pass = `user`;

    let query0 = `UPDATE Access_request SET Request_status='Approved' where serial='${serial}' and applicant_id='${id}'`;
    let query1 = `UPDATE Users SET user_type = 'Admin' WHERE user_id = '${id}'`;

    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) {
            console.log('/appr err1');
        }
        else {
            let queryResult1 = mssql.query(query1, (err1, result1) => {
                if (err1) throw err1
                else {
                    res.send('success');
                }
            })
        }
    })
})
app.post('/aDeniedRequest', (req, res) => {
    let serial = req.body.reqSerial;
    let id = req.body.reqID;
    let query = `UPDATE Access_request SET Request_status='Denied' where serial='${serial}' and applicant_id='${id}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else {
            res.send('Denied');
        }
    })
})



app.post('/allAssets', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let department = req.body.department;
    let query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /allAssets query');
        }
        else {
            res.send(result.recordset);
        }
    })
})

app.post('/assetSearch', (req, res) => {
    let department = req.body.department;
    let searchTerm = req.body.searchTerm;

    let query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND asset_id = '${searchTerm}'`;

    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /assetSearch in query');
        }
        else {
            res.send(result.recordset);
        }
    })
})


app.post('/assetAdvancedSearch', (req, res) => {
    // let department = 'COMMON ELECTRONICS ENGG';
    let queryIndex = 0;

    let department = req.body.department;
    let arr = JSON.parse(req.body.dataArr);

    let employeeFieldValue = arr[0].trim();
    let assetFieldValue = arr[1].trim();
    let startDateFieldValue = arr[2].trim();
    let endDateFieldValue = arr[3].trim();
    let locationFieldValue = arr[4].trim();

    let employeeFieldValueLength = employeeFieldValue.length;
    let assetFieldValueLength = assetFieldValue.length;
    let startDateFieldValueLength = startDateFieldValue.length;
    let endDateFieldValueLength = endDateFieldValue.length;
    let locationFieldValueLength = locationFieldValue.length;

    let employeeFieldState = isNaN(employeeFieldValue);
    let assetFieldValueState = isNaN(assetFieldValue);
    let locationFieldValueState = isNaN(locationFieldValue);
    // console.log(employeeFieldValue);
    // console.log(employeeFieldState);
    // console.log('hey : ' + locationFieldValue);
    // console.log(locationFieldValueState);

    let query;

    if (employeeFieldValueLength != 0 && employeeFieldState == false && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength == 0) {
        // return records of all the assets owned by an employee using employee ID
        queryIndex = 1;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.emp_no = '${employeeFieldValue}'`;
    }
    else if (employeeFieldValueLength != 0 && employeeFieldState == true && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength == 0) {
        // return records of all the assets owned by an employee(s) using employee name
        queryIndex = 2;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND Users.user_name = '${employeeFieldValue}'`;
    }
    else if (employeeFieldValueLength != 0 && employeeFieldState == false && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false) {
        // return records of all the assets owned by an employee that are present at a location using location ID , employee ID
        queryIndex = 3;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_id = '${locationFieldValue}' AND Users.user_id = '${employeeFieldValue}'`;

    }
    else if (employeeFieldValueLength != 0 && employeeFieldState == true && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false) {
        // return records of all the assets owned by an employee(s) that are present at a location using location ID, employee name
        queryIndex = 4;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_id = '${locationFieldValue}' AND Users.user_name = '${employeeFieldValue}'`;

    }
    else if (employeeFieldValueLength != 0 && employeeFieldState == false && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == true) {
        // return records of all the assets owned by an employee that are present at a location using location name, employee ID
        queryIndex = 5;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_name = '${locationFieldValue}' AND Users.user_id = '${employeeFieldValue}'`;

    }
    else if (employeeFieldValueLength != 0 && employeeFieldState == true && assetFieldValueLength == 0 && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == true) {
        // return records of all the assets owned by an employee that are present at a location using location name, employee name
        queryIndex = 6;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND location.location_name = '${locationFieldValue}' AND Users.user_name = '${employeeFieldValue}'`;

    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == false && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false) {
        // return records of all the assets present at a location using asset ID and location ID
        queryIndex = 7;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_id = '${assetFieldValue}' AND location.location_id = '${locationFieldValue}'`;

    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == false && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == true) {
        // return records of all the assets present at a location using asset ID and location name
        queryIndex = 8;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_id = '${assetFieldValue}' AND location.location_name = '${locationFieldValue}'`;

    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == true && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == false) {
        // return records of all the assets present at a location using asset name and location ID
        queryIndex = 9;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_name = '${assetFieldValue}' AND location.location_id = '${locationFieldValue}'`;

    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == true && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength != 0 && locationFieldValueState == true) {
        // return records of all the assets present at a location using asset name and location name
        queryIndex = 10;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_name = '${assetFieldValue}' AND location.location_name = '${locationFieldValue}'`;

    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == false && startDateFieldValueLength != 0 && endDateFieldValueLength != 0 && locationFieldValueLength == 0) {
        // return records of all the movements made by an asset within a time period using asset ID , start date and end date 
        queryIndex = 11;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id INNER JOIN History ON Users.user_id = History.emp_id WHERE department.dept_name = '${department}' AND assets.asset_id = '${assetFieldValue}' AND  SUBSTRING(History.movement_time, 1, 10) BETWEEN '${moment(endDateFieldValue, 'YYYY-MM_DD').format('DD/MM/YYYY')}' AND '${moment(startDateFieldValue, 'YYYY-MM-DD').format('DD/MM/YYYY')}'`;

    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == true && startDateFieldValueLength != 0 && endDateFieldValueLength != 0 && locationFieldValueLength == 0 && locationFieldValueState == false) {
        // return records of all the movements made by asset(s) within a time period using asset name , start date and end date
        queryIndex = 12;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id INNER JOIN History ON Users.user_id = History.emp_id WHERE department.dept_name = '${department}' AND assets.asset_name = '${assetFieldValue}' AND  SUBSTRING(History.movement_time, 1, 10) BETWEEN '${moment(endDateFieldValue, 'YYYY-MM_DD').format('DD/MM/YYYY')}' AND '${moment(startDateFieldValue, 'YYYY-MM-DD').format('DD/MM/YYYY')}'`;
    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength == 0 && startDateFieldValueLength != 0 && endDateFieldValueLength != 0 && locationFieldValueLength == 0) {
        // return records of all the movements made by asset(s) within a time period using start date and end date
        queryIndex = 13;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id INNER JOIN History ON Users.user_id = History.emp_id WHERE department.dept_name = '${department}' AND  SUBSTRING(History.movement_time, 1, 10) BETWEEN '${moment(endDateFieldValue, 'YYYY-MM_DD').format('DD/MM/YYYY')}' AND '${moment(startDateFieldValue, 'YYYY-MM-DD').format('DD/MM/YYYY')}'`;
    }
    else if (employeeFieldValueLength == 0 && assetFieldValueLength != 0 && assetFieldValueState == false && startDateFieldValueLength == 0 && endDateFieldValueLength == 0 && locationFieldValueLength == 0) {
        // return records of all the assets having an asset ID
        queryIndex = 14;
        query = `SELECT asset_id, asset_name, emp_no, user_name, location.location_id, location_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id INNER JOIN Users ON assets.emp_no = Users.user_id INNER JOIN location ON location.location_id = assets.location_id WHERE department.dept_name = '${department}' AND assets.asset_id = '${assetFieldValue}'`;
    }
    else {
        query = 'else';
        console.log('else');
    }
    console.log('----------------------------------------------------------------------------------------------------------------------------------');
    console.log(`query : ${queryIndex}, ` + ' Query : ' + query);
    console.log('----------------------------------------------------------------------------------------------------------------------------------');

    queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log(`Error in /assetAdvancedSearch query : '${queryIndex}'`);

        }
        else {
            res.send(result.recordset);
        }
    })
})

// User dashboard


app.post('/setUserDashCards', (req, res) => {
    let userID = '1003';
    let arr = [];
    // get all the assets owned by the employee
    let query0 = `SELECT COUNT(*) FROM assets WHERE emp_no = '${userID}'`;
    // get all the assets owned by the employee that are being moved
    let query1 = `SELECT COUNT(*) FROM assets INNER JOIN Activity ON assets.emp_no = Activity.emp_id WHERE assets.emp_no = '${userID}'`;
    // get total number of requests that have been sent by the user 
    let query2 = `SELECT COUNT(*) FROM Movement_request WHERE requester_id = '${userID}'`;
    // get total number of requests sent by that user that have been approved
    let query3 = `SELECT COUNT(*) FROM Movement_request WHERE requester_id = '${userID}' AND Request_status = 'Approved'`;
    // get total number of requests sent by that user that have been denied
    let query4 = `SELECT COUNT(*) FROM Movement_request WHERE requester_id = '${userID}' AND Request_status = 'Denied'`;
    // get total number of requests sent by that user that have been pending
    let query5 = `SELECT COUNT(*) FROM Movement_request WHERE requester_id = '${userID}' AND Request_status = 'Pending'`;
    // total number of alerts that were recived by the system related to the assets owned by the user
    let query6 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id WHERE emp_no = '${userID}'`;
    // total number of alerts that were recived by the system today related to the assets owned by the user 
    let query7 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id WHERE emp_no = '${userID}' AND date = '${moment().format('YYYY-MM-DD')}'`;
    // total number of alerts that were recived by the system this week related to the assets owned by the user
    let query8 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id WHERE emp_no = '${userID}' AND date BETWEEN '${moment().format('YYYY-MM-DD')}' AND '${moment().subtract(7, 'days').format('YYYY-MM-DD')}'`;
    // total number of alerts that were recived by the system this month related to the assets owned by the user
    let query9 = `SELECT COUNT(*) FROM Alert INNER JOIN assets ON Alert.tag_id = assets.tag_id WHERE emp_no = '${userID}' AND date BETWEEN '${moment().format('YYYY-MM-DD')}' AND '${moment().subtract(1, 'month').format('YYYY-MM-DD')}'`;

    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) {
            // console.log('Error in /setUserDashCards query0');
            console.log('error : ' + err0);
        }
        else {
            let queryResult1 = mssql.query(query1, (err1, result1) => {
                if (err1) {
                    console.log('Error in /setUserDashCards query1');
                }
                else {
                    let queryResult2 = mssql.query(query2, (err2, result2) => {
                        if (err2) {
                            console.log('Error in /setUserDashCards query2');
                        }
                        else {
                            let queryResult3 = mssql.query(query3, (err3, result3) => {
                                if (err3) {
                                    console.log('Error in /setUserDashCards query3');
                                }
                                else {
                                    let queryResult4 = mssql.query(query4, (err4, result4) => {
                                        if (err4) {
                                            console.log('Error in /setUserDashCards query4');
                                        }
                                        else {
                                            let queryResult5 = mssql.query(query5, (err5, result5) => {
                                                if (err5) {
                                                    console.log('Error in /setUserDashCards query5');
                                                }
                                                else {
                                                    let queryResult6 = mssql.query(query6, (err6, result6) => {
                                                        if (err6) {
                                                            console.log('Error in /setUserDashCards query6');
                                                        }
                                                        else {
                                                            let queryResult7 = mssql.query(query7, (err7, result7) => {
                                                                if (err7) {
                                                                    console.log('Error in /setUserDashCards query7');
                                                                }
                                                                else {
                                                                    let queryResult8 = mssql.query(query8, (err8, result8) => {
                                                                        if (err8) {
                                                                            console.log('Error in /setUserDashCards query8');
                                                                        }
                                                                        else {
                                                                            let queryResult9 = mssql.query(query9, (err9, result9) => {
                                                                                if (err9) {
                                                                                    console.log('Error in /setUserDashCards query9');
                                                                                }
                                                                                else {
                                                                                    let val0 = Object.values(result0.recordset[0])[0];
                                                                                    let val1 = Object.values(result1.recordset[0])[0];
                                                                                    let val2 = Object.values(result2.recordset[0])[0];
                                                                                    let val3 = Object.values(result3.recordset[0])[0];
                                                                                    let val4 = Object.values(result4.recordset[0])[0];
                                                                                    let val5 = Object.values(result5.recordset[0])[0];
                                                                                    let val6 = Object.values(result6.recordset[0])[0];
                                                                                    let val7 = Object.values(result7.recordset[0])[0];
                                                                                    let val8 = Object.values(result8.recordset[0])[0];
                                                                                    let val9 = Object.values(result9.recordset[0])[0];
                                                                                    // console.log(val0);
                                                                                    arr.push(val0, val0 - val1, val1, val2, val3, val4, val5, val6, val7, val8, val9);
                                                                                    // console.log(arr);
                                                                                    res.send(arr);
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

})

app.post('/setAssetsTable', (req, res) => {
    let userID = req.body.userID;
    let query = `SELECT  asset_id , asset_name , location_name FROM Assets INNER JOIN location ON Assets.location_id = location.location_id WHERE emp_no = '${userID}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /setAssetsTable query');
            // throw err
        }
        else {
            res.send(result.recordset);
        }
    })
})

app.post('/setRequestsTable', (req, res) => {
    let userID = req.body.userID;
    let query = `SELECT serial, asset_id, asset_name, date, time, starting_point, destination, Request_status FROM Movement_request WHERE requester_id = '${userID}'`;

    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /searchRequestsTable query');
        }
        else {
            // console.log(result.recordset);
            res.send(result.recordset);
        }
    })
})

app.post('/searchUserRequestTable', (req, res) => {
    console.log(req.body);
    let userID = req.body.userID;
    let searchTerm = req.body.requestSearchTerm.trim();
    // console.log(searchTerm);
    let query = `SELECT serial, asset_id, asset_name, date, time, starting_point, destination, Request_status FROM Movement_request WHERE requester_id = '${userID}' AND asset_id = '${searchTerm}'`;
    // console.log(query);
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /searchUserRequestTable query');
        }
        else {
            res.send(result.recordset);
        }
    })

})
app.post('/searchUserAssetsTable', (req, res) => {
    console.log(1);
    let userID = req.body.userID;
    let searchTerm = req.body.assetSearchTerm;

    let query = `SELECT  asset_id , asset_name , location_name FROM Assets INNER JOIN location ON Assets.location_id = location.location_id WHERE emp_no = '${userID}' AND asset_id = '${searchTerm}'`;
    // console.log(query);
    let queryResult = mssql.query(query, (err, result) => {
        if (err) {
            console.log('Error in /searchUserAssetsTable query');
        }
        else {
            // console.log(result.recordset);
            res.send(result.recordset);
        }
    })
});


app.post('/userDetails', (req, res) => {
    let userID = req.body.userID;
    let query = `SELECT e.first_name, e.middle_name, e.last_name, e.dept_work, u.user_type, e.contact_no, u.email FROM Employees e INNER JOIN Users u ON e.emp_no = u.user_id WHERE user_id = '${userID}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else {
            res.send(Object.values(result.recordset[0]));
        }
    })
})

app.post('/resetPass', (req, res) => {
    userID = req.body.userID;
    newPass = req.body.newPassword;
    confPass = req.body.confPassword;

    let saltRounds = 10;
    let hash = bcrypt.hashSync(newPass, saltRounds);
    let query = `UPDATE Users SET password = '${hash}' WHERE user_id = '${userID}'`;

    if (newPass = confPass) {
        let queryResult = mssql.query(query, (err, result) => {
            if (err) throw err
            else {
                res.send('1');
            }
        })
    }
    else {
        res.send('2');
    }
})

app.post('/resetContact', (req, res) => {
    let userID = req.body.userID;
    let newContact = req.body.contact;
    let query = `UPDATE Employees SET contact_no = '${newContact}' WHERE emp_no = '${userID}'`;
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else {
            res.send('1');
        }
    })
})

app.post('/logout', (req, res) => {
    let userEmail = req.body.userEmail;
    let query0 = `UPDATE Session SET end_time = '${moment().format('hh:mm:ss')}' , session_status = 'closed' WHERE users = '${userEmail}' AND session_status = 'open'`;
    let queryResult0 = mssql.query(query0, (err0, result0) => {
        if (err0) {
            console.log('error in err0 in /logout');
            res.send('0');
        }
        else {
            res.send('1');
        }
    })
});

// Asset Request and related

//Asset Id suggust
app.post('/assetSuggest', (req, res) => {
    let assetID = req.body.value;
    let assetDept = req.body.dept;
    let query = `SELECT TOP(100) asset_id FROM assets INNER JOIN department ON department.dept_id = assets.dept_id WHERE asset_id LIKE '${assetID}%' AND dept_name = '${assetDept}'`;
    console.log(query);
    let queryResult = mssql.query(query, (err, result) => {
        if (err) throw err
        else {
            let resultVal = [];
            // console.log(result.recordset);
            for (let i = 0; i < result.recordset.length; i++) {
                //if(Object.values(result.recordset[i])[0] != '404'){
                let extVal1 = Object.values(result.recordset[i])[0];

                // console.log(extVal1);
                let ret = `${extVal1}`;
                resultVal.push(ret);
                //}
                // else {
                //     console.log("Invalid Id");
                //     break;
                // }
            }
            console.log(resultVal)
            // let num = ['584784', '565232', '892312'];
            // res.send(num)
            res.send(resultVal);
        }
    })
})

//AssetName fetch
app.post("/assetNameFetch", (req, res) => {
    let asset_id = Object.values(req.body)[0];
    // console.log(asset_id)
    let asset_name_value = [];
    let query = `SELECT asset_name FROM assets WHERE asset_id = '${asset_id}'`
    let queryresult = mssql.query(query, (err, result) => {
        if (err) throw err;
        else {
            for (let i = 0; i < result.recordset.length; i++) {
                let val = Object.values(result.recordset[i])[0];
                // console.log( result.recordset[i])
                // console.log(val)
                asset_name_value.push(val);
            }
            // console.log(asset_name_value)
            res.send(asset_name_value);
        }
    })
})


//Fetching locations for the dropdown
app.post("/location-fetch", (req, res) => {
    let query = `SELECT location_name FROM location`;
    let locate = [];
    let qres = mssql.query(query, (err, result) => {
        if (err) throw err;
        else {
            // console.log(result.recordset);
            for (let i = 0; i < result.recordset.length; i++) {
                let location = Object.values(result.recordset[i])[0];
                // console.log(location)
                locate.push(location);
            }
            // console.log(locate)
            res.send(locate);
        }
    })
})

app.post('/reqAsset', (req, res) => {

    // 1 - code for success
    // 0 - code for failure
    // console.log(req.body);
    let reqName = req.body.reqName.toLowerCase();
    let reqID = req.body.reqID.toLowerCase();
    let assetDept = req.body.assetDept;
    let assetID = req.body.assetID;
    // let assetName = JSON.parse(req.body.assetName);
    let assetName = req.body.assetName
    // let asset_name = req.body.assetName;
    let startingPoint = req.body.source.toLowerCase();
    let destination = req.body.destination.toLowerCase();


    let firstName = reqName.split(" ")[0];
    let lastName = reqName.split(" ")[1];

    let asset_name;
    let count = 0;
    let totalCount = assetName.length;
    let errorList = [];

    // console.log(totalCount)

    for (let i = 0; i < assetName.length; i++) {
        asset_name = assetName[i];
        // console.log(asset_name);

        // check if the requestor is a valid employee or not and retrieve their dept
        let query0 = `SELECT dept_work FROM Employees WHERE emp_no = '${reqID}' AND first_name = '${firstName}' AND last_name = '${lastName}'`;
        // console.log(query0);
        // check if the entered asset id and its corresponding dept matches a record. Also check if the requestors department matdches the assets department
        let query1 = `SELECT dept_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${assetDept}' AND asset_id = '${assetID}' AND asset_name = '${asset_name}'`;
        // console.log(query1);
        // check if the entered starting point and destination are valid or not
        let query2 = `SELECT * FROM location WHERE location_name = '${startingPoint}'  OR location_name = '${destination}'`;
        // console.log(query2);
        // check if asset is already present in the requested destination or not 
        let query3 = `SELECT location_name FROM assets INNER JOIN location ON assets.location_id = location.location_id WHERE asset_id = '${assetID}' AND asset_name = '${asset_name}'`;
        // console.log(query3);
        // check if there are any request pending for the requested asset
        let query4 = `SELECT * FROM Movement_request WHERE asset_id = '${assetID}' AND asset_name = '${asset_name}' AND Request_status = 'pending'`;
        // console.log(query4)
        // check if there is an ongoing activity regarding the asset that has been requested
        let query5 = `SELECT * FROM Activity INNER JOIN assets ON assets.tag_id = Activity.tag_id WHERE asset_id = '${assetID}' AND asset_name = '${asset_name}'`;
        // console.log(query5)
        // Insert the request into the Movement request table
        let query6;
        if (destination.toLowerCase().includes('outside') == true) {
            query6 = `INSERT INTO Movement_request(asset_id, asset_name, starting_point, destination, date, time, requester_name, requester_id)values('${assetID}','${asset_name}','${startingPoint}', '${startingPoint}', '${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}', '${reqName}', '${reqID}')`;
        }
        else {
            query6 = `INSERT INTO Movement_request(asset_id, asset_name, starting_point, destination, date, time, requester_name, requester_id)values('${assetID}','${asset_name}','${startingPoint}', '${destination}', '${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}', '${reqName}', '${reqID}')`;
        }

        // console.log(query6)

        let queryResult0 = mssql.query(query0, (err0, result0) => {
            if (err0) {
                // console.log('error in /reqAsset query 0');
                // throw err
                //console.log(query0);
            }
            else if (result0.recordset.length > 0) {
                //Valid Employee Checking
                //console.log('passed query 0');
                let emp_dept = Object.values(result0.recordset[0])[0];
                let queryResult1 = mssql.query(query1, (err1, result1) => {
                    if (err1) {
                        console.log('error in /reqAsset query 1');

                    }
                    else if (result1.recordset.length > 0) {
                        // console.log(result1.recordset);
                        //Asset Id anc corresponding dept check
                        if (emp_dept == Object.values(result1.recordset[0])[0]) {
                            // dept of requestor and asset matches
                            let queryResult2 = mssql.query(query2, (err2, result2) => {
                                if (err2) {
                                    console.log('error in /reqAsset query 2');
                                }
                                else if (result2.recordset.length == 2) {
                                    //console.log(result2.recordset);
                                    let queryResult3 = mssql.query(query3, (err3, result3) => {
                                        if (err3) {
                                            console.log('error in /reqAsset query 3');
                                        }
                                        else if (result3.recordset.length > 0) {
                                            // console.log(result3.recordset)
                                            if (startingPoint == Object.values(result3.recordset[0])[0]) {
                                                if (destination != Object.values(result3.recordset[0])[0]) {

                                                    let queryResult4 = mssql.query(query4, (err4, result4) => {
                                                        if (err4) {
                                                            console.log('error in /reqAsset query 4');
                                                        }
                                                        else if (result4.recordset == 0) {
                                                            // console.log(result4);
                                                            let queryResult5 = mssql.query(query5, (err5, result5) => {
                                                                if (err5) {
                                                                    console.log('error in /reqAsset query 5');
                                                                }
                                                                else if (result5.recordset.length == 0) {

                                                                    let queryResult6 = mssql.query(query6, (err6, result6) => {
                                                                        if (err6) {
                                                                            console.log('error in /reqAsset query 6');
                                                                            throw err6
                                                                        }
                                                                        else {

                                                                            if (count == totalCount - 1) {
                                                                                errorList.push(`${assetID} - ${assetName[i]}:  requested`);
                                                                                console.log(errorList);
                                                                                res.send({
                                                                                    state: 1,
                                                                                    res: errorList
                                                                                })
                                                                            }
                                                                            else {
                                                                                errorList.push(`${assetID} - ${assetName[i]}:  requested`);
                                                                                // console.log(errorList)
                                                                                count++;
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                                else {
                                                                    if (count == totalCount - 1) {
                                                                        errorList.push(`${assetID} - ${assetName[i]} :  Requested asset is being moved`);
                                                                        console.log(errorList);
                                                                        res.send({
                                                                            state: 2,
                                                                            res: errorList
                                                                        })
                                                                    }
                                                                    else {
                                                                        errorList.push(`${assetID} - ${assetName[i]} :  Requested asset is being moved`);
                                                                        // console.log(errorList);
                                                                        count++;
                                                                    }
                                                                    // arr.push(`${assetID} :  Requested asset is being moved`);
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            //console.log(result4);
                                                            if (count == totalCount - 1) {
                                                                //console.log(1);
                                                                errorList.push(`${assetID} - ${assetName[i]} :   Unresolved request for the asset exists`);
                                                                console.log(errorList);
                                                                res.send({
                                                                    state: 2,
                                                                    res: errorList
                                                                })
                                                            }
                                                            else {
                                                                errorList.push(`${assetID} - ${assetName[i]} :  Unresolved request for the asset exists`);
                                                                // console.log(errorList);
                                                                count++;
                                                            }
                                                            // arr.push(`${assetID} :  Unresolved request for the asset exists`);
                                                        }
                                                    })
                                                }
                                                else {
                                                    if (count == totalCount - 1) {
                                                        errorList.push(`${assetID} - ${assetName[i]} :  Asset already present at the destination`);
                                                        console.log(errorList);
                                                        res.send({
                                                            state: 2,
                                                            res: errorList
                                                        })
                                                    }
                                                    else {
                                                        errorList.push(`${assetID} - ${assetName[i]} :  Asset already present at the destination`);
                                                        console.log(errorList);
                                                        count++;
                                                    }
                                                    // arr.push(`${assetID} - ${assetName[i]} :  Asset already present at the destination`);
                                                }
                                            }
                                            else {
                                                if (count == totalCount - 1) {
                                                    errorList.push(`${assetID} - ${assetName[i]} :  Invalid starting point for the asset`);
                                                    console.log(errorList);
                                                    res.send({
                                                        state: 2,
                                                        res: errorList
                                                    })
                                                }
                                                else {
                                                    errorList.push(`${assetID} - ${assetName[i]} :  Invalid starting point for the asset`);
                                                    console.log(errorList);
                                                    count++;
                                                }
                                                // arr.push(`${assetID} :  Invalid starting point for the asset`);
                                            }
                                        }
                                        else {
                                            if (count == totalCount - 1) {
                                                errorList.push(`${assetID} - ${assetName[i]} :  The asset is either present in the requested location or is not present at the requested starting location`);
                                                console.log(errorList);
                                                res.send({
                                                    state: 2,
                                                    res: errorList
                                                })
                                            }
                                            else {
                                                errorList.push(`${assetID} - ${assetName[i]} :  The asset is either present in the requested location or is not present at the requested 
                                                    starting location`);
                                                console.log(errorList);
                                                count++;
                                            }
                                            // arr.push(`${assetID} : The asset is either present in the requested location or is not present at the requested starting location`);
                                        }
                                    })
                                }
                                else {
                                    console.log('Either the starting point or the destination is not valid');
                                    if (count == totalCount - 1) {
                                        errorList.push(`${assetID} - ${assetName[i]} :  Either the starting point or the destination is not valid`);
                                        console.log(errorList);
                                        res.send({
                                            state: 2,
                                            res: errorList
                                        })
                                    }
                                    else {
                                        errorList.push(`${assetID} - ${assetName[i]} :  Either the starting point or the destination is not valid`);
                                        console.log(errorList);
                                        count++;
                                    }
                                    // arr.push(`${assetID} :  Either the starting point or the destination is not valid`);
                                }
                            })
                        }
                        else {
                            if (count == totalCount - 1) {
                                errorList.push(`${assetID} - ${assetName[i]} :  User unauthorized to request the asset`);
                                // console.log(errorList);
                                res.send({
                                    state: 2,
                                    res: errorList
                                })
                            }
                            else {
                                errorList.push(`${assetID} - ${assetName[i]} :  User unauthorized to request the asset`);
                                // console.log(errorList);
                                count++;
                            }
                            // arr.push(`${assetID} :  User unauthorized to request the asset`);
                        }
                    }
                    else {
                        if (count == totalCount - 1) {
                            errorList.push(`${assetID} - ${assetName[i]} :  Requested asset does not exist`);
                            // console.log(errorList);
                            res.send({
                                state: 2,
                                res: errorList
                            })
                        }
                        else {
                            errorList.push(`${assetID} - ${assetName[i]} :  Requested asset does not exist`);
                            // console.log(errorList);
                            count++;
                        }
                        // arr.push(`${assetID} : + Requested asset does not exist`);
                    }
                })
            }
            else {
                if (count == totalCount - 1) {
                    errorList.push(`Invalid employee credentials`);
                    // console.log(errorList);
                    res.send({
                        state: 2,
                        res: errorList
                    })
                }
                else {
                    errorList.push(`Invalid employee credentials`);
                    // console.log(errorList);
                    count++;
                }
                // console.log('Invalid employee credentials');
            }
        });
    }
});

app.post('/multiReq', (req, res) => {
    let idElements = [];
    let count = 0;
    let errorList = [];
    let reqName = req.body.reqName.toLowerCase();
    let reqID = req.body.reqID.toLowerCase();
    let assetDept = req.body.reqDept;
    let data = JSON.parse(req.body.data);
    let starting_point = [];
    let ending_point = [];
    let asset_id = [];
    let asset_name = [];


    data.pop(); // eliminating the added space at the end cause of JSON stringify and parse    
    let firstName = reqName.split(" ")[0];
    let lastName = reqName.split(" ")[1];
    let totalCount = data.length;

    // console.log(totalCount)
    let len = data.length;

    for (let i = 0; i < data.length; i++) {
        idElements.push(data[i].split(',')[0]);
        let start = data[i].split(',')[1];
        // console.log(start)
        starting_point.push(start.toLowerCase().replaceAll(/\s/g, ''));
        // starting_point.push(data[i].split(',')[1]);
        let end = data[i].split(',')[2];
        ending_point.push(end.toLowerCase().replaceAll(/\s/g, ''));

    }

    const intersection_location = [...new Set(starting_point.filter(element => ending_point.includes(element)))];

    const uniq = idElements.map((name) => {
        return {
            count: 1,
            name: name
        };
    }).reduce((result, b) => {
        result[b.name] = (result[b.name] || 0) + b.count;
        return result;
    }, {});

    // console.log(idElements)
    const duplicate_ID = Object.keys(uniq).filter((a) => uniq[a] > 1);
    // console.log(duplicate_ID.length)

    //Checking for duplicate values
    // (idElements.length != new Set(idElements).size)

    if ((duplicate_ID.length > 0) || (intersection_location.length > 0)) {
        // id parameter has duplicate values
        // console.log(intersection_location)
        // console.log(duplicate_ID)
        if (intersection_location.length > 0 && duplicate_ID.length == 0) {
            console.log(`Duplicate strarting and destination in csv : ${intersection_location}`)
            res.send(`Duplicate strarting and destination in csv : ${intersection_location}`);
        } else if (duplicate_ID.length > 0 && intersection_location.length == 0) {
            console.log(`Duplicate assets in csv : ${duplicate_ID}`)
            res.send(`Duplicate assets in csv : ${duplicate_ID}`);
        } else if ((duplicate_ID.length > 0) && (intersection_location.length > 0)) {
            console.log(`Duplicate asset in : ${duplicate_ID} and duplicate start and dest. : ${intersection_location} `)
            res.send(`Duplicate asset in : ${duplicate_ID} and duplicate start and dest. : ${intersection_location} `);
        }
        // res.send('ID parameter has duplicate values or starting and ending locations have duplicate values or both');
    }
    else {
        // console.log('normal function');
        for (let i = 0; i < data.length; i++) {
            let arr = data[i].split(',');
            // console.log(arr)
            let assetID = arr[0].toLowerCase();
            let startingPoint = arr[1].toLowerCase().replaceAll(/\s/g, '');
            let destination = arr[2].toLowerCase().replaceAll(/\s/g, '');
            // console.log(assetID)
            // console.log(assetID.length)

            // if(startingPoint !== '' || destination !== ''  || assetID !== ''){    
            if (startingPoint.length > 0 && destination.length > 0 && assetID.length > 0) {

                // console.log(1)
                // //fetch Asset_id and names
                // let query = `SELECT asset_id, asset_name FROM assets WHERE asset_id = '${assetID}'`;
                // check if the requestor is a valid employee or not and retrieve their dept
                let query0 = `SELECT dept_work FROM Employees WHERE emp_no = '${reqID}' AND first_name = '${firstName}' AND last_name = '${lastName}'`;
                // check if the entered asset id and its corresponding dept matches a record. Also check if the requestors department matches the assets department
                let query1 = `SELECT dept_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${assetDept}' AND asset_id = '${assetID}'`;
                // check if the entered starting point and destination are valid or not
                // let query2 = `SELECT * FROM location WHERE location_name = '${startingPoint}'  OR location_name = '${destination}'`;
                // check if asset is already present in the requested destination or not 
                let query3 = `SELECT location_name FROM assets INNER JOIN location ON assets.location_id = location.location_id WHERE asset_id = '${assetID}'`;
                // check if there are any request pending for the requested asset
                let query4 = `SELECT * FROM Movement_request WHERE asset_id = '${assetID}' AND Request_status = 'Pending'`;
                // check if there is an ongoing activity regarding the asset that has been requested
                let query5 = `SELECT * FROM Activity INNER JOIN assets ON assets.tag_id = Activity.tag_id WHERE asset_id = '${assetID}'`;
                // Insert the request into the Movement request table
                let query6 = `INSERT INTO Movement_request(asset_id, starting_point, destination, date, time, requester_name, requester_id)values('${assetID}', '${startingPoint}', '${destination}', '${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}', '${reqName}', '${reqID}')`;
                // console.log(i)

                let query = `SELECT asset_id, asset_name FROM assets WHERE asset_id = '${assetID}'`;
                let queryResult = mssql.query(query, (err_0, result_0) => {
                    if (err_0) {
                        console.log('error in /reqAsset query 0');
                        throw err_0
                    }
                    else {
                        for (let j = 0; j < result_0.recordset.length; j++) {
                            let id = Object.values(result_0.recordset[j])[0];
                            let name = Object.values(result_0.recordset[j])[1];

                            asset_id.push(id);
                            asset_name.push(name);

                        }
                        // console.log(asset_id)
                        if (i == len - 1) {
                            // console.log(`Normal Functions : ${assetID}`)
                            // console.log(asset_id)
                            let realcount = asset_id.length;
                            // console.log(realcount)
                            for (let j = 0; j < realcount; j++) {
                                let ID = asset_id[j];
                                let name = asset_name[j];

                                // check if the requestor is a valid employee or not and retrieve their dept and error message not required
                                let query0 = `SELECT dept_work FROM Employees WHERE emp_no = '${reqID}' AND first_name = '${firstName}' AND last_name = '${lastName}'`;
                                // check if the entered asset id and its corresponding dept matches a record. Also check if the requestors department matches the assets department
                                let query1 = `SELECT dept_name FROM assets INNER JOIN department ON assets.dept_id = department.dept_id WHERE dept_name = '${assetDept}' AND asset_id = '${ID}' AND asset_name = '${name}'`;
                                // check if asset is already present in the requested destination or not 
                                let query3 = `SELECT location_name FROM assets INNER JOIN location ON assets.location_id = location.location_id WHERE asset_id = '${ID}' AND asset_name = '${name}'`;
                                // check if there are any request pending for the requested asset
                                let query4 = `SELECT * FROM Movement_request WHERE asset_id = '${ID}' AND asset_name = '${name}' AND Request_status = 'Pending'`;
                                // console.log(query4)
                                let query5 = `SELECT * FROM Activity INNER JOIN assets ON assets.tag_id = Activity.tag_id WHERE asset_id = '${ID}' AND asset_name = '${name}'`;
                                // console.log(query5);
                                let query6 = `INSERT INTO Movement_request(asset_id, asset_name , starting_point, destination, date, time, requester_name, requester_id)values('${ID}','${name}','${startingPoint}', '${destination}', '${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}', '${reqName}', '${reqID}')`;
                                // console.log(query6)

                                let queryResult0 = mssql.query(query0, (err0, result0) => {
                                    if (err0) {
                                        throw err0;
                                        console.log("Error in query0")
                                    } else {
                                        let emp_dept = Object.values(result0.recordset[0])[0];

                                        let queryresult1 = mssql.query(query1, (err1, result1) => {
                                            if (err1) {
                                                throw err1;
                                                console.log("Error in query1");
                                            } else if (result1.recordset.length > 0) {
                                                if (emp_dept == Object.values(result1.recordset[0])[0]) {
                                                    //Requestor and asset dept matches

                                                    let queryResult3 = mssql.query(query3, (err3, result3) => {
                                                        if (err3) {
                                                            throw err3;
                                                            console.log("Error in query3");
                                                        } else if (result3.recordset.length > 0) {
                                                            // console.log(Object.values(result3.recordset[0])[0])

                                                            let queryResult4 = mssql.query(query4, (err4, result4) => {
                                                                if (err4) {
                                                                    throw err4;
                                                                    console.log("Error in query4");
                                                                } else if (result4.recordset.length == 0) {
                                                                    // console.log("No movements found");
                                                                    let queryResult5 = mssql.query(query5, (err5, result5) => {
                                                                        if (err5) {
                                                                            throw err5;
                                                                            console.log("Error in query5")

                                                                        } else if (result5.recordset.length == 0) {
                                                                            // console.log("Asset on move");
                                                                            let queryResult6 = mssql.query(query6, (err6, result6) => {
                                                                                if (err6) {
                                                                                    throw err6
                                                                                    console.log("Error in query6")
                                                                                }
                                                                                else {
                                                                                    if (count == realcount - 1) {
                                                                                        errorList.push(`${ID} - ${name}:  requested`);
                                                                                        res.send(errorList);
                                                                                        return;
                                                                                    }
                                                                                    else {
                                                                                        errorList.push(`${ID} - ${name} :  requested`);
                                                                                        count++;
                                                                                    }
                                                                                }
                                                                            })
                                                                        } else {
                                                                            if (count == realcount - 1) {
                                                                                errorList.push(`${ID} - ${name} :  Requested asset is being moved`);
                                                                                res.send(errorList);
                                                                            }
                                                                            else {
                                                                                errorList.push(`${ID} - ${name} :  Requested asset is being moved`);
                                                                                count++;
                                                                            }
                                                                        }
                                                                    })
                                                                } else {
                                                                    // console.log(result4);
                                                                    if (count == realcount - 1) {
                                                                        //console.log(1);
                                                                        errorList.push(`${ID} - ${name} :   Unresolved request for the asset exists`);
                                                                        res.send(errorList);
                                                                    }
                                                                    else {
                                                                        errorList.push(`${ID} - ${name} :  Unresolved request for the asset exists`);
                                                                        count++;
                                                                    }
                                                                }
                                                            })

                                                        } else {
                                                            if (count == realcount - 1) {
                                                                errorList.push(`${assetID} :  The asset is either present in the requested location or is not present at the requested starting location`);
                                                                res.send(errorList);
                                                            }
                                                            else {
                                                                errorList.push(`${assetID} :  The asset is either present in the requested location or is not present at the requested starting location`);
                                                                count++;
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    if (count == realcount - 1) {
                                                        errorList.push(`${assetID} :  User unauthorized to request the asset`);
                                                        res.send(errorList);
                                                    }
                                                    else {
                                                        errorList.push(`${assetID} :  User unauthorized to request the asset`);
                                                        count++;
                                                    }
                                                }
                                            } else {
                                                if (count == realcount - 1) {
                                                    errorList.push(`${assetID} :  Requested asset does not exist`);
                                                    res.send(errorList);
                                                }
                                                else {
                                                    errorList.push(`${assetID} :  Requested asset does not exist`);
                                                    count++;
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    }
                })
                //For blank condition
            } else {
                if (i == totalCount - 1) {
                    // console.log(2)
                    res.send("Incomplete Fields ,  assetId or starting location or destination is empty")
                }
            }
        }
    }
})

app.post('/mAppr', (req, res) => {
    // console.log(req.body);
    let id = req.body.assetID;
    let assetName = req.body.assetName;
    let serial = req.body.requestSerial;
    let start = req.body.start;
    let dest = req.body.destination;
    let empID = req.body.empID;

    let q0 = `SELECT  (
            SELECT location_id
            FROM   location where location_name='${start}'
        ) AS start,
        (
             SELECT location_id
            FROM   location where location_name='${dest}'
        ) AS dest`;
    let queryResult0 = mssql.query(q0, (err0, result0) => {
        if (err0) console.log('/mAppr err 0');
        else {
            let start_id = Object.values(result0.recordset[0])[0];
            let dest_id = Object.values(result0.recordset[0])[1];
            let q1 = `SELECT tag_id FROM assets WHERE asset_id = '${id}' AND asset_name = '${assetName}'`;
            let queryResult1 = mssql.query(q1, (err1, result1) => {
                if (err1) throw err1
                else {
                    let tagID = result1.recordset[0].tag_id;
                    let q2 = `INSERT INTO Activity (approve_date, approve_time, emp_id, starting_point, destination, tag_id, approve_status) values('${moment().format('YYYY-MM-DD')}', '${moment().format('hh:mm:ss')}','${empID}', '${start_id}', '${dest_id}', '${tagID}', 'Approved' )`;
                    console.log(q2);
                    let queryResult1 = mssql.query(q2, (err2, result2) => {
                        if (err2) console.log(err2)
                        else {
                            let q3 = `UPDATE Movement_request SET Request_status='Approved' from Movement_request where asset_id='${id}' AND serial = '${serial}' AND asset_name = '${assetName}'`;
                            let queryResult2 = mssql.query(q3, (err3, result3) => {
                                if (err3) console.log(err3)
                                else {
                                    res.send(id.toString());
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
app.post('/aAppr', (req, res) => {
    // console.log(req.body);
    console.log('entered route');
    let id = req.body.userID;
    let serial = req.body.requesterSerial;
    let userName = req.body.userName;
    let email = req.body.email;
    let pass = `user`;
    let q1 = `UPDATE Access_request SET Request_status='Approved' where serial='${serial}' and applicant_id='${id}'`;
    let q2 = `UPDATE Users SET user_type = 'Admin' WHERE user_id = '${id}'`;

    console.log('printing 2nd query =' + q2);

    let queryResult1 = mssql.query(q1, (err1, result1) => {
        if (err1) {
            console.log('/appr err1');
        }
        else {
            console.log('executed first query');
            let queryResult2 = mssql.query(q2, (err2, result2) => {
                if (err2) throw err2
                else {
                    console.log('executed 2nd query');
                    res.send('success');
                }
            })
        }
    })
})
app.post('/mDeny', (req, res) => {
    // console.log(req.body);
    let id = req.body.assetId;
    let assetName = req.body.assetName;
    let serial = req.body.reqSerial;

    let q1 = `UPDATE Movement_request SET Request_status='Denied' from Movement_request where asset_id='${id}' AND serial = '${serial}'`;
    let queryResult1 = mssql.query(q1, (err1, result1) => {
        if (err1) console.log('failed deny query1')
        else {
            res.send('Denied');
        }
    })
})
app.post('/aDeny', (req, res) => {
    // console.log(req.body);
    let serial = req.body.reqSerial;
    let id = req.body.reqID;
    let q = `UPDATE Access_request SET Request_status='Denied' where serial='${serial}' and applicant_id='${id}'`;
    console.log(q);
    let queryResult = mssql.query(q, (err, result) => {
        if (err) throw err
        else {
            res.send('Denied');
        }
    })
})