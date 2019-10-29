<template>
  <div id="app">
    <HomePage></HomePage>
  </div>
</template>

<script>
import HomePage from "./components/HomePage";

export default {
  name: 'app',
  components: {
    HomePage
  }
};
</script>

<style>

div#app {
  width: 100%;
  height: 100%;
}

body {
  font: 1.5em Geneva, sans-serif;
  background-color: black;
  color: whitesmoke;
}

@media only screen and (max-width: 600px) { /* mobile view */
  body {
    margin: 2rem 1rem 2rem 1rem;
  }

  section.centre-column {
    width: 95%;
  }
}

@media only screen and (min-width: 600px) { /* desktop view */
  body {
    margin: 4rem 2rem 4rem 2rem;
  }

  section.centre-column {
    width: 75%;
  }
}
section.centre-column {
  padding-left: 1rem;
  margin: auto; /* horizontally centre it */
  border-left: 2px whitesmoke dashed;
}

hr.column-break {
  border-top: 3px solid whitesmoke;
  margin: 3rem auto 3rem auto;
  width: 80%;
}

</style>
