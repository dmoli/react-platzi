import http from 'http';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import Pages from './pages/containers/Pages';
import Layout from './pages/components/Layout';
import messages from './messages.json';

// handler the request
function requestHandler(request, response) {
  const locale = request.headers['accept-language'].indexOf('es') >= 0 ? 'es' : 'en';

  const context = {};

  // transform render react to string, charge html of a specific route
  const html = renderToString(
    // if the equest.url is '/', then will render only this html
    <IntlProvider locale={locale} messages={messages[locale]}>
      <StaticRouter location={request.url} context={context}>
        <Pages />
      </StaticRouter>
    </IntlProvider>,
  );

  response.setHeader('Content-Type', 'text/html');

  // write component html
  response.write(
    // similar to renderToString, is for create a simple static generator
    renderToStaticMarkup(
      <Layout
        title="Aplication"
        content={html}
      />,
    ),
  );
  response.end();
}

// create a server
const server = http.createServer(requestHandler);

// server listen
server.listen(3000);
