<template>
    <div>
        <template v-if="showList">
            <a
                v-for="(article, index) in articles"
                v-bind:key="index"
                v-on:click="showArticle(article)"
                v-bind:class="'article'"
            >{{ article.split('/').slice(-1)[0]  }}</a>
        </template>
        <template v-else>
            <button
                    v-on:click="showArticleList()"
                    id="back-button"
            >‹ Back</button>
            <div v-html="displayedArticleContent"></div>
        </template>
    </div>
</template>

<script>

    import ArticlesMixin from '../mixins/ArticlesMixin';

    export default {
        name: 'ArticlesList',
        props: {
            directory: String,
        },
        mixins: [ArticlesMixin],
        data: function () {
            return {
                showList: true,
                displayedArticle: undefined,
                displayedArticleContent: undefined
            };
        },
        created: function() {
          let openedArticle = sessionStorage.getItem('openedArticle');
          if (openedArticle !== null) {
              this.showArticle(openedArticle);
          }
        },
        methods: {

            showArticle: async function (name) {
                sessionStorage.setItem('openedArticle', name);
                this.displayedArticleContent = await this.getArticle(name);
                this.showList = false;
                this.displayedArticle = name;
            },

            showArticleList: function () {
                sessionStorage.removeItem('openedArticle');
                this.displayedArticle = undefined;
                this.displayedArticleContent = undefined;
                this.showList = true;
            },


        }
    };
</script>

<style>
    a, a:link, a:visited {
        cursor: pointer;
        border: 1px solid white;
        display: block;
        margin: 2px;
    }

    a {
        color: cyan;
    }

    a:link, a:visited {
        color: blue;
    }

    button {
        text-decoration: none;
        display: inline-block;
        padding: 8px 16px;
        border-radius: 50%;
        background-color: #f1f1f1;
        color: black;
        border: none;
        margin: 0.5rem;
        font-size: 1.5rem;
    }

    button:hover {
        background-color: #ddd;
        color: black;
    }
</style>