$(document).ready(function (){

 function showPosition(position) {
        console.log( position.coords.latitude , position.coords.latitude );
    
      }
    $('#getloc').click(function(){   
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          }
    });
  
});
