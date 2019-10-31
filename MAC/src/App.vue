<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  async created() {
    let res = await this.$axios.post({
      url: "languagelist"
    });

    console.log("res");
    console.log(res);

    this.$store.dispatch("language/setLanguageList", res.data.data);

    this.$store.dispatch(
      "language/trigglerLanguage",
      localStorage.getItem("language")
    );
  }
};
</script>