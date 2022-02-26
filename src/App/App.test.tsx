import App from './index';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { screen, render, waitFor } from '@testing-library/react';
import { withProviders } from '../testUtils/providers';

const server = setupServer(
  rest.get('/data/en.json', (req, res, ctx) => {
    return res(
      ctx.json({
        words: ['ALERT'],
      })
    );
  })
);

describe('App component', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Should render a default app', async () => {
    render(withProviders(<App />));
    expect(screen.queryAllByTitle('loading')).toHaveLength(1);

    await screen.findByText('appTitle');
    expect(screen.queryAllByText('appTitle')).toHaveLength(1);
    expect(screen.queryAllByText('viewOnGithub')).toHaveLength(1);
  });
});
