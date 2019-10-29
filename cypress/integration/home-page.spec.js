describe('The Home Page', function() {

    beforeEach(function () {
       sessionStorage.clear();
       cy.visit('/')
    });

    it('successfully loads', function() {
        cy.visit('/') // change URL to match your dev URL
    });

    it('contains the expected articles',function() {

        cy
            .get('a.article')
            .should('have.length', 3)
            .each(function(article) {

                expect(article).to.contain('Article ');

            });

    });

    it('opens the correct article on click', function() {

        for (var i = 0; i < 3; i++) {
            cy
                .get('a.article')
                .eq(i)
                .click()
                .should('not.exist')

                .get('h1')
                .contains('Dummy Markdown')

                .get('button#back-button')
                .click()
                .should('not.exist')

                .get('a.article')
                .should('exist')
        }


    });

    it('remembers which article was last open during session', function() {

        cy
            .get('a.article')
            .first()
            .click()
            .reload(true)
            .get('h1')
            .contains('Dummy Markdown')
            .contains('Fake Article 1')

    });
});