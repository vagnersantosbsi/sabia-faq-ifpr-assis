<template>
  <nav class="navbar-container">
    <ul id="menu">
        <li><router-link to="/">Início</router-link></li>
        <li><router-link to="/ia">IA</router-link></li>
        <li><router-link to="/sobre">Devs</router-link></li>
    </ul>
  </nav>

  <router-view />
</template>

<script>
export default {
  // ...
};
</script>

