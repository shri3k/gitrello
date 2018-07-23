const fetch = require('node-fetch');

const API = 'https://api.github.com';

const { GITHUB_TOKEN } = process.env;

module.exports = {
  commitToPR,
};

async function commitToPR(repo, number, body) {
  const repBody = JSON.stringify({ body });
  try {
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: repBody,
    };
    console.log('opts', opts);
    resp = await fetch(`${API}/repos/${repo}/issues/${number}/comments`, opts);
    if (!resp.ok) {
      throw resp;
    }
    data = await resp.json();
    return data;
  } catch (e) {
    console.log('Something is wrong');
    console.log(e);
  }
}
