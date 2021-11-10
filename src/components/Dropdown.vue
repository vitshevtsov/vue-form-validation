<template>
  <div class="dropdown-wrapper" v-click-outside="close">
    <div class="dropdown-toggle" @click="toggle">
      <slot name="dropdown-toggle" />
    </div>
    <div class="dropdown-items" v-show="isOpened" @click="close">
      <slot name="dropdown-items" />
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
export default {
  directives: {
    ClickOutside,
  },
  data: () => ({
    isOpened: false,
  }),
  methods: {
    toggle() {
      this.isOpened = !this.isOpened;
    },
    close() {
      this.isOpened = false;
    },
  },
};
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
}
.dropdown-toggle {
  display: inline-flex;
}
.dropdown-items {
  position: absolute;
  background-color: #ffffff;
  width: 100%;
  z-index: 1;
  padding-left: 10px;
  border: 1px solid #d4d9e2;
  max-height: 250px;
  overflow: scroll;
  overflow-x: hidden;
}
.dropdown-items::-webkit-scrollbar {
  width: 7px;
}
.dropdown-items::-webkit-scrollbar-track {
  -webkit-box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset;
  box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset;
  background-color: #f9f9fd;
  border-radius: 10px;
}
.dropdown-items::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: linear-gradient(180deg, #d4d9e2, #a3a4a8);
}
.dropdown-items *:hover {
  cursor: pointer;
  background-color: #d4d9e2;
}
</style>
