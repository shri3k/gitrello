const trello = require('./trello');
const github = require('./github');
const { moveToQA, moveToCR } = trello;
const { commitToPR } = github;

function hasProperTitle(title) {
  const titleParts = title.split('.');
  const titleID = titleParts[1] && titleParts[0];
  return titleID && titleID.length > 1 ? titleID : false;
}

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

  let resp = 'Something went wrong';

  if (!hasProperTitle(body.pull_request.title)) {
    resp = {
      msg: 'Wrong title format',
    };
    pushToGH(`${resp}
      <trello_id>. Title of the PR
      `);
    return resp;
  }

  if (body.action === 'opened' && !body.pull_request.merged) {
    await moveToCR(cardID);
    resp = moveCard(cardID, 'Code Review');
  }

  if (body.action === 'closed' && body.pull_request.merged) {
    await moveToQA(cardID);
    resp = moveCard(cardID, 'QA');
  }

  return {
    msg: resp,
  };
};
