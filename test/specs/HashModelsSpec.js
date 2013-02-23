describe('Backbone.HashModels', function(){
    beforeEach(function(){
        var self = this;
        window.HASH_VALUE = undefined;
        Backbone.HashModels.init(function (hash) {
            window.HASH_VALUE = hash;
            console.log('HASH_VALUE=' + hash);
        }, function(cb) {
            self.setNewHashValue = cb;
        });
    });

    it('exists', function(){
        expect(Backbone).toBeDefined();
        expect(Backbone.HashModels).toBeDefined();
    });

    it("has an init method", function() {
        expect(Backbone.HashModels.init).toBeAFunction();
    });

    it('has an addModel function', function () {
        expect(Backbone.HashModels.addModel).toBeAFunction();
    });

    it('sets the hash when a model is changed', function () {
        var m = new Backbone.Model({foo: 'bar'});
        Backbone.HashModels.addModel(m);
        expect(window.HASH_VALUE).not.toBeDefined();
        m.set('foo', 'baz');
        expect(window.HASH_VALUE).toBeDefined();
    });

    it('updates a model when a hash is changed', function () {
        var m = new Backbone.Model({foo: 'bar'});
        Backbone.HashModels.addModel(m);
        this.setNewHashValue('W3siZm9vIjoiYmF6In1d');
        expect(m.attributes).toEqual({foo: 'baz'});
    });

    it('only updates the hash when a listened property is changed', function () {
        var m = new Backbone.Model({foo: 'bar', monkey: 'fight'});
        Backbone.HashModels.addModel(m, ['monkey']);
        expect(window.HASH_VALUE).not.toBeDefined();
        m.set('foo', 'baz');
        expect(window.HASH_VALUE).not.toBeDefined();
    });

    it('handles multiple models', function () {
        var dog = new Backbone.Model({sound: 'woof'});
        Backbone.HashModels.addModel(dog);
        var cat = new Backbone.Model({sound: 'meow'});
        Backbone.HashModels.addModel(cat);
        expect(window.HASH_VALUE).not.toBeDefined();
        dog.set('name', 'Ira');
        expect(window.HASH_VALUE).toEqual('W3sic291bmQiOiJ3b29mIiwibmFtZcSIIklyYSJ9XQ==');
        cat.set('color', 'grey');
        expect(window.HASH_VALUE).toBeDefined('W3sic291bmQiOiJ3b29mIiwibmFtZcSIIklyYSJ9LMSBxIPEhcSHxInElG93xI8iY29sb3LElmdyZXnEm10=');
    });

    it('resets to initial state when hash is cleared', function () {
        var m = new Backbone.Model({foo: 'bar', monkey: 'fight'});
        Backbone.HashModels.addModel(m);
        expect(window.HASH_VALUE).not.toBeDefined();
        m.set({foo: 'baz', rocket: 'blast'});
        expect(window.HASH_VALUE).toBeDefined();
        expect(m.attributes).toEqual({foo: 'baz', monkey: 'fight', rocket: 'blast'});
        this.setNewHashValue('');
        expect(m.attributes).toEqual({foo: 'bar', monkey: 'fight', rocket: 'blast'});
    });
});