const http = require('http');
const { detectCase } = require('./convertToCase/detectCase');
const { toWords } = require('./convertToCase/toWords');
const { wordsToCase } = require('./convertToCase/wordsToCase');
const DEFAULT_PORT = process.env.PORT;

function createServer(port = DEFAULT_PORT) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const originalCase = detectCase(url.pathname.slice(1));
    const originalText = url.pathname.slice(1);
    const targetCase = url.searchParams.get('toCase');
    const supportedCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

    const errorMessages = {
      textMissing:
        'Text to convert is required. Correct request is: ' +
        '"/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      queryMissing:
        '"toCase" query param is required. Correct request is: ' +
        '"/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      caseNotSupported:
        'This case is not supported. Available cases: ' +
        'SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
    };

    res.setHeader('Content-Type', 'application/json');

    const errors = [];

    if (!originalText) {
      errors.push({ message: errorMessages.textMissing });
    }

    if (!targetCase) {
      errors.push({ message: errorMessages.queryMissing });
    }

    if (targetCase && !supportedCases.includes(targetCase)) {
      errors.push({ message: errorMessages.caseNotSupported });
    }

    if (errors.length > 0) {
      res.statusCode = 400;
      res.statusMessage = 'Bad Request';
      res.write(JSON.stringify({ errors }));
      res.end();

      return;
    }

    const response = {
      originalCase: originalCase,
      targetCase: targetCase,
      originalText: originalText,
      convertedText: wordsToCase(
        toWords(originalText, originalCase),
        targetCase,
      ),
    };

    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.write(JSON.stringify(response));
    res.end();
  });

  return server;
}

module.exports = { createServer, DEFAULT_PORT };
