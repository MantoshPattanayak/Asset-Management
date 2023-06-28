$(document).ready(function() {
    fetchChartData(); // Fetch initial chart data
    setInterval(fetchChartData, 10000); // Update chart data every 10 seconds
  });
  
  function fetchChartData() {
    $.ajax({
      url: 'backend_endpoint_url',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        updateChart('new-audit', data.newAudit);
        updateChart('inprogress-audit', data.inprogressAudit);
        updateChart('closed-audit', data.closedAudit);
        updateChart('expired-audit', data.expiredAudit);
      },
      error: function() {
        console.log('Error occurred while fetching chart data.');
      }
    });
  }
  
  function updateChart(chartId, value) {
    const chartElement = $('#' + chartId + ' .pie-chart');
    const percentageValue = (value * 100).toFixed(2) + '%';
    chartElement.css('--p', value);
    chartElement.text(percentageValue);
  }
  

//   function updateChart(chartId, value) {
//     const chartElement = $('#' + chartId + ' .pie-chart');
//     chartElement.css('--p', value);
//     chartElement.text(value);
//   }
  

//   {
//     "newAudit": 74.32,
//     "inprogressAudit": 59.44,
//     "closedAudit": 31.95,
//     "expiredAudit": 31.95
//   }
  