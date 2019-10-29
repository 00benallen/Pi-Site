<template>
    <div>
        <section class="centre-column">
            <h1>Pi Site by Ben Pinhorn</h1>
            <img src="~@/assets/raspberry-pi.svg" width=300, height="300">
            <p>
                Hi! My name is Ben Pinhorn and I'm a Software Developer.
                This is my website, which is hosted on a Raspberry Pi which is currently humming on my desk.
                Enjoy!
            </p>
        </section>

        <hr class="column-break">

        <main>
            <section class="centre-column">
                <h2>This is a series of articles on programming / technology I've written, take a read if you like</h2>
                <articles-list directory="articles"></articles-list>
            </section>

            <hr class="column-break">

            <section class="centre-column">
                <h2>This is a bunch of data I've collected from devices around my house!</h2>
                <p>Under construction... please come back later</p>
            </section>
        </main>
    </div>
</template>

<script>
import ArticlesList from "./ArticlesList";

export default {
    name: 'HomePage',
    components: {
        ArticlesList
    }
};
</script>

<style>

</style>