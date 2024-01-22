// Mantosh code  
// Audit assign page 


const express = require('express');
const mssql = require('mssql');
const { CourierClient } = require("@trycourier/courier");

const router = express.Router();

// Mantosh code 

// Here it is used to fetch all the locations from location_table ,departments from departments table, 
// and common location_id and department_id present in two tables has been fetched

router.get('/loc-dept-fetch', (req, res) => {


  let query = 'select location_id, location_name from asset.dbo.location'

  let query1 = 'select dept_name , dept_id from asset.dbo.department'

  let query2 = 'select l.location_id,d.dept_id from asset.dbo.location l inner join asset.dbo.department d on l.location_id=d.location_id'

  mssql.query(query, (err, result) => {


        // console.log(result.recordset)

    if (err) throw err






    // console.log(result1.recordset)
    
   

    mssql.query(query1, (err, result1) => {


      if (err) throw err

      console.log(result1.recordset)

    // console.log(result2.recordset)
   



      mssql.query(query2, (err, result2) => {

        if (err) throw err

        console.log(result2.recordset)


        res.send({

          location: result.recordset,

          department: result1.recordset,

          loc_dep: result2.recordset

        })

      })

    })

  })


})

// Mantosh Code 

//  here it can fetch emp_name with respect to emp_no

router.get('/emp-no-emp-name',(req,res)=>{
    let emp_no=req.query.emp_no


  let query = `select CASE WHEN middle_name IS NULL OR middle_name = '' THEN CONCAT(first_name, ' ', last_name)
    ELSE CONCAT(first_name, ' ', middle_name, ' ', last_name)
END AS emp_name from asset.dbo.Employees where emp_no=${emp_no}`



  mssql.query(query, (err, result) => {


    if (err) throw err
    if (result.recordset.length != 0) {
      res.status(200).send({
        answer: result.recordset[0]
      }

      )
    }



    else {



      res.status(404).send({

        message: "Employee number doesn't exist"



      })
    }
  })

})


// Mantosh Code
// Here it fetch the data with respect to dept_id and location_id

router.get('/audit-assign-one',(req,res)=>{
    // console.log('1')
    // console.log('page_number', page_number);
    // console.log('page_size', page_size)
    // console.log(dept_id, location_id)
    let page_number=req.query.page_number


  let page_size = req.query.page_size

  let dept_id = req.query.dept_id;

  let location_id = req.query.location_id;


  // let page_number=1

  // let page_size=50

  // let dept_id=3;

  // let location_id=497013;

    // console.log('page_number', page_number);
    // console.log('page_size', page_size)
    // console.log(dept_id, location_id)


  let query1 = `select count(*) as TotalRows from asset.dbo.assets a inner join asset.dbo.department d on a.dept_id=d.dept_id inner join asset.dbo.location l on a.location_id=l.location_id
  where a.dept_id=${dept_id} and a.location_id=${location_id}`;

  // console.log('query1', query1);

  let query = `select * from(select a.serial,a.asset_id,a.tag_id,a.tag_uuid,a.asset_name,a.asset_type,d.dept_name,l.location_name,ROW_NUMBER() OVER (ORDER BY a.serial) AS RowNum from 
  asset.dbo.assets a inner join asset.dbo.department d on a.dept_id=d.dept_id inner join asset.dbo.location l on a.location_id=l.location_id
  where a.dept_id=${dept_id} and a.location_id=${location_id})AS SubQuery
  WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
  AND RowNum <= @total_rows;

  SELECT @total_rows AS TotalRows`

  // console.log('query', query);

  let request1 = new mssql.Request();

  request1.query(query1, (err, result1) => {
    if (err) {
      console.log('Error in total rows of audit-assign query:', err);
      res.sendStatus(500);
      return;
    }
    // console.log(result1)
    total_rows = result1.recordset[0].TotalRows;
    // console.log('Total Rows:', total_rows);

    let request2 = new mssql.Request();
    request2.input('total_rows', mssql.Int, total_rows);
    request2.input('page_size', mssql.Int, page_size);
    request2.input('page_number', mssql.Int, page_number);


    request2.query(query, (err, result) => {
      if (err) {
        // console.log('Error in audit-all-data query:', err);
        res.sendStatus(500);
        return;
      }
      const data = result.recordset;
      const allPages = { total_rows }
      answer = {
        answer: data,
        allPages: allPages
      };
      if (result.recordset.length != 0) {

        res.status(200).send(
          {
            answer
          }

        )
      }
      else {



        res.status(404).send({

          message: "No data found"



        })
      }


    });

  })
});
// Mantosh Code 
// Here the data has been sent to the audit details and Asset Audit details






router.post('/submitForm', (req, res) => {
  const { employeeNumber,
    locationID,
    departmentID,
    scheduledStartDate,
    scheduledEndDate,
    userID,
    auditorName

  } = req.body
  const AuditStatus = 'Open';

  // const currentDatetime = new Date();
  // const year = currentDatetime.getFullYear();
  // const month = String(currentDatetime.getMonth() + 1).padStart(2, "0");
  // const day = String(currentDatetime.getDate()).padStart(2, "0");
  // const hours = String(currentDatetime.getHours()).padStart(2, "0");
  // const minutes = String(currentDatetime.getMinutes()).padStart(2, "0");
  // const seconds = String(currentDatetime.getSeconds()).padStart(2, "0");
  // const milliseconds = String(currentDatetime.getMilliseconds()).padStart(3, "0");

  // const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;



  const currentDatetime = new Date();
  const formattedDatetime = currentDatetime.toISOString();


  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }



  // const employeeNumber= 765432
  // const locationID= 355013
  // const departmentID= 1
  // const scheduledStartDate= '2090-06-26 00:00:00.000'
  // const scheduledEndDate= '2025-06-27 13:45:47.000'

  // // const formattedDatetime = '2024-06-27 12:45:47.000'
  // const userID='1007'

  // console.log(employeeNumber,
  //   locationID,
  //   departmentID,
  //   scheduledStartDate,
  //   scheduledEndDate,
  //   userID,
  //   formattedDatetime,
  //   )


  let query = `insert into AuditDetails(EmployeeNo,LocationId,DepartmentId,CreatedOn,CreatedBy,ScheduledStartDate,ScheduledEndDate,LastUpdatedOn,LastUpdatedBy,AuditStatus,AuditorName) OUTPUT inserted.Id
  values(${employeeNumber},${locationID},${departmentID},'${formattedDatetime}','${userID}','${scheduledStartDate}','${scheduledEndDate}','${formattedDatetime}',${userID},'${AuditStatus}','${auditorName}')`

  let query2 = `select a.serial,a.asset_id,a.tag_id,a.tag_uuid,a.asset_name,a.asset_type,d.dept_name,l.location_name,ROW_NUMBER() OVER (ORDER BY a.serial) AS RowNum from 
  asset.dbo.assets a inner join asset.dbo.department d on a.dept_id=d.dept_id inner join asset.dbo.location l on a.location_id=l.location_id
  where a.dept_id=${departmentID} and a.location_id=${locationID}`

  try {

    let queryResult = mssql.query(query, (err, result) => {


      if(err) throw err
      // console.log(result.recordset)
  
      let queryResult2 = mssql.query(query2,(err,result2)=>{
      
        for(let i in result2.recordset){

          let queryResult3 = mssql.query(`insert into asset.dbo.AssetAuditDetails(AuditId,AssetSerialId,CreatedOn,CreatedBy,LastUpdatedOn,LastUpdatedBy)
            values(${result.recordset[0].Id},${result2.recordset[i].serial},'${formattedDatetime}','${userID}','${formattedDatetime}','${userID}')`, (err, result3) => {
          })
        }

        const courier = CourierClient(
          { authorizationToken: "pk_prod_74VJJYV9FJM339HN62SS0E344X92" });
          const { requestId } = courier.send({
          message: {
            content: {
              title: "Asset Audit Assignment",
              //body: "You Have to Audit? {{Audit}}"
              body: "{{Audit}}",
            },
            data: {
              Audit: `Dear Ma'am/Sir,
               This is to inform you that you have been assigned an audit task from Date ${formatDate(scheduledStartDate)} to ${formatDate(scheduledEndDate)}. Please review the details.
               If you have any questions or require further information, please contact to respective persons.
               Thank you for your cooperation.

               Best regards,
              [Dept Name]`,
            },
            to: {
              email: "satyam.vivek@soulunileaders.com",
            }
          }
        });

        res.status(200).send({
          message: "Insertion Done"
        })
      })
    })
  }
  catch (e) {
    res.status(500).send({
      message: "Error in insertion of new record!!!"
    })
  }

});


module.exports = router;

