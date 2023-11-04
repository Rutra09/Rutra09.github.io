const { generateWordsToLearn } = require('./userTester');
const fs = require('fs');

describe('generateWordsToLearn', () => {
  it('should return an array of words', (done) => {
    generateWordsToLearn((err, words) => {
      expect(err).toBeNull();
      expect(Array.isArray(words)).toBe(true);
      done();
    });
  });

  it('should return an array of words with length equal to the number of words in the data file', (done) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        done.fail(err);
        return;
      }

      const jsonData = JSON.parse(data);
      const expectedLength = Object.keys(jsonData).length;

      generateWordsToLearn((err, words) => {
        expect(err).toBeNull();
        expect(words.length).toBe(expectedLength);
        done();
      });
    });
  });

  it('should return an array of words with each word having a "word" and "definition" property', (done) => {
    generateWordsToLearn((err, words) => {
      expect(err).toBeNull();
      expect(words.every((word) => word.hasOwnProperty('word') && word.hasOwnProperty('definition'))).toBe(true);
      done();
    });
  });
});