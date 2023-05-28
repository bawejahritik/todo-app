const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    var today = new Date();
    var day = "";
    console.log(today.getDay());
    if(today.getDay() === 6 || today.getDay() === 0){
        day = "Weekend";
        res.render("list", {kindOfDay: day});
    }else{
        day = "Weekday";
        res.render("list", {kindOfDay: day});
    }
});

app.listen(3000, function(){
    console.log("Listening on port 3000");
});