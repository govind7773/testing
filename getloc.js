$(document).ready(function (){
    function getCoordinates(address){
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+'&key=AIzaSyCMPZ5D9UwemIbwNxU4cf5wxF2qI3stYMM')
          .then((response) => {
            response.json().then((data)=>{
                console.log(data);
            })
            console.log(response);
          })
      }

    $('#getloctext').click(function(){
       var address= $('#textaddin').val();
       console.log(address);
       getCoordinates(address);
    });

    $('#getloc').click(function(){   
        fetch("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCMPZ5D9UwemIbwNxU4cf5wxF2qI3stYMM",
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
          response.json().then((data)=>{
              console.log(data);
          })
        //   console.log(response);
        })
        // $.ajax({
        //     url:"https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCMPZ5D9UwemIbwNxU4cf5wxF2qI3stYMM",
        //     type:"POST",
        //     header:'Content-Type: application/json',
        //     data:{"key":"AIzaSyCMPZ5D9UwemIbwNxU4cf5wxF2qI3stYMM"},
        //     success: function(res){
        //         res.json().then((data)=>{
        //             console.log(data);
        //         })
        //         // $("#ans1").text(res.ans);
        //     },
        //     error: function(req,error){
        //         console.log(error);
        //     }
        // })
    });
  
});