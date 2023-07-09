const express = require('express');
const router = express.Router();
const connection = require('../mysql');
const verifyuser = require("../middleware/verifyuser");



//get admin details 
router.get('/admin', function(req,res){
    connection.query("select * from admin_details", (err, result) =>{
        if(err){
            res.send(" Error logging in")
        }else{
            res.json({...result, success: true})
        }
    })
});


// get a list of trips from the DB 
// router.get('/trips', function(req,res){
    
//     const destination = req.query.destination
//     const maxPrice = req.query.maxPrice
//     const date = req.query.date
//     console.log(destination)
//     connection.query("select * from trips where country =?",[destination] , (err,result)=>{
// 			if(err){res.send("error in the connection")}
//         else{res.send(result)}
// })	
// });

router.get('/trips', function(req,res){
    
    const destination = req.query.destination
    const maxPrice = req.query.maxPrice
    const date = req.query.date?new Date(req.query.date):null
    console.log(destination)
  
  let searchAttrs = {
    country:destination,
    average_budget: maxPrice,
    trip_date:date,
  };
  for(let key in searchAttrs){
    if(!searchAttrs[key]){
        delete searchAttrs[key]
    }
  }
    connection.query(`select * from trips where ${Object.keys(searchAttrs).map(key=>`${key}=?`).join(" and ")}`,Object.values(searchAttrs).map(value=>value) , (err,result)=>{
      if(err){res.send("error in the connection")}
        else{res.send(result)}
  })	
  });

//Get a trip by ID 
router.get('/trip/:id', function(req,res){
    let tripID = req.params.id
    connection.query('SELECT * FROM trips where tripID = ?' ,tripID, (err, result)=> {
        if(err)throw err;
        else{res.send(result)}
    })
});


// Delete a trip 
router.delete('/trip/:id', function(req,res){
    let tripID = req.params.id
    console.log(req.params)

    connection.query('delete from trips where tripID = ?' , tripID , (err, result)=>{
        if(err)throw err;
        else{res.send({ error: false, data: result})}
    })
});


// add a new trip 
router.post('/trip', (req, res)=>{
    console.log(req.body);
    // const tripID = req.params.tripID;
    const photo_url = req.body.photo_url ;
    const country = req.body.country;
    const city = req.body.city;
    const average_budget = req.body.average_budget;
    const trip_date = new Date(req.body.trip_date);
    const accomdation_fees = req.body.accomdation_fees;
    const travel_fees = req.body.travel_fees;
    const tour_fees = req.body.tour_fees  ;
    connection.query("INSERT INTO trips (photo_url,country,city,average_budget,trip_date,accomdation_fees,travel_fees,tour_fees) values(?,?,?,?,?,?,?,?)",[photo_url,country,city,average_budget,trip_date,accomdation_fees,travel_fees,tour_fees],(err,result )=>{
        if (err){
            console.log(err)
        }else{
            res.send("Posted succesfully")
        }

    });
       
}) ; 


// update any detail of the trip
router.put('/trip/:id',function(req,res){
    let id = req.params.id
    const photo_url = req.body.photo_url ;
    const country = req.body.country;
    const city = req.body.city;
    const average_budget = req.body.average_budget;
    const trip_date = req.body.trip_date?new Date(req.body.trip_date).toISOString().slice(0, 19).replace('T', ' '):null ;             
    const accomdation_fees = req.body.accomdation_fees;
    const travel_fees = req.body.travel_fees;
    const tour_fees = req.body.tour_fees  ;
    let updatedValues = {
        photo_url,
        country,
        city,
        average_budget,
        trip_date,
        accomdation_fees,
        travel_fees,
        tour_fees
    };

    for(let key in updatedValues){
        if(!updatedValues[key]){
            delete updatedValues[key]
        }
    }


    console.log(`update trips set ${Object.keys(updatedValues).map(key=> `${key} = ${updatedValues[key]}`).join(",")}   tripID = ?`, id)
    connection.query(`update trips set ${Object.keys(updatedValues).map(key=> `${key} = "${ updatedValues[key]}"`).join(" , ")}  where tripID = ?`, [id*1 ],(err, result)=> {
        if(err)throw err;
        else{connection.query('SELECT * FROM trips where tripID = ?' ,id, (err, result)=> {
            if(err){res.send("error in the connection")}
            else{res.send(result)}})}
})
})




// to be able to use the API in the index file 
module.exports = router;