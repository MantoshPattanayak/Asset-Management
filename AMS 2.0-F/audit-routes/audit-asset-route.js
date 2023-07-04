const express = require('express');
const mssql = require('mssql');

const router = express.Router();

router.get('/fetch-data', async (req, res) => {
  
    let auditID = 25

    const page_number=2

    const page_size=10

    let query = "select ad.Id as AuditNumber, CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name) as NameOfAuditor, "
    +"ad.AuditStatus, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate "
    +"from AuditDetails ad "
    +"inner join location l on ad.LocationId = l.location_id "
    +"inner join department d on ad.DepartmentId = d.dept_id "
    +"inner join Employees e on ad.EmployeeNo = e.emp_no "
    +`where ad.Id = ${auditID}`

    let query1 = `select * from (select a.tag_id, a.tag_uuid, a.asset_id, a.asset_class, a.asset_type, a.asset_name,l.location_name, aad.AssetStatus,
    ROW_NUMBER() OVER (ORDER BY a.asset_id) AS RowNum from AuditDetails ad 
    inner join AssetAuditDetails aad on ad.Id = aad.AuditId
    inner join assets a on a.serial = aad.AssetSerialId 
    inner join location l ON l.location_id = a.location_id
    where ad.Id = ${auditID})AS SubQuery
    WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
    AND RowNum <= @total_rows
  
    SELECT @total_rows AS TotalRows`


    let query3 = "select "
    + "count(*) as TotalRows "
    +"from AuditDetails ad "
    +"inner join AssetAuditDetails aad on ad.Id = aad.AuditId "
    +"inner join assets a on a.serial = aad.AssetSerialId "
    +"inner join location l ON l.location_id = a.location_id "
    +`where ad.Id = ${auditID}`
    
  
   

    let query2 = "SELECT "
    +"COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) AS FoundAssetCount, "
    +"COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) AS MissingAssetCount, "
    +"COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) AS NewAssetCount, "
    +"COUNT(*) AS TotalAssets "
    +"FROM AssetAuditDetails "
    +`WHERE AuditId = ${auditID}`

    try{
        
        mssql.query(query, (err, result) => {
            if(err) throw err;

            let auditNumber = result.recordset[0].AuditNumber;
            let auditorName = result.recordset[0].NameOfAuditor;
            let auditStatus = result.recordset[0].AuditStatus;
            let locationName = result.recordset[0].location_name;
            let scheduledStartDate = result.recordset[0].ScheduledStartDate;
            let scheduledEndDate = result.recordset[0].ScheduledEndDate;

            let request3 = new mssql.Request();
                request3.query(query3, (err, result3) => {
                if (err) {
                console.log('Error in total rows of audit-asset query:', err);
                res.sendStatus(500);
                return;
                }
                console.log(result3)
                total_rows = result3.recordset[0].TotalRows;
                const all_rows={all_pages:total_rows};
                console.log('Total Rows:', total_rows);
               

            let request1 = new  mssql.Request();
            request1.input('total_rows', mssql.Int, total_rows);
            request1.input('page_size',  mssql.Int, page_size);
            request1.input('page_number',  mssql.Int, page_number);
                request1.query(query1, (err, result1) => {
         
                
                if(err) throw err;

                let assetAuditDetailsData = result1.recordset;
                

                mssql.query(query2, (err, result2) => {
                    if(err) throw err;

                    let assetCountData = result2.recordset;

                    res.status(200).send({all_rows,
                        auditNumber, auditorName, auditStatus, locationName, scheduledStartDate, scheduledEndDate,
                        assetAuditDetailsData, assetCountData
                    });
                })
            })
        })
    })
    }
    catch(e){
        res.status(500).send({message: "Error in fetching data"});
    }
})

module.exports = router;