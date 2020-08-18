/*jshint -W087 */
/* @flow */
/* eslint-disable react/wrap-multilines */
/* eslint-disable react/require-extension */
/* eslint-disable react/jsx-sort-prop-types */
/* eslint-disable no-debugger */
const fs =  require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const defaultPath = './notes/';
const chalk = require('chalk');


const addNote =  (directory, title, body) => {
    //const notes =  loadNotes(directory, title);
    //const duplicateNotes = notes.filter((note) => note.title === title);
    //const duplicateNote = notes.find((note) => note.title === title);
    const notes = [];
    const note = noteExist(directory, title);
        
        if (note === false) {
            notes.push({
            title: title,
            body: body
        });
        saveNotes(`${defaultPath}${directory}`, notes);
        console.log(chalk.green.inverse('New Note added!'));
        return 'New Note added';
        }else {
            console.log(chalk.bgRed('Note title taken'));
            return 'Note title taken';
        }
        }; 


const removeNotes = (directory,title) => {
    try {
        fs.unlinkSync(`${defaultPath}${directory}/${title}.json`);
        console.log(chalk.green.inverse('Note removed'));
    } catch (error) {
        console.log(chalk.bgRed('No note with the title or directory exists'));
    }
};

const deleteDir = (directory) => {
    const path = `${defaultPath}${directory}`;
    console.log(path);
        if (fs.existsSync(path)) {
          const files = fs.readdirSync(path);
      
          if (files.length > 0) {
            files.forEach(function(filename) {
              if (fs.statSync(path + "/" + filename).isDirectory()) {
                deleteDir(path + "/" + filename);
              } else {
                fs.unlinkSync(path + "/" + filename);
              }
            });
            fs.rmdirSync(path);
          } else {
            fs.rmdirSync(path);
            console.log(chalk`{green.inverse ${path}} is deleted!`);
          }
        } else {
          console.log(chalk.bgRed("Directory path not found."));
        }
};


const listNotes =  () => {
    const listing = {};
    try{
      const folders = fs.readdirSync(defaultPath);
      folders.forEach((folder) => {
        let v = fs.readdirSync(`${defaultPath}/${folder}`);
        listing[folder] = v;
      });

      
    } catch (err) {
      console.log(err);
    } 
    return listing;
  };



const readNote = (directory, title) => {
    const note = loadNotes(directory, title);
    //console.log(note);
    //const foundNote = note.find((note) => note.title === title);
    if (note){
        console.log(chalk.green.inverse(note[0].title));
        console.log(note[0].body);
    }else {
        console.log(chalk.red('No Note Found!'));
    }
};


const saveNotes = (directory, notes) => {
    console.log(directory);
    const title = notes[0].title;
    console.log(title);
    const dataJSON = JSON.stringify(notes);
    const made = mkdirp.sync(directory);
    if (made == undefined) {
      console.log(`${made} from undefined`);  
      fs.writeFileSync(`${directory}/${title}.json`, dataJSON);
    } else {
      console.log(`${made} from when it is defined`);
        fs.writeFileSync(`${made}/${title}.json`, dataJSON);
    }
    //console.log(`${made}/${title}.json`);
    
};

const loadNotes =  (directory, title) => {
    try {
        const dataBuffer =  fs.readFileSync(`${defaultPath}${directory}/${title}.json`);
        const dataJSON =  dataBuffer.toString();
        return JSON.parse(dataJSON); //return object
    } catch (e) {
        console.log('No such file or directory');
        //return []; //return empty array when file doesn't exist
    }
};

const noteExist = (directory, title) => {
    const noteName = `./notes/${directory}/${title}.json`;
    console.log(noteName);

    //check if file exists at that path
    const status = fs.existsSync(noteName);
    console.log(status);
    return status;

};

const displayNotes = (noteObj) => {
    console.log(chalk.green.inverse( 'Your Notes'));
    for (const [key, value] of Object.entries(noteObj)) {
    console.log(chalk`The folder ${key}: contain these/this file(s) ==> \n {white.inverse ${value}} \n \n`);
  }
    //console.log(Object.entries(obj));
  };


module.exports = {
    addNote: addNote,
    removeNotes: removeNotes,
    listNotes: listNotes,
    readNote: readNote,
    displayNotes: displayNotes,
    deleteDir: deleteDir
};