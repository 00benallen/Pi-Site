import marked from 'marked';
marked.setOptions({
    highlight: function(code) {
        return highlight.highlightAuto(code).value;
    },
});

import highlight from 'highlight.js';

export const ArticlesMixin = {
    data: function () {
        return {
            publicPath: process.env.BASE_URL,
            articles: [],
        };
    },
    mounted: function () {
        this.getArticles();
    },
    methods: {
        getArticles: async function () {

            if (this.isDevMode()) {
                console.warn('Dev mode, loading dummy articles');
                this.articles = ['articles//Fake Article 1', 'articles//Fake Article 2', 'articles//Fake Article 3'];
                this.publicPath = '';
                return;
            }

            let pathToArticlesDirectory = `./${this.publicPath}/${this.directory}`;
            try {
                const response = await fetch(pathToArticlesDirectory);

                if (response.body) {

                    let domFromRaw = document.createElement('html');
                    domFromRaw.innerHTML = await response.text();

                    let articleAnchorElements = domFromRaw.querySelectorAll('div.list tbody a');
                    this.articles = Array.from(articleAnchorElements)
                        .map(el => el.getAttribute('href'))
                        .filter(href => href !== '../')// causes infinite loops of page fetching itself lol
                        .filter(href => href !== null)
                        .map(link => `${this.publicPath}/${this.directory}/${link}`)
                        .map(link => decodeURIComponent(link));
                }
            } catch(e) { // TODO improve
                console.error(e);
            }
        },
        getArticle: async function (name) {

            if (this.isDevMode()) {
                return this.getDummyArticle(name);
            }

            let pathToArticles = `./${this.publicPath}/${name}`;
            try {
                let response = await fetch(pathToArticles);
                let rawMarkdownForArticle = await response.text();
                return marked(rawMarkdownForArticle);
            } catch (e) {
                console.error(e);
                return undefined;
            }

        },
        getDummyArticle: function (name) {
            console.warn('Dev mode, loading dummy article content');
            return marked(
                `
# Dummy Markdown for ${name}
Some markdown

\`\`\`let a = 5;\`\`\`
`
            );
        },
        isDevMode: function () {
            return process.env.NODE_ENV === 'development';
        },
    },
};

export default ArticlesMixin;