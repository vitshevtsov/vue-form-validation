<template>
  <form autocomplete="off" class="form" @submit.prevent="onSubmitForm">
    <h2>Личные данные</h2>

    <div class="subform-row">
      <my-input
        id="surname"
        label="Фамилия"
        v-model.trim="formData.surname"
        :hasError="$v.formData.surname.$error"
        :errorText="'Укажите фамилию на кириллице'"
      />
      <my-input
        id="name"
        label="Имя"
        v-model.trim="formData.name"
        :hasError="$v.formData.name.$error"
        :errorText="'Укажите имя на кириллице'"
      />
      <my-input
        id="midname"
        label="Отчество"
        v-model.trim="formData.midname"
        :hasError="$v.formData.midname.$error"
        :errorText="'Укажите отчество на кириллице'"
      />
    </div>

    <div class="subform-row">
      <my-input
        id="date-birth"
        label="Дата рождения"
        v-model="formData.dateBirth"
        :hasError="$v.formData.dateBirth.$error"
        :errorText="'Укажите валидную дату (не позднее текущей)'"
        placeholder="дд.мм.гггг"
        v-mask="'##.##.####'"
      />

      <my-input
        id="email"
        label="E-mail"
        v-model="formData.email"
        :hasError="$v.formData.email.$error"
        :errorText="'Укажите валидный email-адрес'"
        placeholder="example@email.com"
      />
    </div>

    <h3>Пол</h3>
    <div class="subform-row">
      <input
        type="radio"
        id="sex-choice-1"
        name="sex"
        value="male"
        v-model="formData.sex"
      />
      <label for="sex-choice-1">Мужской</label>

      <input
        type="radio"
        id="sex-choice-2"
        name="sex"
        value="female"
        v-model="formData.sex"
      />
      <label for="sex-choice-2">Женский</label>
    </div>

    <h2>Паспортные данные</h2>

    <div class="row">
      <dropdown>
        <template #dropdown-toggle>
          <my-input
            id="citizenship"
            label="Гражданство"
            :value="formData.citizenship"
            @input="debouncedCitizenships"
          />
        </template>
        <template #dropdown-items>
          <div
            v-for="item in filteredCitizenships"
            :key="item + countriesList.indexOf(item)"
            class="dropdown-item"
            @click="selectedCitizenship(item)"
          >
            {{ item }}
          </div>
        </template>
      </dropdown>
    </div>

    <div
      class="passport-rf subform-row"
      v-if="formData.citizenship === 'Россия'"
    >
      <my-input
        id="passport-rf_series"
        label="Серия паспорта"
        v-model="formData.passportRf.series"
        :hasError="$v.formData.passportRf.series.$error"
        :errorText="'Укажите 4 цифры'"
        placeholder="1111"
        v-mask="'####'"
      />
      <my-input
        id="passport-rf_number"
        label="Номер паспорта"
        v-model="formData.passportRf.number"
        :hasError="$v.formData.passportRf.number.$error"
        :errorText="'Укажите 6 цифр'"
        placeholder="111111"
        v-mask="'######'"
      />
      <my-input
        id="passport-rf_issue-date"
        label="Дата выдачи"
        v-model="formData.passportRf.dateIssue"
        :hasError="$v.formData.passportRf.dateIssue.$error"
        :errorText="'Укажите валидную дату (не позднее текущей)'"
        placeholder="дд.мм.гггг"
        v-mask="'##.##.####'"
      />
    </div>

    <div
      class="passport-foreign"
      v-if="
        formData.citizenship !== 'Россия' && formData.citizenship !== undefined
      "
    >
      <div class="subform-row">
        <my-input
          id="foreign_surname"
          label="Фамилия на латинице"
          v-model="formData.passportForeign.surnameLatin"
          :hasError="$v.formData.passportForeign.surnameLatin.$error"
          :errorText="'Укажите фамилию на латинице'"
        />
        <my-input
          id="foreign_name"
          label="Имя на латинице"
          v-model="formData.passportForeign.nameLatin"
          :hasError="$v.formData.passportForeign.nameLatin.$error"
          :errorText="'Укажите имя на латинице'"
        />
      </div>
      <small class="small-row"
        >Иностранцы заполняют латинскими буквами. Например, Ivanov Ivan</small
      >

      <div class="subform-row">
        <my-input
          id="passport-foreign_number"
          label="Номер паспорта"
          v-model="formData.passportForeign.number"
        />

        <div class="row">
          <dropdown>
            <template #dropdown-toggle>
              <my-input
                id="passport-foreign_country"
                label="Страна выдачи"
                :value="formData.passportForeign.country"
                @input="debouncedCountriesOfIssue"
              />
            </template>
            <template #dropdown-items>
              <div
                v-for="item in filteredCountriesOfIssue"
                :key="item + countriesList.indexOf(item)"
                class="dropdown-item"
                @click="selectedCountry(item)"
              >
                {{ item }}
              </div>
            </template>
          </dropdown>
        </div>

        <div class="row">
          <dropdown>
            <template #dropdown-toggle>
              <my-input
                id="passport-foreign_type"
                label="Тип паспорта"
                v-model="formData.passportForeign.type"
              />
            </template>
            <template #dropdown-items>
              <div
                v-for="item in passportTypes"
                :key="item.id"
                class="dropdown-item"
                @click="selectedPassportType(item)"
              >
                {{ item.type }}
              </div>
            </template>
          </dropdown>
        </div>
      </div>
    </div>

    <h3>Меняли ли фамилию или имя?</h3>
    <div class="subform-row">
      <input
        type="radio"
        id="is-fullname-changed-choice-1"
        name="is-fullname-changed"
        value="false"
        v-model="formData.isFullNameChanged"
      />
      <label for="is-fullname-changed-choice-1">Нет</label>

      <input
        type="radio"
        id="is-fullname-changed-choice-2"
        name="is-fullname-changed"
        value="true"
        v-model="formData.isFullNameChanged"
      />
      <label for="is-fullname-changed-choice-2">Да</label>
    </div>

    <div class="subform-row" v-if="showFullNameChanged">
      <my-input
        id="surname-changed"
        label="Фамилия"
        v-model="formData.surnameChanged"
        :hasError="$v.formData.surnameChanged.$error"
        :errorText="'Укажите фамилию на кириллице'"
      />
      <my-input
        id="name-changed"
        label="Имя"
        v-model="formData.nameChanged"
        :hasError="$v.formData.nameChanged.$error"
        :errorText="'Укажите фамилию на кириллице'"
      />
    </div>
    <button type="submit" class="btn">Отправить</button>
  </form>
</template>

<script>
import MyInput from "./MyInput.vue";
import Dropdown from "./Dropdown.vue";
import { VueMaskDirective } from "v-mask";
import { validationMixin } from "vuelidate";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import { email, alpha, required, requiredIf } from "vuelidate/lib/validators";
import {
  cyrillicAlpha,
  passportSeries,
  passportNumber,
  dateDDMMYYYY,
} from "../utils/customValidators.js";
import { debounce } from "../utils/debounce.js";
import { emojiToString } from "../utils/emojiToString.js";
import citizenships from "../assets/data/citizenships.json";
import passportTypes from "../assets/data/passport-types.json";
import allCountriesRu from "../assets/data/all-countries-ru.json";
// API словаря стран: https://support.travelpayouts.com/hc/ru/articles/360018907280-%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D0%B2-JSON-%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B5

const formData = {
  surname: "",
  name: "",
  midname: "",
  dateBirth: "",
  email: "",
  sex: "male",
  citizenship: undefined,

  passportRf: {
    series: "",
    number: "",
    dateIssue: "",
  },

  passportForeign: {
    surnameLatin: "",
    nameLatin: "",
    number: "",
    country: "",
    type: "",
  },
  isFullNameChanged: false,
  surnameChanged: "",
  nameChanged: "",
};

export default {
  components: {
    MyInput,
    Dropdown,
  },
  mixins: [validationMixin],
  data() {
    return {
      citizenships,
      passportTypes,
      allCountriesRu,
      countriesList: [],
      debouncedCitizenships: null,
      debouncedCountriesOfIssue: null,
      formData,
    };
  },
  computed: {
    filteredCitizenships() {
      if (this.formData.citizenship) {
        return this.countriesList.filter((country) => {
          return (
            country
              .toLowerCase()
              .indexOf(this.formData.citizenship.toLowerCase()) > -1
          );
        });
      } else return this.countriesList;
    },
    filteredCountriesOfIssue() {
      if (this.formData.passportForeign.country) {
        return this.countriesList.filter((country) => {
          return (
            country
              .toLowerCase()
              .indexOf(this.formData.passportForeign.country.toLowerCase()) > -1
          );
        });
      } else return this.countriesList;
    },
    showFullNameChanged() {
      return this.formData.isFullNameChanged === "true";
    },
  },
  created() {
    // создаем массив emoji-флагов из файла citizenships.json
    const countryCodesEmoji = [];
    citizenships.forEach((item) => {
      if (item.flag) {
        countryCodesEmoji.push(item.flag);
      }
    });
    // преобразуем флаги в строковые значения для последующего маппинга со списком стран
    const countryCodesString = countryCodesEmoji.map((flag) =>
      emojiToString(flag)
    );
    // записываем в countriesList названия стран на русском
    // (выходит на 2 страны меньше, чем в исходнике, ввиду повторов в citizenships.json)
    allCountriesRu.forEach((country) => {
      if (country.code) {
        if (countryCodesString.includes(country.code)) {
          this.countriesList.push(country.name);
        }
      }
    });
    // Сортируем список стран и записываем дебаунс в переменную-обработчик инпута
    this.countriesList.sort();
    this.debouncedCitizenships = debounce(this.getCitizenships, 500);
    this.debouncedCountriesOfIssue = debounce(this.getCountriesOfIssue, 500);
  },
  methods: {
    selectedCitizenship(item) {
      this.formData.citizenship = item;
    },
    selectedCountry(item) {
      this.formData.passportForeign.country = item;
    },
    selectedPassportType(item) {
      this.formData.passportForeign.type = item.type;
    },
    onSubmitForm() {
      console.log("Here comes the Submit!");
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("Please fill correctly red-marked fields");
      } else {
        console.log(JSON.stringify(omitBy(this.formData, isEmpty)));
      }
    },
    getCitizenships(inputValue) {
      this.formData.citizenship = inputValue;
    },
    getCountriesOfIssue(inputValue) {
      this.formData.passportForeign.country = inputValue;
    },
  },
  directives: {
    mask: VueMaskDirective,
  },
  validations: {
    formData: {
      surname: {
        cyrillicAlpha,
        required,
      },
      name: {
        cyrillicAlpha,
        required,
      },
      midname: {
        cyrillicAlpha,
        required,
      },
      dateBirth: {
        dateDDMMYYYY,
        required,
      },
      email: {
        email,
        required,
      },

      passportRf: {
        series: {
          passportSeries,
          required: requiredIf(function () {
            return this.formData.citizenship === "Россия";
          }),
        },
        number: {
          passportNumber,
          required: requiredIf(function () {
            return this.formData.citizenship === "Россия";
          }),
        },
        dateIssue: {
          dateDDMMYYYY,
          required: requiredIf(function () {
            return this.formData.citizenship === "Россия";
          }),
        },
      },

      passportForeign: {
        surnameLatin: {
          alpha,
          required: requiredIf(function () {
            return (
              this.formData.citizenship !== "Россия" &&
              this.formData.citizenship !== undefined
            );
          }),
        },
        nameLatin: {
          alpha,
          required: requiredIf(function () {
            return (
              this.formData.citizenship !== "Россия" &&
              this.formData.citizenship !== undefined
            );
          }),
        },
      },

      surnameChanged: {
        cyrillicAlpha,
        required: requiredIf(function () {
          return this.formData.isFullNameChanged === "true";
        }),
      },
      nameChanged: {
        cyrillicAlpha,
        required: requiredIf(function () {
          return this.formData.isFullNameChanged === "true";
        }),
      },
    },
  },
};
</script>

<style scoped>
.form {
  display: inline-flex;
  flex-direction: column;
  row-gap: 20px;
  padding: 10px;
}
.subform-row {
  display: flex;
  width: 100%;
  column-gap: 20px;
}
.row {
  display: inline-flex;
}
.small-row {
  display: inline-block;
  margin-bottom: 20px;
  margin-top: 10px;
}
.btn {
  display: flex;
  margin: auto;
  max-width: 165px;
  height: 40px;
  padding: 20px;
  align-items: center;
  background-color: #a3a4a8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn:hover {
  background-color: #5e5e63;
  color: white;
}
</style>
