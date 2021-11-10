<template>
  <form autocomplete="off" class="form">
    <h2>Личные данные</h2>

    <div class="subform-row">
      <my-input id="surname" label="Фамилия" v-model="formData.surname" />
      <my-input id="name" label="Имя" v-model="formData.name" />
      <my-input id="midname" label="Отчество" v-model="formData.midname" />
    </div>

    <div class="subform-row">
      <my-input
        id="date-birth"
        label="Дата рождения"
        v-model="formData.dateBirth"
        placeholder="дд.мм.гггг"
      />

      <my-input
        id="email"
        label="E-mail"
        v-model="formData.email"
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
        <!-- TODO чтобы дропдаун был открыт при любом изменении инпута -->
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
      />
      <my-input
        id="passport-rf_number"
        label="Номер паспорта"
        v-model="formData.passportRf.number"
      />
      <my-input
        id="passport-rf_issue-date"
        label="Дата выдачи"
        v-model="formData.passportRf.dateIssue"
        placeholder="дд.мм.гггг"
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
        />
        <my-input
          id="foreign_name"
          label="Имя на латинице"
          v-model="formData.passportForeign.nameLatin"
        />
      </div>
      <p>Иностранцы заполняют латинскими буквами. Например, Ivanov Ivan</p>

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
      />
      <my-input id="name-changed" label="Имя" v-model="formData.nameChanged" />
    </div>
    <button @click.prevent="onButtonClicked">Отправить</button>
  </form>
</template>

<script>
import MyInput from "./MyInput.vue";
import Dropdown from "./Dropdown.vue";
import { debounce } from "../utils/debounce.js";
import { emojiToString } from "../utils/emojiToString.js";
import citizenships from "../assets/data/citizenships.json";
import passportTypes from "../assets/data/passport-types.json";
import allCountriesRu from "../assets/data/all-countries-ru.json";
// API словаря стран: https://support.travelpayouts.com/hc/ru/articles/360018907280-%D0%94%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D0%B2-JSON-%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B5

export default {
  components: {
    MyInput,
    Dropdown,
  },
  data() {
    return {
      citizenships,
      passportTypes,
      allCountriesRu,
      countriesList: [],
      debouncedCitizenships: null,
      debouncedCountriesOfIssue: null,

      formData: {
        surname: "",
        name: "",
        midname: "",
        dateBirth: "",
        email: "",
        sex: "",
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
        isFullNameChanged: "",
        surnameChanged: "",
        nameChanged: "",
      },
    };
  },
  computed: {
    filteredCitizenships() {
      if (this.formData.citizenship) {
        return this.countriesList.filter((country) => {
          return country.indexOf(this.formData.citizenship) > -1;
        });
      } else return this.countriesList;
    },
    filteredCountriesOfIssue() {
      if (this.formData.passportForeign.country) {
        return this.countriesList.filter((country) => {
          return country.indexOf(this.formData.passportForeign.country) > -1;
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
    // записываем в countriesList названия стран на русском (по алфавиту)
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
    onButtonClicked() {
      console.log(JSON.stringify(this.formData));
    },
    getCitizenships(inputValue) {
      // console.log("fetch countries", inputValue);
      this.formData.citizenship = inputValue;
    },
    getCountriesOfIssue(inputValue) {
      this.formData.passportForeign.country = inputValue;
      console.log("fetch countries", inputValue);
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
</style>
