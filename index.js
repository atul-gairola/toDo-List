const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(`${__dirname}/date`);
const _ = require('lodash');
//Setting Express
const app = express();
// Setting EJS
app.set("view engine", "ejs"); // Requies a folder named views inside the project directory with an ejs file
// Setting body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));
// Setting up the statics
app.use(express.static('public'));

// const items = ['First', 'Second', 'Third'];
// const workItems = [];                                  DELETE THIS LATER

mongoose.connect('mongodb://localhost:27017/todoListDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = {
  name: String
};

const Item = mongoose.model('item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your to-do list'
});

const item2 = new Item({
  name: '+ to add items'
});

const item3 = new Item({
  name: '<< checkbox to delete items'
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model('List', listSchema)

//HANDLING GET---------------------------------------------------------
//home route
app.get("/", function(req, res) {

  const day = date.getDay();

  Item.find({}, (err, i) => {
    if (err) {
      console.log(err);
    } else {

        res.render("list", {
          listTitle: day,
          newListItem: i
        });

    }
  });



});


app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({  name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {

        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect(`/${customListName}`);

      } else {

        res.render('list',{listTitle: foundList.name , newListItem: foundList.items } )

      }
    }
  });


});

//HANDLING POST-----------------------------------------------------------
//home route
app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const day = date.getDay();

  const item = new Item({
    name: itemName
  });

if(_.lowerCase(listName) === _.lowerCase(day) ){
  item.save();
  res.redirect('/');
}else{
  List.findOne({name: listName}, (err, foundList) => {
    foundList.items.push(item);
    foundList.save();
    res.redirect(`/${listName}`);
  });
}


});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

    const day = date.getDay();

  if(listName === day){
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully deleted checked item');
        res.redirect('/');
      }
    });
  }else{
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err)=> {
        if(!err){
          res.redirect(`/${listName}`)
        }
      } );
  }


});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
