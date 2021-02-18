const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  const repositoryCreated = {
    id:uuid(),
    title,
    url,
    techs,
    likes:0
  };
  repositories.push(repositoryCreated);
  return response.send(repositoryCreated);
});
app.put("/repositories/:id", (request, response) => {
  const {title,url,techs} = request.body;
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository=>repository.id===id);

  if(repositoryIndex<0){
    return response.status(400).json({
      message:'Repository not found'
    })
  }
  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;
  return response.send(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository=>repository.id===id);
  if(repositoryIndex<0){
    return response.status(400).json({
      message:'Repository not found'
    })
  }
  repositories.splice(repositoryIndex,1);
  return response.status(204).send({message: "Repository deleted"});
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository=>repository.id===id);
  if(repositoryIndex<0){
    return response.status(400).json({
      message:'Repository not found'
    })
  }
  const currentlyLikes = repositories[repositoryIndex].likes;
  repositories[repositoryIndex].likes = currentlyLikes+1;
  return response.send(repositories[repositoryIndex]);
});

module.exports = app;
