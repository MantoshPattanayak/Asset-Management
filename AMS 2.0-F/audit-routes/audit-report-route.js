const express = require('express');
const mssql = require('mssql');
const router = express.Router();

router.get('/submitData', (req, res) => {
  let fromDate = new Date(req.query.fromDate).toISOString();
  let toDate = new Date(req.query.toDate).toISOString();
  let employeeNumber = req.query.employeeNumber;

  let total_rows;
  let page_size = req.query.page_size;
  let page_number = req.query.page_number;
  console.log(fromDate, toDate, employeeNumber, page_number, page_size);

  let c = 1;
  let query1 = '';
  let query = '';

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
    END AS AuditorName, d.dept_name, l.location_name,
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
    END AS AuditorName, d.dept_name, l.location_name,
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
    request2.input('c',  mssql.Int, c);

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
});
module.exports = router;