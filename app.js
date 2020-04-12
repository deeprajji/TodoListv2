//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Must specify item']}
});

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item({name:"Complete Course"});
const Item2 = new Item({name: "Read Book"});
const Item3 = new Item({name: "Exercise"});

const defaultItems = [Item1, Item2, Item3];
const listSchema = {
    name: String,
    items: []
};

const List = mongoose.model("List",listSchema);


/*
Item.insertMany(defaultItems, function(err){
    if (err)
        {
            console.log(err);
        }
    else {
        console.log("Success in inserting");
    }
});
*/

app.get("/", function(req, res) {



     Item.find({}, function(err, Items){
    if (err)
        { console.log(err)}
    else {
        if (Items.length=== 0){
            Item.insertMany(defaultItems, function(err){
    if (err)
        {
            console.log(err);
        }
    else {
        console.log("Success in inserting");
    }
});
            res.redirect("/");
        }
        res.render("list", {listTitle:"Today", newListItems: Items});
        console.log("Success in retrieving");
    }
});
});



app.get("/:customListName", function(req,res){
    const customListName = req.params.customListName;
    List.findOne({name:customListName}, function(err,foundList){
        if (!err){
            if(!foundList)
                    {
                    console.log("Doesn't exist!");
                    const list = new List({
                    name: customListName,
                    items:defaultItems
                    });
                    list.save();
                        res.redirect("/" + customListName);
                }
            else {
                res.render("list", {listTitle:foundList.name, newListItems: foundList.items});
            }
        }
    });
    
    
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
    
 const item = new Item({
     name:itemName
 });
    
    if (listName === "Today")  
    {
    item.save();
    res.redirect("/");
    }
    else 
    {
        List.findOne({name:listName}, function(err, foundList)
                    {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
                    })
    };

    
    
 /* if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }*/
}); 

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(err){
            console.log(err);
        };
    });
    res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});