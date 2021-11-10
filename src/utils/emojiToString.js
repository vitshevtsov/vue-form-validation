export function emojiToString(flag) {
  // преобразует emoji флага из файла citizenships.json в строку - буквенный код страны.
  // обратный метод:
  // flag.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0)+127397) );
  return flag.replace(/../g, (cp) =>
    String.fromCharCode(cp.codePointAt(0) - 127397)
  );
}
