import React from 'react';
import { NumberToLetterService } from './number-to-letter-service';

test('renders learn react link', () => {
  expect(NumberToLetterService.convertNumberToLetter(1)).toBe('A');
  expect(NumberToLetterService.convertNumberToLetter(4)).toBe('D');
});
