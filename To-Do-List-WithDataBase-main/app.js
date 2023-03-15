//Reqs
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

//Req Calls

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@cluster0.t303q.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

//Server start feedback

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started");
});


//----------------------------Mongoose--------------------------------------//

//Mongoose schema
const itemsSchema = mongoose.Schema ({
  name: String
});

//Mongoose model (or a collection that follows a schema)
const Item = mongoose.model("Item", itemsSchema);

//Mongoose new documents (or adding new items in the collection)
const item1 = new Item({name: "Get groceries"});

const item2 = new Item({name: "Refuel car"});

const item3 = new Item({name: "Buy meds"});

const defaultItems = [item1, item2, item3];

//List schema and model

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

//------------------------------Routes-------------------------------------//
app.get("/", function(req, res){
  //Mongoose read
  Item.find({}, function(err, results){
    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Added succesfully.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", listItems: results});
    }
  });

});

app.get("/:newListTab", function(req, res){
  const customListName = _.capitalize(req.params.newListTab);

  List.findOne({name: customListName}, function(err, results){
    if (err) {
      console.log(err)
    } else {
      if (!results) {
        const list = new List({name: customListName, items: defaultItems});

        list.save();
        res.redirect("/" + customListName);

      } else {
        res.render("list", {listTitle: results.name, listItems: results.items});
      }
    }
  });

});

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/", function(req, res){

  const itemName = req.body.userInput;
  const listName = req.body.list;

  const item = new Item({name: itemName});

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }


});


app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully removed");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }


});
