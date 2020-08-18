const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const defaultPath = "./notes/";
const chalk = require("chalk");

const loadNotes = (directory, title) => {
  try {
    const dataBuffer = fs.readFileSync(
      `${defaultPath}${directory}/${title}.json`
    );
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON); //return object
  } catch (e) {
    console.log("No such file or directory");
    //return []; //return empty array when file doesn't exist
  }
};

const listNotes = () => {
  const listing = {};
  try {
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

//const notes = listNotes();

const displayNotes = (obj) => {
  const sum = {};
  //console.log(chalk.green.inverse("Your Notes"));
  for (const [key, value] of Object.entries(obj)) {
    value.forEach((element) => {
      //strip off .json from the file name
      let g = element.substr(0, element.lastIndexOf(".")) || element;
      const x = loadNotes(`${key}`, `${g}`);

      if (x == undefined) {
        return;
      }

      if (sum[key] == undefined) {
        sum[key] = [x[0]];
      } else {
        sum[key].push(x[0]);
      }
    });
  }
  return sum;
};
//console.log(displayNotes(notes));

module.exports = { displayNotes };
