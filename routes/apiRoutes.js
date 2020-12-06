var fs = require("fs");
var path = require("path");
const dbPath = path.join(__dirname, "../db/db.json");
const { v4: uuidv4 } = require('uuid');

module.exports = function(app) {
  app.get("/api/notes", function(req, res) {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data);
        res.json(data);
    });
  });

  app.post("/api/notes", function(req, res) {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        let noteList;
        if (data) {
          noteList = JSON.parse(data);
        }
        let newNote = req.body;
        newNote.id = uuidv4();
        if (noteList) {
          noteList.push(newNote);
        } else {
          noteList = [newNote];
        }
        fs.writeFile(dbPath, JSON.stringify(noteList), function(err, data) {
          if (err) throw err;
          console.log('Sucessfully created a new note! Note ID: ' + newNote.id);
          res.json(newNote);
        });
    });
  });

  app.delete("/api/notes/:id", function(req, res) {
    const noteId = req.params.id;
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        const noteList = JSON.parse(data).filter(note => note.id !== noteId);
        fs.writeFile(dbPath, JSON.stringify(noteList), err => {
            if (err) throw err;
            console.log('Note successfully deleted!');
            res.status(204).send();
        });
    });
  });
};
