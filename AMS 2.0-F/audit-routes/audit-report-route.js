const express = require('express');
const mssql = require('mssql');
const router = express.Router();

router.get('/submitData', (req, res) => {
  let fromDate = new Date(req.query.fromDate).toISOString();
  let toDate = new Date(req.query.toDate).toISOString();
  let employeeNumber = req.query.employeeNumber;

  let total_rows;
  let page_size = req.query.page_size || 50;
  let page_number = req.query.page_number || 1;
  console.log(fromDate, toDate, employeeNumber, page_number, page_size);

  let query1 = '';
  let query = '';

  try{
    if (employeeNumber){
      console.log("emp no");
      query1 = `SELECT count(*) AS TotalRows
      FROM AuditDetails ad 
      INNER JOIN location l ON ad.LocationId = l.location_id 
      INNER JOIN department d ON ad.DepartmentId = d.dept_id
      INNER JOIN Employees e ON e.emp_no = ad.EmployeeNo 
      WHERE CAST(ad.ScheduledStartDate as date) >= '${fromDate}' AND CAST(ad.ScheduledEndDate as Date) <= '${toDate}' AND ad.EmployeeNo = ${employeeNumber}`
  
      query = `SELECT * FROM (SELECT ad.Id, ad.EmployeeNo,
      CASE 
          WHEN e.middle_name IS NULL OR e.middle_name = '' THEN CONCAT(e.first_name, ' ', e.last_name)
          ELSE CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name)
      END AS AuditorName, d.dept_name, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS FoundAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS MissingAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS NewAssetCount,
      ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
      FROM AuditDetails ad 
      INNER JOIN location l ON ad.LocationId = l.location_id 
      INNER JOIN department d ON ad.DepartmentId = d.dept_id
      INNER JOIN Employees e ON e.emp_no = ad.EmployeeNo 
      WHERE CAST(ad.ScheduledStartDate as date) >= '${fromDate}' AND CAST(ad.ScheduledEndDate as Date) <= '${toDate}' AND ad.EmployeeNo = ${employeeNumber}) AS SubQuery
      WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
      AND RowNum <= @total_rows;
      
      SELECT @total_rows AS TotalRows`;
    }
    else{
      query1 = `SELECT count(*) AS TotalRows
      FROM AuditDetails ad 
      INNER JOIN location l ON ad.LocationId = l.location_id 
      INNER JOIN department d ON ad.DepartmentId = d.dept_id
      INNER JOIN Employees e ON e.emp_no = ad.EmployeeNo 
      WHERE CAST(ad.ScheduledStartDate as date) >= '${fromDate}' AND CAST(ad.ScheduledEndDate as Date) <= '${toDate}'`
  
      query = `SELECT * FROM (SELECT ad.Id, ad.EmployeeNo,
      CASE 
          WHEN e.middle_name IS NULL OR e.middle_name = '' THEN CONCAT(e.first_name, ' ', e.last_name)
          ELSE CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name)
      END AS AuditorName, d.dept_name, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS FoundAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS MissingAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS NewAssetCount,
      ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
      FROM AuditDetails ad 
      INNER JOIN location l ON ad.LocationId = l.location_id 
      INNER JOIN department d ON ad.DepartmentId = d.dept_id
      INNER JOIN Employees e ON e.emp_no = ad.EmployeeNo 
      WHERE CAST(ad.ScheduledStartDate as date) >= '${fromDate}' AND CAST(ad.ScheduledEndDate as Date) <= '${toDate}') AS SubQuery
      WHERE RowNum BETWEEN ((@page_number - 1) * @page_size + 1) AND (@page_number * @page_size)
      AND RowNum <= @total_rows;
      
      SELECT @total_rows AS TotalRows`;
    }
  
    let query3 = `SELECT ad.Id, ad.EmployeeNo,
    CASE 
        WHEN e.middle_name IS NULL OR e.middle_name = '' THEN CONCAT(e.first_name, ' ', e.last_name)
        ELSE CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name)
    END AS AuditorName, d.dept_name, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate,
    (SELECT COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS FoundAssetCount,
    (SELECT COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS MissingAssetCount,
    (SELECT COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS NewAssetCount,
    ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
    FROM AuditDetails ad 
    INNER JOIN location l ON ad.LocationId = l.location_id 
    INNER JOIN department d ON ad.DepartmentId = d.dept_id
    INNER JOIN Employees e ON e.emp_no = ad.EmployeeNo 
    WHERE CAST(ad.ScheduledStartDate as date) >= '${fromDate}' AND CAST(ad.ScheduledEndDate as Date) <= '${toDate}'`;
    
    let request1 = new mssql.Request();
  
    request1.query(query1, (err, result1) => {
      if (err) {
        console.log('Error in total rows of assets query:', err);
        res.sendStatus(500);
        return;
      }
      console.log('total rows response: ', result1)
      total_rows = result1.recordset[0].TotalRows;
      console.log('Total Rows:', total_rows);
  
      let request2 = new  mssql.Request();
      request2.input('total_rows', mssql.Int, total_rows);
      request2.input('page_size',  mssql.Int, page_size);
      request2.input('page_number',  mssql.Int, page_number);
  
      request2.query(query, (err, result) => {
        if (err) {
          console.log('Error in audit assets query:', err);
          res.sendStatus(500);
          return;
        }
        const data = result.recordset;
        res.status(200).send(
          {total_rows: total_rows,
          tableData: data}
        );
      });
    });
  }
  catch(e){
    res.status(500).send(e);
  }
});

router.get('/downloadAuditData', async (req, res) => {
  let fromDate = new Date(req.query.fromDate).toISOString();
  let toDate = new Date(req.query.toDate).toISOString();
  let employeeNumber = req.query.employeeNumber;

  let query = ``;

  try{
    if (employeeNumber){
      console.log("emp no");
      
      query = `SELECT ad.Id, ad.EmployeeNo,
      CASE 
          WHEN e.middle_name IS NULL OR e.middle_name = '' THEN CONCAT(e.first_name, ' ', e.last_name)
          ELSE CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name)
      END AS AuditorName, d.dept_name, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS FoundAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS MissingAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS NewAssetCount,
      ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
      FROM AuditDetails ad 
      INNER JOIN location l ON ad.LocationId = l.location_id 
      INNER JOIN department d ON ad.DepartmentId = d.dept_id
      INNER JOIN Employees e ON e.emp_no = ad.EmployeeNo 
      WHERE CAST(ad.ScheduledStartDate as date) >= '${fromDate}' AND CAST(ad.ScheduledEndDate as Date) <= '${toDate}' AND ad.EmployeeNo = ${employeeNumber}`;
    }
    else{
      query = `SELECT ad.Id, ad.EmployeeNo,
      CASE 
          WHEN e.middle_name IS NULL OR e.middle_name = '' THEN CONCAT(e.first_name, ' ', e.last_name)
          ELSE CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name)
      END AS AuditorName, d.dept_name, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS FoundAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS MissingAssetCount,
      (SELECT COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) FROM AssetAuditDetails WHERE AuditId = ad.Id) AS NewAssetCount,
      ROW_NUMBER() OVER (ORDER BY ID) AS RowNum
      FROM AuditDetails ad 
      INNER JOIN location l ON ad.LocationId = l.location_id 
      INNER JOIN department d ON ad.DepartmentId = d.dept_id
      INNER JOIN Employees e ON e.emp_no = ad.EmployeeNo 
      WHERE CAST(ad.ScheduledStartDate as date) >= '${fromDate}' AND CAST(ad.ScheduledEndDate as Date) <= '${toDate}'`;
    }

    mssql.query(query, (err, result) => {
      if(err) throw err;

      auditTableData = result.recordsets[0];
      //res.send(result);
      res.status(200).send({auditTableData: auditTableData});
    });
  }
  catch(e){
    res.status(500).send(e);
  }
});

router.get('/downloadData', async (req, res) => {
  let auditID = req.query.auditID;

  let auditFormData = '';
  let assetAuditDetails = '';
  let totalAssets = '';
  let assetStatusList = '';

  let query = `select ad.Id as AuditNumber, 
    CASE WHEN e.middle_name IS NULL OR e.middle_name = '' THEN CONCAT(e.first_name, ' ', e.last_name)
    ELSE CONCAT(e.first_name, ' ', e.middle_name, ' ', e.last_name)
    END AS AuditorName, `
    +"ad.AuditStatus, l.location_name, ad.ScheduledStartDate, ad.ScheduledEndDate, ad.ActualStartDate, ad.ActualEndDate "
    +"from AuditDetails ad "
    +"inner join location l on ad.LocationId = l.location_id "
    +"inner join department d on ad.DepartmentId = d.dept_id "
    +"inner join Employees e on ad.EmployeeNo = e.emp_no "
    +`where ad.Id = ${auditID}`

    let query1 = `select a.tag_id, a.tag_uuid, a.asset_id, a.asset_class, a.asset_type, a.asset_name,l.location_name, aad.AssetStatus,
    ROW_NUMBER() OVER (ORDER BY a.asset_id) AS RowNum from AuditDetails ad 
    inner join AssetAuditDetails aad on ad.Id = aad.AuditId
    inner join assets a on a.serial = aad.AssetSerialId 
    inner join location l ON l.location_id = a.location_id
    where ad.Id = ${auditID}`

    let query2 = "select "
    + "count(*) as TotalRows "
    +"from AuditDetails ad "
    +"inner join AssetAuditDetails aad on ad.Id = aad.AuditId "
    +"inner join assets a on a.serial = aad.AssetSerialId "
    +"inner join location l ON l.location_id = a.location_id "
    +`where ad.Id = ${auditID}`
    
    let query3 = "SELECT "
    +"COUNT(CASE WHEN AssetStatus = 'Found' THEN 1 END) AS FoundAssetCount, "
    +"COUNT(CASE WHEN AssetStatus = 'Missing' THEN 1 END) AS MissingAssetCount, "
    +"COUNT(CASE WHEN AssetStatus = 'New' THEN 1 END) AS NewAssetCount, "
    +"COUNT(*) AS TotalAssets "
    +"FROM AssetAuditDetails "
    +`WHERE AuditId = ${auditID}`

    try{
      mssql.query(query, (err, result) => {
        if(err) throw err;

        console.log('audit-form-data',result.recordset[0]);
        auditFormData = result.recordset[0];

        mssql.query(query1, (err, result1) => {
          if(err) throw err;

          assetAuditDetails = result1.recordsets[0];
          mssql.query(query2, (err, result2) => {
            if(err) throw err;

            totalAssets = result2.recordset[0].TotalRows;
            
            mssql.query(query3, (err, result3) => {
              if(err) throw err;

              assetStatusList = result3.recordset[0];
              res.status(200).send({
                auditFormData, assetAuditDetails, totalAssets, assetStatusList
              });
            })
          })
        })
      })
    }
    catch(e){
      res.status(500).send(e)
    }
})

module.exports = router;