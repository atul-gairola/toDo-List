const express = require("express");
const bodyParser = require("body-parser");
const date = require(`${__dirname}/date`);
//Setting Express
const app = express();
// Setting EJS
app.set("view engine", "ejs");  // Requies a folder named views inside the project directory with an ejs file
// Setting body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Setting up the statics
app.use(express.static('public'));

const items = ['First', 'Second', 'Third'];
const workItems = [];


//HANDLING GET---------------------------------------------------------
//home route
app.get("/",function(req,res){

  const day = date.getDay();

// Rendering the template
  res.render("list",{listTitle: day, newListItem: items });

});

//work route
app.get('/work', (req, res) => {
res.render('list', {listTitle: "Work Title",newListItem: workItems });
});


//HANDLING POST-----------------------------------------------------------
//home route
app.post("/",function(req,res){
 item =  req.body.newItem;

if(req.body.button === 'Work Title'){
   workItems.push(item);
   res.redirect("/work");
}else{
  items.push(item);
  res.redirect("/");
}

});


app.listen(3000,function(){
  console.log("Server started on port 3000");
});
