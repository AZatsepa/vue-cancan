import Vue from 'vue/dist/vue.common';
import VueCanCan from '../dist/vue-cancan';

const assert = require('assert');

Vue.use(VueCanCan, {
  rules: [
    {
      base_behavior: true,
      actions: ['create', 'read', 'update', 'destroy'],
      subjects: ['Comment'],
      conditions: { user_id: 1 },
    },
    {
      base_behavior: true,
      actions: ['read'],
      subjects: ['Post'],
      conditions: { user_id: 1 },
    },
  ],
});


describe('Vue', () => {
  describe('#$authorize()', () => {
    context('when create Comment', () => {
      it('should return false when cannot destroy comment', () => {
        assert.equal(Vue.prototype.$authorize('destroy', 'Comment', { user_id: 2 }), false);
      });

      it('should return false when cannot update comment', () => {
        assert.equal(Vue.prototype.$authorize('update', 'Comment', { user_id: 2 }), false);
      });

      it('should return true when can create comment', () => {
        assert.equal(Vue.prototype.$authorize('create', 'Comment', { user_id: 1 }), true);
      });

      it('should return false when cannot read comment', () => {
        assert.equal(Vue.prototype.$authorize('read', 'Comment', { user_id: 2 }), false);
      });
    });

    context('when read Post', () => {
      it('should return false when cannot destroy post', () => {
        assert.equal(Vue.prototype.$authorize('destroy', 'Post', { user_id: 1 }), false);
      });

      it('should return false when cannot update post', () => {
        assert.equal(Vue.prototype.$authorize('update', 'Post', { user_id: 1 }), false);
      });

      it('should return false when cannot create post', () => {
        assert.equal(Vue.prototype.$authorize('create', 'Post', { user_id: 1 }), false);
      });

      it('should return true when can read post', () => {
        assert.equal(Vue.prototype.$authorize('read', 'Post', { user_id: 1 }), true);
      });

      it('should return false when cannot read post', () => {
        assert.equal(Vue.prototype.$authorize('read', 'Post', { user_id: 2 }), false);
      });
    });
  });
});
