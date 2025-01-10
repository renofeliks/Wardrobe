<template>
    <div class="page-wrapper">
      <Header />
      <main class="content">
        <h2>Welcome to Main Page</h2>
        <p>This is the main content area.</p>
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue';
  import Footer from '../components/Footer.vue';
  
  export default {
    name: 'MainPage',
    components: {
      Header,
      Footer,
    },
  };
  </script>
  
  <style scoped>
  .page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .content {
    flex: 1;
    padding: 60px 20px 40px;
    text-align: center;
    overflow: auto;
  }
  </style>
  