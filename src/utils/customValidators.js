const cyrillicAlpha = (value) => !value || /^[а-яА-ЯёЁ]+$/.test(value);
const passportSeries = (value) => !value || /^\d{4}$/.test(value);
const passportNumber = (value) => !value || /^\d{6}$/.test(value);
const dateDDMMYYYY = (value) => {
  const dateValidate = () => {
    // проверяем, что маска заполнена (используется v-mask)
    if (value.length !== 10) {
      return false;
    }
    // разбиваем строку на массив и приводим
    // к представлению  ISO 8601 ("2011-10-10")
    const dataArray = value.split(".");
    // переводим в милисек., если результат isNaN - возвращаем false
    // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#ecmascript_5_iso-8601_format_support
    const data = Date.parse(
      dataArray[2] + "-" + dataArray[1] + "-" + dataArray[0]
    );
    if (isNaN(data)) {
      return false;
    }
    // сравниваем с текущей датой
    return data > Date.now() ? false : true;
  };
  return !value || dateValidate();
};

export { cyrillicAlpha, passportSeries, passportNumber, dateDDMMYYYY };
