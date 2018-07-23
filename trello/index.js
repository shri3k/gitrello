const fetch = require('node-fetch');

const API = 'https://api.trello.com/1';
const {
  TRELLO_API_KEY,
  TRELLO_TOKEN,
  TRELLO_QA_REVIEW_ID,
  TRELLO_CODE_REVIEW_ID,
} = process.env;

async function getListIDs(boardID) {
  let resp = '';
  let data = {};
  try {
    resp = await fetch(
      `${API}/boards/${boardID}/lists?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`,
      {
        method: 'GET',
      },
    );
    if (resp.ok) {
      data = await resp.json();
    } else {
      throw resp;
    }
  } catch (e) {
    console.log(e);
    process.exit();
  }
  return data.map(d => ({
    id: d.id,
    name: d.name,
  }));
}

module.exports = {
  getListIDs,
  moveToQA,
  moveToCR,
};

async function moveToCR(cardID) {
  return await move(cardID, TRELLO_CODE_REVIEW_ID);
}

async function moveToQA(cardID) {
  return await move(cardID, TRELLO_QA_REVIEW_ID);
}

async function move(cardID, listID) {
  let resp = '';
  let data = {};

  try {
    resp = await fetch(
      `${API}/cards/${cardID}?idList=${listID}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`,
      {
        method: 'PUT',
      },
    );
    if (!resp.ok) {
      throw resp;
    }
    data = await resp.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}
