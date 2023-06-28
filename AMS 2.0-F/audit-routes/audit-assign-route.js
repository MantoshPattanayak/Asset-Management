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

    let dept_id=req.body.dept_id;

    let location_id=req.body.location_id;

  let query=`select a.serial,a.asset_id,a.tag_id,a.tag_uuid,a.asset_name,a.asset_type,a.asset_type,d.dept_name,l.location_name from 
  asset.dbo.assets a inner join asset.dbo.department d on a.dept_id=d.dept_id inner join asset.dbo.location l on a.location_id=l.location_id
  where a.dept_id=${dept_id} and a.location_id=${location_id}`

  
 mssql.query(query, (err, result) => {


    if(err) throw err
    
    if(result.recordset.length!=0){

        res.status(200).send({
            answer:result.recordset
        }
            
    )
    }
    else{

   

        res.status(404).send({
    
        message:"No data found"
    
           
    
        })
    }
  
})
})

module.exports = router;