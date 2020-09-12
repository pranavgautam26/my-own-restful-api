const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});
const articlesSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = new mongoose.model("Article",articlesSchema);

app.get("/articles",function(req, res){
  Article.find({}, function(err,foundArticles){
    if(err){
      res.send(err);
    }
    else{
      res.send(foundArticles);
    }
  });
});

app.post("/articles",function(req, res){


  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully inserted a new article");
    }
  });
});

app.delete("/articles",function(req, res){
  Article.deleteMany({},function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Successfully deleted all the articles");
    }
  });
});


app.route("/articles/:articleTitle")
.get(function(req, res){

  Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No Article Matching that Title was found");
    }

  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err)
      {
        res.send("Successfully updated the Article");
      }
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated the articles");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the article");
      }
      else{
        res.send(err);
      }
    }
  );
});


app.listen(3000, function(){
  console.log("server started on port 3000");
})
