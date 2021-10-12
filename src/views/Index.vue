<template>
  <div class="wrapper">
    <parallax class="page-header header-filter" :style="headerStyle">
      <div class="md-layout">
        <div class="md-layout-item">
          <div class="image-wrapper">
            <img :src="leaf4" alt="leaf4" class="leaf4" v-show="leafShow" />
            <img :src="leaf3" alt="leaf3" class="leaf3" v-show="leafShow" />
            <img :src="leaf2" alt="leaf2" class="leaf2" v-show="leafShow" />
            <img :src="leaf1" alt="leaf1" class="leaf1" v-show="leafShow" />
            <div class="brand">
              <h1>OVT</h1>
              <h3>Observatorio de vigilancia tecnológica</h3>
            </div>
          </div>
        </div>
      </div>
    </parallax>
    <div class="main main-raised">
      <div class="section section-basic">
        <div class="container">
          <div class="md-layout-item md-size-66 md-small-size-100 mx-auto">
            <h2 class="text-center text-primary title">Observatorio de Vigilancia Tecnológica  VIRTUS</h2>
            <md-field>
              <md-icon>search</md-icon>
              <label>Ingrese el texto de busqueda</label>
              <md-input v-model="searchInput" placeholder=""></md-input>
            </md-field>
            <md-button class="md-primary md-block md-round" @click="searchResults"><md-icon class="fa-spin" v-if="loading">restore_page</md-icon>Buscar</md-button>
          </div>
          <div class="md-layout results-text">
            <div class="md-layout-item">
              <h4 v-if="queryString" class="text-left">
                Resultados de la busqueda <b class="text-primary">"{{queryString}}"</b>
              </h4>
            </div>
            <div class="md-layout-item">
              <p v-if="queryString" class="text-right text-muted">
                <b>"{{hitCount}}"</b> <span class="">Resultados encontrados</span>
              </p>
            </div>
          </div>
          <div class="md-layout" v-if="getResults">
            <div class="md-layout-item">
              <md-field>
                <label>Resultados por pagina</label>
                <md-input v-model="pageSize" type="number" min=0 @change="searchResults"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item pagination-section md-block">
              <md-button class="md-primary md-sm" v-if="getPreviousPageUrls.length>0" @click="previousPageResults()">
                <md-icon>navigate_before</md-icon>
                Anterior
              </md-button>
              <md-button class="md-primary md-sm" v-if="getNextPageUrl" @click="nextPageResults()">
                Siguiente
                <md-icon>navigate_next</md-icon>
              </md-button>
            </div>
            <div class="md-layout-item"></div>
          </div>
          <div v-for="result in resultList" :key="result.id" class="md-layout-item md-size md-small-size-100 result-card">
            <nav-tabs-card no-label>
              <template slot="content">
                <md-tabs class="md-primary" md-alignment="left">
                  <md-tab id="tab-home" md-label="Informacion General" md-icon="info">
                    <h3 class="text-left title">
                      {{result.title}}
                    </h3>
                    <p class="text-muted text-left">{{result.authorString}}</p>
                    <h5 class="text-left">DOI: {{result.doi}}</h5>
                    <h5 class="text-left">Fecha de publicación: {{result.pubYear}}</h5>
                  </md-tab>

                  <md-tab id="tab-pages" md-label="Messages" md-icon="chat">
                    <p>
                      I think that’s a responsibility that I have, to push
                      possibilities, to show people, this is the level that things
                      could be at. I will be the leader of a company that ends up
                      being worth billions of dollars, because I got the answers.
                      I understand culture. I am the nucleus. I think that’s a
                      responsibility that I have, to push possibilities, to show
                      people, this is the level that things could be at.
                    </p>
                  </md-tab>

                  <md-tab id="tab-posts" md-label="Settings" md-icon="build">
                    <p>
                      I think that’s a responsibility that I have, to push
                      possibilities, to show people, this is the level that things
                      could be at. So when you get something that has the name
                      Kanye West on it, it’s supposed to be pushing the furthest
                      possibilities. I will be the leader of a company that ends
                      up being worth billions of dollars, because I got the
                      answers. I understand culture. I am the nucleus.
                    </p>
                  </md-tab>
                </md-tabs>
              </template>
            </nav-tabs-card>
          </div>
          <div class="md-layout" v-if="getResults">
            <div class="md-layout-item pagination-section md-block wrapper">
              <md-button class="md-primary md-sm" v-if="getPreviousPageUrls.length>0" @click="previousPageResults()">
                <md-icon>navigate_before</md-icon>
                Anterior
              </md-button>
              <md-button class="md-primary md-sm" v-if="getNextPageUrl" @click="nextPageResults()">
                Siguiente
                <md-icon>navigate_next</md-icon>
              </md-button>
            </div>
          </div>
          <div class="md-layout results-text">
            <div class="md-layout-item">
              <h4 v-if="queryString" class="text-left">
                Pagina <b class="text-primary">"{{getPreviousPageUrls.length+1}}"</b> de <b class="text-primary">"{{Math.trunc(hitCount/pageSize)+1}}"</b> 
              </h4>
            </div>
            <div class="md-layout-item">
              <p v-if="queryString" class="text-right text-muted">
                <b>"{{hitCount}}"</b> <span class="">Resultados encontrados</span>
              </p>
            </div>
          </div>
          <div class="md-layout" v-if="loading">
            <md-icon class="fa-spin md-size-5x">restore_page</md-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavTabsCard } from "@/components";
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    NavTabsCard
  },
  name: "index",
  bodyClass: "index-page",
  props: {
    image: {
      type: String,
      default: require("@/assets/img/vue-mk-header.jpg")
    },
    leaf4: {
      type: String,
      default: require("@/assets/img/leaf4.png")
    },
    leaf3: {
      type: String,
      default: require("@/assets/img/leaf3.png")
    },
    leaf2: {
      type: String,
      default: require("@/assets/img/leaf2.png")
    },
    leaf1: {
      type: String,
      default: require("@/assets/img/leaf1.png")
    },
    signup: {
      type: String,
      default: require("@/assets/img/city.jpg")
    },
    landing: {
      type: String,
      default: require("@/assets/img/landing.jpg")
    },
    profile: {
      type: String,
      default: require("@/assets/img/profile.jpg")
    }
  },
  data() {
    return {
      firstname: null,
      email: null,
      password: null,
      leafShow: false,
      searchInput: '',
      pageSize: 5,
      queryString: null,
      resultList: null,
      hitCount: null,
      loading: false,
    };
  },
  methods: {
    ...mapActions('scholarAPI', [
      'search',
      'nextPage',
      'previousPage'
    ]),
    leafActive() {
      if (window.innerWidth < 768) {
        this.leafShow = false;
      } else {
        this.leafShow = true;
      }
    },
    async searchResults(){
      if (this.pageSize < 5){
        this.pageSize = 5;
        this.searchInput = ""
      }
      if (!this.searchInput == ""){
        this.loading = true;
        await this.search({query: this.searchInput, pageSize: this.pageSize, nextPage: this.nextPageUrl});
        this.loading = false;
        this.queryString = this.getResults.data.request.queryString;
        this.resultList = this.getResults.data.resultList.result;
        this.hitCount = this.getResults.data.hitCount;
      }
    },
    async nextPageResults(){
      if (!this.searchInput == ""){
        this.loading = true;
        await this.nextPage()
        this.loading = false;
        this.queryString = this.getResults.data.request.queryString;
        this.resultList = this.getResults.data.resultList.result;
        this.hitCount = this.getResults.data.hitCount;
      }
    },
    async previousPageResults(){
      if (!this.searchInput == ""){
        this.loading = true;
        await this.previousPage();
        this.loading = false;
        this.queryString = this.getResults.data.request.queryString;
        this.resultList = this.getResults.data.resultList.result;
        this.hitCount = this.getResults.data.hitCount;
      }
    }
  },
  computed: {
    ...mapGetters('scholarAPI', [
      'getResults',
      'getNextPageUrl',
      'getPreviousPageUrls'
    ]),
    headerStyle() {
      return {
        backgroundImage: `url(${this.image})`
      };
    },
    signupImage() {
      return {
        backgroundImage: `url(${this.signup})`
      };
    }
  },
  mounted() {
    this.leafActive();
    window.addEventListener("resize", this.leafActive);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.leafActive);
  }
};
</script>
<style lang="scss">
.section-download {
  .md-button + .md-button {
    margin-left: 5px;
  }
}

.results-text{
  margin:2rem 0rem;
}

.result-card{
  margin:0.5rem 0rem;
}

.pagination-section{
  margin: 0 auto;
}

.wrapper{
  text-align: center;
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
