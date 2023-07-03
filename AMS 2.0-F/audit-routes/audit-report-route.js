const express = require('express');
const mssql = require('mssql');
const fs = require('fs');
const { Parser } = require('json2csv');
const path = require('path');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const router = express.Router();

router.post('/submitData', (req, res) => {
    console.log('req.body', req.body);
    // console.log('From:', req.body.fromDate);
    // console.log('To:', req.body.toDate);
    // console.log('Audit:', req.body.auditNumber);

    const fromDate =new Date(req.body.fromDate);
    const toDate = new Date(req.body.toDate);
    const auditnumber = req.body.auditNumber;
    const fontSize = req.body.fontSize || 12;
    const fontStyle = req.body.fontStyle || 'normal';

    console.log('From:', fromDate);
    console.log('To:', toDate);
    console.log('Audit:', auditnumber);
    
    // Generate CSV data
    const fields = ['Asset ID', 'Tag ID', 'Tag UUID', 'Asset Name', 'Asset Type', 'Scanned On', 'Asset Status'];
    const data = [
      { 'From': fromDate, 'To': toDate },
      {'Asset ID':'DataRow1', 'Tag ID':'DataRow1', 'Tag UUID':'DataRow1', 'Asset Name':'DataRow1', 'Asset Type':'DataRow1', 'Scanned On':'DataRow1', 'Asset Status':'DataRow1'},
      {'Asset ID':'DataRow2', 'Tag ID':'DataRow2', 'Tag UUID':'DataRow2', 'Asset Name':'DataRow2', 'Asset Type':'DataRow2', 'Scanned On':'DataRow2', 'Asset Status':'DataRow2'}
    ];
  
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
  
    // Write CSV data to file
    fs.writeFileSync('data.csv', csv);
  
    // Generate PDF data
    const doc = new jsPDF();
  
    // Add additional data
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle, 'bold');
  
    doc.text(`Audit Number:  ${auditnumber}                                                     Location Name:      .....................`, 20, 45);
    doc.text(`Auditor Name:  .................                                             Department Name:  .....................`, 20, 55);
    doc.text(`Start Date: ${fromDate}                                                    End Date:    ${toDate}`, 20, 65);
    //doc.text(`To: ${toDate}`, 20, 50);
    //doc.text('Additional Data:', 20, 60);
    //doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 20, 70);
  
    doc.setFont('helvetica', fontStyle, 'bold');
    doc.setFontSize(fontSize+5);
    doc.setTextColor('#006400'); // Set the text color to red
    doc.text('Audit Report', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
    //doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 20, 10);
  
    const tableData = [
      ['Asset ID', 'Tag ID', 'Tag UUID', 'Asset Name', 'Asset Type', 'Scanned On', 'Asset Status'],
      ['DataRow1', 'DataRow1', 'DataRow1', 'DataRow1', 'DataRow1', 'DataRow1', 'DataRow1'],
      ['DataRow2', 'DataRow2', 'DataRow2', 'DataRow2', 'DataRow2', 'DataRow2', 'DataRow2'],
      ['DataRow3', 'DataRow3', 'DataRow3', 'DataRow3', 'DataRow3', 'DataRow3', 'DataRow3'],
    ];
  
    doc.autoTable({
      head: tableData.slice(0, 1),
      body: tableData.slice(1),
      startY: 70,
      styles: {
        cellPadding: 5,
        fontSize: fontSize,
        fontStyle: fontStyle
      },
      headStyles: {
        fillColor: '#CCCCCC',
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold' }
      }
    });
  
    // Additional user settings
    doc.setProperties({
      title: 'Data Report',
      subject: 'From-To Dates',
      author: 'Your Name',
      keywords: 'data, report, from, to',
      creator: 'Your Organization'
    });
  
    // Write PDF data to file
    const filePath = path.join(__dirname, 'public', 'data.pdf');
    doc.save(filePath);
  
    res.sendStatus(200);
  });
  
router.get('/downloadCSV', (req, res) => {
const file = `${__dirname}/data.csv`;
res.download(file);
});
  
router.get('/downloadPDF', (req, res) => {
const filePath = path.join(__dirname, 'public', 'data.pdf');
res.download(filePath, 'data.pdf', (err) => {
    if (err) {
    console.log('Error downloading PDF file:', err);
    res.sendStatus(500);
    }
});
});

module.exports = router;