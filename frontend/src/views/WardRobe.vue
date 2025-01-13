<template>
    <div class="page-wrapper">
      <Header />
      <main class="content">
        <div class="menu">
          <button @click="filterClothes('Tops')">Tops</button>
          <button @click="filterClothes('Bottoms')">Bottoms</button>
          <button @click="filterClothes('Shoes')">Shoes</button>
          <button @click="filterClothes('All')">Show All</button>
          <select v-model="selectedTag" @change="filterByTag" class="tag-filter">
            <option value="">Filter by Tag</option>
            <option v-for="(tag, index) in uniqueTags" :key="index" :value="tag">{{ tag }}</option>
          </select>
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
          <select id="select-type" v-model="newClothing.type">
            <option value="" disabled>Select Type</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Shoes">Shoes</option>
          </select>
          <input type="file" @change="handleImageUpload" />
          
          <div class="add-tag-form">
            <input v-model="newTag" placeholder="Add a tag" @keyup.enter="addTag" />
            <button @click="addTag">Add Tag</button>
            <ul>
              <li v-for="(tag, index) in newClothing.tags" :key="index">
                {{ tag }} <button @click="removeTag(index)">x</button>
              </li>
            </ul>
          </div>

          <button id="add-clothing-button" @click="addClothingPiece">Add Clothing</button>
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
        categories: ['Tops', 'Bottoms', 'Shoes'],
        newCategory: '',
        newClothing: {
          name: '',
          type: '',
          image: null,
          tags: [],
        },
        newTag: '',
        selectedType: 'All',
        selectedTag: '', // For tag filtering
      };
    },
    computed: {
      filteredClothes() {
        let result = this.clothes;

        // Filter by type
        if (this.selectedType !== 'All') {
          result = result.filter(item => item.type === this.selectedType);
        }

        // Filter by tag
        if (this.selectedTag) {
          result = result.filter(item => item.tags.includes(this.selectedTag));
        }

        return result;
      },
      uniqueTags() {
        return [...new Set(this.clothes.flatMap(item => item.tags))];
      },
    },
    methods: {
      fetchClothes() {
        fetch(`http://localhost:3000/clothes`)
          .then((response) => response.json())
          .then((data) => {
            this.clothes = data.map(item => ({
              ...item,
              tags: Array.isArray(item.tags) ? item.tags : item.tags.replace(/[\\[\\]]/g, '').split(',').map(tag => tag.trim()), // Should remove brackets but doesn't ???
              image: item.image ? `data:image/jpeg;base64,${item.image}` : '', // base64 prefix
            }));
          })
          .catch((err) => console.log(err.message));
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.newClothing.imageFile = file; // Save the file object for FormData
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
        fetch(`http://localhost:3000/clothes/${id}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              this.clothes = this.clothes.filter(item => item.id !== id); // Remove from frontend list
              console.log('Clothing item deleted successfully');
            } else {
              console.error('Failed to delete clothing item');
            }
          })
          .catch((err) => console.error('Error:', err));
      },
      addClothingPiece() {
        const formData = new FormData();
        formData.append('name', this.newClothing.name);
        formData.append('type', this.newClothing.type);
        formData.append('tags', JSON.stringify(this.newClothing.tags));
        formData.append('image', this.newClothing.imageFile);

        fetch('http://localhost:3000/clothes', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to add clothing item');
            }
          })
          .then((data) => {
            // Add the item to the local clothes array for immediate display
            this.clothes.push({ ...this.newClothing, id: data.id });
            console.log('Clothing item added successfully');
          })
          .catch((err) => console.error('Error:', err));

        this.newClothing = {name:'', type: '', image: null, tags: [] };
      },
      filterClothes(type) {
        this.selectedType = type;
        this.selectedTag = '';
      },
      filterByTag() {
        this.selectedType = 'All';
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
  justify-content: center;
  gap: 10px;
  }

  .menu button {
  background-color: lightcoral;
  color: white;
  padding: 10px 20px;
  margin: 0.1em;
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
    justify-content: center;
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
    margin-top: 10em;
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

  .tag-filter {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  /* Responsive design for smaller screens */
  @media (max-width: 600px) {
    .menu {
      grid-template-columns: 1fr; /* Stack buttons vertically */
      gap: 5px;
    }

    .menu button {
      width: 100%; /* Make buttons full width */
      padding: 10px;
      margin-bottom: 5px;
      width: 50%;
    }

    .tag-filter {
      width: 50%;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      cursor: pointer;
    }
  }
  </style>