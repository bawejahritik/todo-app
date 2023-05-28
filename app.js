const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items =["first", "second"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US", options);
    res.render("list", {kindOfDay: day, newListItems: items});
});

app.post("/", function(req, res){
    item = req.body.newItem;
    items.push(item);
    res.redirect("/");
    console.log(item);
})

app.listen(3000, function(){
    console.log("Listening on port 3000");
});