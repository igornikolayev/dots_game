<template>
  <div class="home">
    <GameField />
  </div>
</template>

<script>
// @ is an alias to /src
import GameField from "@/components/GameField.vue";

export default {
  name: "home",
  components: {
    GameField
  }
};
</script>
