const dotenv = require('dotenv');
const https = require('https');
dotenv.config();

const trello = require('./trello/');
process.stdin.resume();
process.stdin.setEncoding('utf8');

function askBoard(callback) {
  const { stdin } = process;
  stdin.once('data', function(text) {
    let input = text.trim();
    callback(input);
  });
}

function question1(boardID) {
  if (boardID) {
    console.log('Fetching all lists for board id', boardID);
    const trelloIDs = trello.getListIDs(boardID).then(data => {
      console.log(data);
      process.stdout.write('Fill the needed variable in .env file.');
      process.exit(0);
    });
  }
}

process.stdout.write('Enter board id: ');
askBoard(question1);

/* If multiple questions are needed */
// function question2(crID) {
//   console.log('cr', crID);
//   process.stdout.write('What is the id of the QA review list: ')
//   askBoard(question3);
// }
//
// function question3(qaID) {
//   console.log('qa', qaID);
//   console.log('Thank You');
//   process.exit(0);
// }
