const trello = require('./trello');
const github = require('./github');
const { moveToQA, moveToCR } = trello;
const { commitToPR } = github;

exports.handler = async body => {
  const pushToGH = list => {
    const { repository: { full_name: fullName = '' }, number = null } = body;
    if (!number || !fullName) {
      console.error('Failed to get name or number from the post request');
      return null;
    }
    commitToPR(fullName, number, list);
  };
  async function moveCard(cardID, cardName) {
    await pushToGH(`Moved the card to ${cardName}`);
    const resp = `Moved ${cardID} to Code Review`;
    console.log(resp);
    return resp;
  }

  const cardID = body.pull_request.title.split('.')[0];

  if (!cardID || cardID.length < 1) {
    pushToGH(`Please create a title of the format:
      <trello_id>. Title of the PR
      `);
    return {
      msg: 'Wrong title format',
    };
  }

  let resp = 'Something went wrong';

  if (body.action === 'opened' && !body.pull_request.merged) {
    await moveToCR(cardID);
    resp = moveCard(cardID, 'Code Review');
  }

  if (body.action === 'closed' && body.pull_request.merged) {
    await moveToQA(cardID);
    resp = moveCard(cardID, 'QA');
  }

  return resp;
};
