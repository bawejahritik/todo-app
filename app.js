const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});
const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemsSchema);

const task1 = new Item({name: "Welcome to your ToDo list!"});
const task2 = new Item({name: "Hit the + button to add a new item."});
const task3 = new Item({name: "<-- Hit this to delete an item"});

const defaultItems = [task1, task2, task3];
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){
    Item.find({}).then(function(foundItems){
        //console.log(foundItems);

        if(foundItems.length === 0){
            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully saved defult items to DB");
              }).catch(function (err) {
                console.log(err);
              });
              res.redirect("/");
        }else{
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
        
    });
    
});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({name: itemName});

    if(listName == "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    //console.log(item);
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    
    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId).then(function(err){
            if(err){
                console.log(err);
            }else{
                console.log("deleted");
            }
        })
        res.redirect("/");
    }else{
         List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function(err,foundList){
            res.redirect("/" + listName);
         });
    }


});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}).then(function(foundList){
        if(!foundList){
            //create new list
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + customListName);
        }else{
            //show existing list
            res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
    });
});


app.get("/about", function(req, res){
    res.render("about")
})

app.listen(3000, function(){
    console.log("Listening on port 3000");
});