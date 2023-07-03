const express = require('express');
const mssql = require('mssql');

const router = express.Router();


router.get('/loc-dept-fetch',(req,res)=>{
    

    let query='select location_id, location_name from asset.dbo.location'

    let query1='select dept_name , dept_id from asset.dbo.department'

    let query2='select l.location_id,d.dept_id from asset.dbo.location l inner join asset.dbo.department d on l.location_id=d.location_id'

 mssql.query(query, (err, result) => {

    if(err) throw err

        console.log(result.recordset)

       


mssql.query(query1, (err, result1) => {

 if(err) throw err

    console.log(result1.recordset)
    
   

 mssql.query(query2, (err, result2) => {

    if(err) throw err

    console.log(result2.recordset)
   

    res.send({

        location:result.recordset,

        department:result1.recordset,

        loc_dep:result2.recordset

    })
   
})

})

})


})

router.get('/emp-no-emp-name',(req,res)=>{
    let emp_no=req.query.emp_no

    let query=`select CONCAT(first_name, ' ', middle_name, ' ', last_name)  as emp_name from asset.dbo.Employees where emp_no=${emp_no}`

    

 mssql.query(query, (err, result) => {


    if(err) throw err
    if(result.recordset.length!=0){
        res.status(200).send({
            answer:result.recordset[0]
        }
            
        )
    }

       
       
   else{

   

    res.status(404).send({

    message:"Emloyee number doesn't exist"

       

    })
}
})

})

router.get('/audit-assign-one',(req,res)=>{
    console.log('1')
    // console.log('page_number', page_number);
    // console.log('page_size', page_size)
    // console.log(dept_id, location_id)
    let page_number=req.query.page_number

    let page_size=req.query.page_size

    let dept_id=req.query.dept_id;

    let location_id=req.query.location_id;


    // let page_number=1

    // let page_size=50

    // let dept_id=3;

    // let location_id=497013;

    console.log('page_number', page_number);
    console.log('page_size', page_size)
    console.log(dept_id, location_id)

    let query1 =`select count(*) as TotalRows from asset.dbo.assets a inner join asset.dbo.department d on a.dept_id=d.dept_id inner join asset.dbo.location l on a.location_id=l.location_id
  where a.dept_id=${dept_id} and a.location_id=${location_id}`;

  console.log('query1', query1);

  let query=`select * from(select a.serial,a.asset_id,a.tag_id,a.tag_uuid,a.asset_name,a.asset_type,d.dept_name,l.location_name,ROW_NUMBER() OVER (ORDER BY a.serial) AS RowNum from 
  asset.dbo.assets a inner join asset.dbo.department d on a.dept_id=d.dept_id inner join asset.dbo.location l on a.location_id=l.location_id
  where a.dept_id=${dept_id} and a.location_id=${location_id})AS SubQuery
  WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
  AND RowNum <= @total_rows;

  SELECT @total_rows AS TotalRows`

  console.log('query', query);

  let request1 = new mssql.Request();

  request1.query(query1, (err, result1) => {
    if (err) {
      console.log('Error in total rows of audit-assign query:', err);
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
 

    request2.query(query, (err, result) => {
      if (err) {
        console.log('Error in audit-all-data query:', err);
        res.sendStatus(500);
        return;
      }
     const data=result.recordset;
    const allPages={total_rows}
      answer = {
            answer: data,
            allPages: allPages
          };
      if(result.recordset.length!=0){
  
          res.status(200).send({
             answer
          }
              
      )
      }
      else{
  
     
  
          res.status(404).send({
      
          message:"No data found"
      
             
      
          })
      }
    
    
  });

})
  
})

module.exports = router;