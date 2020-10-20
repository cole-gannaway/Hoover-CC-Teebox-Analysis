export class NumberToLetterService {
  public static convertNumberToLetter(val: number) {
    return (val + 9).toString(36).toUpperCase();
  }
}
