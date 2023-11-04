
class SessionHolder {

  constructor(words, id ) {
    this.words = words
    this.id = id
  }

  clearSession() {
    this.words = [];
  }

  setSession(words) {
    this.words = words;
  }

}

let sessions = new Map();


function getSession(id) {
  return sessions.get(id);
}

function createSession(id, words) {
    sessions.set(id, new SessionHolder(words, id));
}

function deleteSession(id) {
    sessions.delete(id);
}

function updateSession(id, words) {
    let sess = sessions.get(id);
    sess.setSession(words);
}

module.exports = { getSession, createSession, deleteSession, updateSession, SessionHolder };
