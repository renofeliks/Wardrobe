<template>
    <div class="page-wrapper">
      <Header />
      <main class="content">
        <div class="menu">
          <button @click="filterClothes('Tops')">Tops</button>
          <button @click="filterClothes('Bottoms')">Bottoms</button>
          <button @click="filterClothes('Shoes')">Shoes</button>
          <button @click="filterClothes('All')">Show All</button>
        </div>

        <div class="clothes-grid">
          <div v-for="item in filteredClothes" :key="item.id" class="clothing-item">
            <img :src="item.image" :alt="item.name" />
            <p>{{ item.name }}</p>
            <p>{{ item.type }}</p>
            <ul>
              <li v-for="(tag, index) in item.tags" :key="index">{{ tag }}</li>
            </ul>
            <button @click="removeClothing(item.id)" id="removeClothing">Remove</button>
          </div>
        </div>

        <div class="add-item-form">
          <input v-model="newClothing.name" placeholder="Name" />
          <input v-model="newClothing.type" placeholder="Type" />
          <input type="file" @change="handleImageUpload" />
          
          <div>
            <input v-model="newTag" placeholder="Add a tag" @keyup.enter="addTag" />
            <button @click="addTag">Add Tag</button>
            <ul>
              <li v-for="(tag, index) in newClothing.tags" :key="index">
                {{ tag }} <button @click="removeTag(index)">x</button>
              </li>
            </ul>
          </div>

          <button @click="addClothingPiece">Add Clothing</button>
        </div>
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue';
  import Footer from '../components/Footer.vue';
  
  export default {
    name: 'WardRobe',
    components: {
      Header,
      Footer,
    },
    data() {
      return {
        clothes: [],
        newClothing: {
          name: '',
          type: '',
          image: null,
          tags: [],
        },
        newTag: '',
        selectedType: 'All',
      };
    },
    computed: {
      filteredClothes() {
        if (this.selectedType === 'All') {
          return this.clothes;
        }
        return this.clothes.filter(item => item.type === this.selectedType);
      },
    },
    methods: {
      fetchClothes() {
        fetch(`http://localhost:3000/clothes`)
          .then((response) => response.json())
          .then((data) => {
            // Resolve @ alias dynamically
            this.clothes = data.map(item => ({
              ...item,
              image: require(`@/assets/images/${item.image.split('/').pop()}`) // Extract image name and resolve
            }));
          })
          .catch((err) => console.log(err.message));
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.newClothing.image = URL.createObjectURL(file);
        }
      },
      addTag() {
        if (this.newTag.trim()) {
          this.newClothing.tags.push(this.newTag.trim());
          this.newTag = '';
        }
      },
      removeTag(index) {
        this.newClothing.tags.splice(index, 1);
      },
      removeClothing(id) {
        this.clothes = this.clothes.filter(item => item.id !== id);
      },
      addClothingPiece() {
        const newItem = { ...this.newClothing, id: Date.now() };
        this.clothes.push(newItem);
        // Reset form
        this.newClothing = {name:'', type: '', image: null, tags: [] };
      },
      filterClothes(type) {
        this.selectedType = type;
      },
    },
    mounted() {
      this.fetchClothes();
    }
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

  .menu {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  }

  .menu button {
  background-color: coral;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  }


  .menu button:hover {
    background-color: #005f7a;
  }


  .clothes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    justify-items: center;
  }

  .clothing-item {
  text-align: center;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .clothing-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
  }

  .clothing-item p {
  margin: 5px 0;
  }

  .add-item-form {
    margin: 1em;
  }

  .add-item-form input {
    margin: 5px;
    padding: 5px;
  }

  .add-item-form button {
    padding: 5px 10px;
    margin-left: 5px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
  display: inline-block;
  background: #eee;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  }

  ul li button {
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    margin-left: 5px;
    cursor: pointer;
  }
  </style>