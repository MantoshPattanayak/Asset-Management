const express = require('express');
const mssql = require('mssql');

const router = express.Router();

router.get('/fetch-data', async (req, res) => {
    let auditID = req.query.auditID;
    let query = "select ad.Id as AuditNumber, CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name) as NameOfAuditor, "
    +"ad.AuditStatus, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate "
    +"from AuditDetails ad "
    +"inner join location l on ad.LocationId = l.location_id "
    +"inner join department d on ad.DepartmentId = d.dept_id "
    +"inner join Employees e on ad.EmployeeNo = e.emp_no "
    +`where ad.Id = ${auditID}`

    let query1 = "select a.tag_id, a.tag_uuid, a.asset_id, a.asset_class, a.asset_type, a.asset_name, "
    +"l.location_name, aad.AssetStatus "
    +"from AuditDetails ad "
    +"inner join AssetAuditDetails aad on ad.Id = aad.AuditId "
    +"inner join assets a on a.serial = aad.AssetSerialId "
    +"inner join location l ON l.location_id = a.location_id "
    +`where ad.Id = ${auditID}`

    let query2 = "SELECT "
    +"COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) AS FoundAssetCount, "
    +"COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) AS MissingAssetCount, "
    +"COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) AS NewAssetCount "
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

            mssql.query(query1, (err, result1) => {
                if(err) throw err;

                let assetAuditDetailsData = result1.recordset;

                mssql.query(query2, (err, result2) => {
                    if(err) throw err;

                    let assetCountData = result2.recordset;

                    res.status(200).send({
                        auditNumber, auditorName, auditStatus, locationName, scheduledStartDate, scheduledEndDate,
                        assetAuditDetailsData, assetCountData
                    });
                })
            })
        })
    }
    catch(e){
        res.status(500).send({message: "Error in fetching data"});
    }
})

module.exports = router;