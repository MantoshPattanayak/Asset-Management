//excelsheet download
var people = [
    { user_id:'', first_name: '', middle_name : '',last_name : '',email   : '', password   : '', user_type   : '',Parent_org:   ''}
  
  ];
  
  function createCSV(array) {
    var keys = Object.keys(array[0]); //Collects Table Headers
  
    var result = ''; //CSV Contents
    result += keys.join(','); //Comma Seperates Headers
    result += '\n'; //New Row
  
    array.forEach(function (item) { //Goes Through Each Array Object
      keys.forEach(function (key) {//Goes Through Each Object value
        result += item[key] + ','; //Comma Seperates Each Key Value in a Row
      })
      result += '\n';//Creates New Row
    })
  
    return result;
  }
  
  function downloadCSV(array) {
    csv = 'data:text/csv;charset=utf-8,' + createCSV(array); //Creates CSV File Format
    excel = encodeURI(csv); //Links to CSV 
  
    link = document.createElement('a');
    link.setAttribute('href', excel); //Links to CSV File 
    link.setAttribute('download', 'multiuser.csv'); //Filename that CSV is saved as
    link.click();
  }




  //ajax part

  $(document).ready(function() {
    $('#uploadBtns').on('click', function(e) {
      e.preventDefault();
      
      var fileInput = $('#uploadFile')[0];
      var file = fileInput.files[0];

      if (file) {
        var formData = new FormData();
        formData.append('uploadFile', file);
        $.ajax({
          url: 'http://localhost:3000/userupload',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(response) {
            // $('#mess').text(response);
            // document.write(response+"<br/>");
            // setTimeout(function(){
            //   document.getElementsByClassName("mess")[0].innerHTML = response;
            // },500000);
            
            
         
            alert(response);
          },
          error: function(error) {
            $('#mess').text('Error uploading file.');
          }
        });
    }
    });
  });
  

//   function refreshPage() {
//     location.reload(true);
// }