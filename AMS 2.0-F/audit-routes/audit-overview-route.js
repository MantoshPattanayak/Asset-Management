const express = require('express');
const mssql = require('mssql');

const router = express.Router();


router.post('/audit_parent',(req,res)=>{
              let limit = (req.body.page_size) ? req.body.page_size :50;

              let answer;

              let page = (req.body.page_number) ? req.body.page_number :1;
 

            let offset = (page - 1) * limit;
            console.log(limit,page,offset)
           
           
            const locationName=req.query.location_name!== null && req.query.location_name!== 'null' ? req.query.location_name : undefined;
            const departmentName=req.query.department_name !== null && req.query.department_name !== 'null' ? req.query.department_name : undefined;       
            const employeeNo=req.query.employee_no!== null && req.query.employee_no !== 'null' ? req.query.employee_no : undefined;        

            console.log(locationName,departmentName,employeeNo)

        let query1 =`select count(*) as TotalRows from asset.dbo.AuditDetails a inner join asset.dbo.location l on  l.location_id=a.LocationId inner join asset.dbo.department d on d.dept_id=a.DepartmentId where 1=1 `;
      
        let query = `select a.id,a.AuditorName,l.location_name,d.dept_name,a.EmployeeNo,a.ScheduledStartDate,a.ScheduledEndDate,a.AuditStatus
         from asset.dbo.AuditDetails a inner join asset.dbo.location l on l.location_id=a.LocationId inner join asset.dbo.department d on d.dept_id=a.DepartmentId
        WHERE 1=1
    `;
      
    if (locationName !== undefined && locationName!== null && locationName.trim() !== '') {
      console.log('1')
      query += ` AND l.location_name = ${locationName}`;
      query1 += ` AND l.location_name  = ${locationName}`;
      console.log(`${locationName}`)
    }

    if (departmentName !== undefined && departmentName!== null && departmentName.trim() !== '') {
      query += ` AND d.dept_name = ${departmentName}`;
      query1 += ` AND d.dept_name  = ${departmentName}`;
      console.log(`${departmentName}`)
    }


    if (employeeNo !== 'undefined' && employeeNo !== null && employeeNo.trim() !== '') {
      query += ` AND a.EmployeeNo = ${employeeNo}`;
      query1 += ` AND a.EmployeeNo = ${employeeNo}`;
      console.log(`${employeeNo}`)
    }
    if(page!= null) {
      query += ` ORDER BY a.id OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
      }


      let request1 = new mssql.Request();
    
      request1.query(query1, (err, result1) => {
        if (err) {
          console.log('Error in total rows of assets query:', err);
          res.sendStatus(500);
          return;
        }
    
        total_rows = result1.recordset[0].TotalRows;
        console.log('Total Rows:', total_rows);
    
        let request2 = new  mssql.Request();
        
      
        request2.query(query, (err, result) => {
          if (err) {
            console.log('Error in all assets query:', err);
            res.sendStatus(500);
            return;
          }
    
          const data = result.recordset;
      
          const allPages={total_rows}
          answer = {
            answer: data,
            allPages: allPages
          };
          // console.log(answer)
          // console.log(asset_id)
          // console.log(dept_name)
          // console.log(emp_name)
          // console.log(emp_no)
          // console.log(asset_type)
          // console.log(asset_name)
          // console.log(location_name)
          res.send({ answer: answer });
        });
      })
    })
    
     




router.post('/audit_child',(req,res)=>{
    
  let total_rows;
  let page_size = 1;
  let answer;
 
  let page_number = 2;
  let c = 1;

  let query1 =`select count(*) as TotalRows from asset.dbo.AssetAuditDetails`;

  let query = `select * from(select AuditId,AssetSerialId ,CreatedOn ,CreatedBy ,LastUpdatedBy,LastDeletedOn,LastDeletedBy,ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
   from asset.dbo.AssetAuditDetails)AS SubQuery
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
    console.log(result1)
    total_rows = result1.recordset[0].TotalRows;
    console.log('Total Rows:', total_rows);

    let request2 = new  mssql.Request();
    request2.input('total_rows', mssql.Int, total_rows);
    request2.input('page_size',  mssql.Int, page_size);
    request2.input('page_number',  mssql.Int, page_number);
    request2.input('c',  mssql.Int, c);

    request2.query(query, (err, result) => {
      if (err) {
        console.log('Error in audit assets query:', err);
        res.sendStatus(500);
        return;
      }
      console.log(result)
      const data = result.recordset;
      // const totalPages = Math.ceil(total_rows / page_size)
      const allPages={total_rows}
      answer = {
        answer: data,
        allPages: allPages
      };
      res.send({ answer: answer });
    });
  });

  

})

// *** Debasish Code ***
// API for fetch Audit User Type
router.get('/audit_roll_check',(req,res)=>{
    
  console.log(req.body.employeeID);
  employeeID = req.query.employeeID;
  let query = `SELECT user_type FROM users WHERE user_id=${employeeID}`;

  let request1 = new mssql.Request();

  request1.query(query, (err, result) => {
    if (err) {
      console.log('Error in total rows of assets query:', err);
      res.sendStatus(500);
      return;
    }
      console.log(result)
      const data = result.recordset;
      //const data = req.body;
      console.log(data)
      //res.send({ data });
     res.send(data[0].user_type);
    });
    
  });
module.exports = router;