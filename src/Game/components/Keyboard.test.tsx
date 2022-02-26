import { fireEvent, render, screen } from '@testing-library/react';
import { Key, Keyboard } from './Keyboard';

import Styles from './Keyboard.module.css';
import { withI18n } from '../../testUtils/providers';

describe('Key component', () => {
  const baseProps = {
    value: 'a',
    label: 'ALabel',
    onClick: jest.fn(),
  };

  it('Should render a button with the label as text', () => {
    render(<Key {...baseProps} />);

    const btn = screen.getByText(/ALabel/i);
    expect(btn.tagName.toLowerCase()).toEqual('button');
    expect(btn.classList.contains(Styles.key)).toEqual(true);
  });

  it('Should assign status classes properly', async () => {
    render(<Key {...baseProps} isFound isNotFound isCorrect />);
    let btn = screen.getByText(/ALabel/i);
    expect(btn.classList.contains(Styles.found)).toEqual(true);
    expect(btn.classList.contains(Styles.notFound)).toEqual(true);
    expect(btn.classList.contains(Styles.correct)).toEqual(true);
  });

  it('Should assign the proper class to the ENTER key', () => {
    render(<Key {...baseProps} value="ENTER" label="enter" />);
    let btn = screen.getByText(/enter/i);
    expect(btn.classList.contains(Styles.enter)).toEqual(true);
  });

  it('Should assign the proper class to the BACKSPACE key', () => {
    render(<Key {...baseProps} value="BACKSPACE" label="backspace" />);
    let btn = screen.getByText(/backspace/i);
    expect(btn.classList.contains(Styles.backspace)).toEqual(true);
  });

  it('should trigger the onClick prop when clicked and pass the value prop as argument', () => {
    const onClick = jest.fn();
    render(
      <Key {...baseProps} value="ENTER" label="enter" onClick={onClick} />
    );

    fireEvent(
      screen.getByText(/enter/i),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('ENTER');
  });
});

describe('Keyboard component', () => {
  const baseProps = {
    onKeyPress: jest.fn(),
    plays: [],
    selectedWord: 'HELLO',
  };

  it('Should render a default keyboard', () => {
    render(withI18n(<Keyboard {...baseProps} />));
    const keys = screen.getAllByRole('button');
    expect(keys.length).toBeGreaterThan(0);
  });

  it('Should should add found classes when plays contains correct letters', () => {
    const plays = [['A', 'L', 'E', 'R', 'T']];
    const selectedWord = 'LATER';
    render(
      withI18n(
        <Keyboard {...baseProps} plays={plays} selectedWord={selectedWord} />
      )
    );

    [
      screen.getByText('a'),
      screen.getByText('l'),
      screen.getByText('e'),
      screen.getByText('r'),
      screen.getByText('t'),
    ].forEach((el) => {
      expect(el.classList.contains(Styles.found)).toEqual(true);
    });
  });

  it('Should should add notFound classes letter is not found', () => {
    const plays = [['Q', 'W', 'S', 'C', 'V']];
    const selectedWord = 'LATER';
    render(
      withI18n(
        <Keyboard {...baseProps} plays={plays} selectedWord={selectedWord} />
      )
    );

    [
      screen.getByText('q'),
      screen.getByText('w'),
      screen.getByText('s'),
      screen.getByText('c'),
      screen.getByText('v'),
    ].forEach((el) => {
      expect(el.classList.contains(Styles.notFound)).toEqual(true);
    });
  });

  it('Should should add correct classes letter is totally correct', () => {
    const plays = [['A', 'L', 'E', 'R', 'T']];
    const selectedWord = 'ALERT';
    render(
      withI18n(
        <Keyboard {...baseProps} plays={plays} selectedWord={selectedWord} />
      )
    );

    [
      screen.getByText('a'),
      screen.getByText('l'),
      screen.getByText('e'),
      screen.getByText('r'),
      screen.getByText('t'),
    ].forEach((el) => {
      expect(el.classList.contains(Styles.correct)).toEqual(true);
    });
  });
});
