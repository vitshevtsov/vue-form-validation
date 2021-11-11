<template>
  <div class="row">
    <label :for="id">{{ label }}</label>
    <input
      class="input"
      :class="{ 'input--error': hasError }"
      type="text"
      :id="id"
      :placeholder="placeholder"
      :value="value"
      @input="inputHandler($event.target.value)"
    />
    <small class="errorText" v-if="hasError"> {{ errorText }} </small>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    label: String,
    placeholder: String,
    value: String,
    hasError: Boolean,
    errorText: String,
  },
  beforeDestroy() {
    this.$emit("input", "");
  },
  methods: {
    inputHandler(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style scoped>
.row {
  display: inline-flex;
  flex-direction: column;
  row-gap: 5px;
}

.input {
  width: 100%;
  height: 30px;
  padding: 16px 6px;
  box-sizing: border-box;
  margin: 0;
  border: 2px solid #d4d9e2;
  border-radius: 5px;
  outline: 0;
}

.input--error {
  border: 1px solid red;
}

.errorText {
  color: red;
}
</style>
