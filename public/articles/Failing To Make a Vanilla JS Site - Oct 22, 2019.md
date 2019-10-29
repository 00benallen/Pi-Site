# Failing to Make a Vanilla JS Site
At the time of writing this article, I'm a student working as a Full Stack Development for a big bank. We use Angular, and I've become pretty adept at creating web applications using a framework. However, this leaves me woefully inadequate at vanilla Javascript, and I thought I'd change that. I created this website! The Pi Site is my attempt at going Vanilla, and it failed. Below are the libraries I did choose to include, and why.

## Typescript
Well, first thing I failed at was *actually* using Javascript. I've been a web developer for about 2 years, and honestly, I hate Javascript. I really think Typescript is a better language, so I actually wrote the code for this site in Typescript instead.

## Bundling
In order to split my Typescript code effectively across multiple files, I used Browserify to bundle my resulting .js files from Typescript into one bundle.js. This also has all of the other benefits of Browserify, which improve the performance of the site overall. I also added tinyify to reduce my bundle sizes significantly.

## Web Components
Firstly, I still really like Components from Angular/Vue/React etc. It's how I've come to think of UI development in general, and its a good paradigm. I decided to use Web Components, with no framework on top.

To put it briefly, I don't think they're perfect, but I liked the challenge, and I think a whole article devoted to that journey is warranted in the future. However I'm proud that I used them, because they encapsulated the simple structure of this site pretty well, and I stayed library free to do it.

Just to show off the fancy code blocks this site has to offer, here's the basic idea of my `<articles-list></articles-list>` web component.
```typescript
// ... imports

export class ArticlesComponent extends HTMLElement {

  constructor() {
    super();
    let builder = new WebComponentBuilder(this)
      .attribute('directory');

    // ... load article links from web server
    if (links) {
      links
        .forEach((link) => {
            let markdownBlock = document.createElement('markdown-block');
            markdownBlock.setAttribute('file', link);
            builder.child(markdownBlock);
        });
    }
  }

  async getArticleLinks(directory: string): Promise<string[] | undefined> {
    const response = await fetch(directory);
    if (response.body) {
      return this.parseArticlesDirectory(await response.text())
        .map(link => `${directory}/${link}`);
    }
  }

  parseArticlesDirectory(rawHtml: string): string[] {
    let domFromRaw = document.createElement('html');
    domFromRaw.innerHTML = rawHtml;

    let articleAnchorElements = domFromRaw.querySelectorAll('div.list tbody a');
    return Array.from(articleAnchorElements)
      .map(el => el.getAttribute('href'))
      .filter(href => href !== '../') // causes infinite loops of page fetching itself
      .filter(href => href !== null) as string[];
  }
}
```

And here's that `WebComponentBuilder` class above, which just SOLIDifies some boilerplate involved in creating Web Components (note: I know its more of a `WebComponentsProxy` than it is truly a builder).

```typescript
export interface Component {
  register(): void;
}

export type Attribute = {qualifiedName: string, value: any};

export class WebComponentBuilder<T extends HTMLElement> {

  component: T;
  shadow: ShadowRoot;
  attributes: Attribute[];

  constructor(component: T) {
    this.component = component;
    this.shadow = this.component.attachShadow({mode: 'open'});
    this.attributes = [];
  }

  child<N extends Node>(el: N): WebComponentBuilder<T> {
    this.shadow.appendChild(el);
    return this;
  }

  style(styleString: string): WebComponentBuilder<T> {
    let style = document.createElement('style');
    style.textContent = styleString;
    this.shadow.appendChild(style);
    return this;
  }

  attribute(qualifiedName: string): WebComponentBuilder<T> {
    if (this.component.hasAttribute(qualifiedName)) {
      this.attributes.push({ qualifiedName, value: this.component.getAttribute(qualifiedName) });
    }
    return this;
  }

  getAttributeValue(qualifiedName: string): any | undefined {
    let attribute = this.attributes.find(v => v.qualifiedName === qualifiedName);
    if (attribute) {
      return attribute.value;
    } else {
      return undefined;
    }
  }
}
```

As you can see, the ArticlesComponent initializes, sets up its Shadow DOM, reads in an attribute, loads some data, and passes that data down to a set of children. Simple, reasonably short and clean, I'm happy with it.

## Markdown
Since this site is intended to be a site where I post articles (and maybe some data collected around the house, we'll see), I wanted to be able to write the articles in Markdown, with minimal fuss. There's 2 pieces that make that work.

### Piece 1: Lighttpd
I needed a web server! I didn't want to use Apache on my Pi, so I thought lighttpd would be good because its known to be performance optimized. An article to follow on how I set all of that up, but for now, the "Directory Listing" feature is the important part.

#### Directory Listing
Directory listing is a simple idea, lighttpd will compose an autogenerated HTML document describing all of the files in a folder. I enabled that feature, but only for the /articles folder (for security reasons of course), and then parsed the raw HTML for the links to all of the articles in the folder, and then fetch those individually. You can actually see the index that lighttpd generates by clicking this link
[Articles index](/articles)

### Piece 2: Showdown
So, here's the first place where added something non-vanilla to the final bundle.js. I really, really, wasn't interested in creating a Markdown -> HTML conversion library. It's a solved problem. So I used Showdown, which has a really simple and clean 2-way interface:
```typescript
let converter: Converter = new Converter();
converter.setFlavor('github');
converter.setOption('ghCodeBlocks', true);
this.fetchMarkdown(markdownFile).then((markdownContent => {
  wrapper.innerHTML = converter.makeHtml(markdownContent);
}));
```
This way, I can fetch the markdown files, convert them into HTML, and render them on the page. Yes I'm aware this might have XSS vulnerabilities, but luckily this site doesn't deal with any vulnerable information and never will, so even if someone did manage to inject some Javascript into this page, the worst they could do is break it.

## Code Blocks
The next library I chose to include is highlight.js, because I realized that this website would be massively benefited by syntax highlighting inside of the Markdown code blocks, and that would be a massive undertaking to do myself. It was interesting to get highlight.js working, for 2 reasons.

highlight.js has a very easy default setup, you basically just insert this somewhere in your html
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/{theme}.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```
This allows highlight.js to detect all code blocks on the page, and add html elements and classes to style the code. It basically transforms this:
```html
<pre><code class="typescript language-typescript">
// ... imports

export class ArticlesComponent extends HTMLElement {
// ... rest of code
</code></pre>
```
into this:
```html
<pre><code class="typescript language-typescript hljs">
<span class="hljs-comment">// ... imports</span>

<span class="hljs-keyword">export</span> <span class="hljs-keyword">class</span> ArticlesComponent <span class="hljs-keyword">extends</span> HTMLElement {

// ... rest of code
}</code></pre>
```

### The Shadow DOM

This approach however, doesn't work for Web Components, because highlight.js can't see into the Shadow DOM, this means you need to manually trigger highlight.js on the blocks you want transformed. Here's how I did that:
```typescript

import {highlightBlock} from "highlight.js";

this.fetchMarkdown(markdownFile).then((markdownContent => {
  wrapper.innerHTML = converter.makeHtml(markdownContent);

  let codeBlocks = wrapper.querySelectorAll('pre code');
  console.log(wrapper);
  codeBlocks.forEach(block => {
    highlightBlock(block); // this triggers highlight.js
  });
}));
``` 

The final piece of the puzzle is styling, because importing the CSS from hightlight.js as a linked stylesheet also doesn't reach into the Shadow DOM. The final solution is to use an `@import` to import it manually into the component that needs it.
```css
@import "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/{theme}.css";
.wrapper {
  background-color: #282828;
  color: E9E9E9;
  font-family: Lucida Console, Courier New, Courier, monospace;
  line-height: 1.5em;
  margin: 0.5rem;
  padding: 0.25rem;
}
```
This CSS is then added to your Web Component in different ways depending on your chosen approach. My approach is just to use a `<style>` tag in the Shadow DOM.

## My takeaway
There's a difference between failing negatively and failing positively. I didn't fail at making a completely dependency free website because I was incapable of it, I failed because I recognized problems which were worthwhile for me to solve, and problems which weren't worthwhile. 

I think the takeaway for the reader is, use libraries/tools other people have made when its obvious it will add value to your product and is worth the consequences. My resulting bundle.js at the time of writing this article is 1 MB. The bundle size of an Angular site would be bigger than that, especially if that Angular site was using highlight.js/prism.js for code highlighting.



