import App from './index';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { screen, render, fireEvent } from '@testing-library/react';
import { withProviders } from '../testUtils/providers';

const server = setupServer(
  rest.get('/data/en.json', (req, res, ctx) =>
    res(
      ctx.json({
        words: ['ALERT'],
      })
    )
  ),
  rest.get('/data/es.json', (req, res, ctx) =>
    res(
      ctx.json({
        words: ['PERNO'],
      })
    )
  )
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
    expect(screen.queryAllByTitle('emptyPlayerGuess')).toHaveLength(1);
  });

  it('Should toggle language when clicking button', async () => {
    const mockChangeLanguage = jest.fn((l) => Promise.resolve(l));
    render(
      withProviders(<App />, {
        changeLanguage: mockChangeLanguage,
      })
    );
    await screen.findByText('appTitle');

    fireEvent.click(screen.getByText('changeLanguageToText'));
    await screen.findByText('changeLanguageToText');

    expect(mockChangeLanguage).toHaveBeenCalledTimes(1);
    expect(mockChangeLanguage.mock.calls[0][0]).toEqual('es');
  });
});
