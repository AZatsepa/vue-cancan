function checkAction(abilityAction, checkedAction) {
  return (abilityAction === 'manage') ||
         (abilityAction === checkedAction) ||
         (abilityAction === 'read' && (checkedAction === 'index' || checkedAction === 'show'));
}

function checkSubject(abilitySubject, checkedSubject) {
  return (abilitySubject === 'all') ||
         (abilitySubject === checkedSubject);
}

function checkConditions(abilityConditions, target) {
  if (!Object.keys(abilityConditions).length) return true;
  const matches = [];

  Object.keys(abilityConditions).forEach((key) => {
    if (abilityConditions[key] === target[key]) {
      matches.push(true);
    } else {
      matches.push(false);
    }
  });
  return (!matches.includes(false));
}

export default {
  $can(action, subject) {
    return Boolean(this.rules.find((ability) => {
      return ability.base_behavior &&
             ability.subjects.find(abilitySubject => checkSubject(abilitySubject, subject) &&
             ability.actions.find(abilityAction => checkAction(abilityAction, action)));
    }));
  },
  $authorize(action, subject, target) {
    return Boolean(this.rules.find((ability) => {
      return ability.base_behavior &&
        ability.subjects.find(abilitySubject => checkSubject(abilitySubject, subject)) &&
        ability.actions.find(abilityAction => checkAction(abilityAction, action)) &&
        checkConditions(ability.conditions, target);
    }));
  },

  install(Vue, options) {
    this.rules = options.rules;

    Vue.prototype.$can = (action, subject) => this.$can(action, subject);
    Vue.prototype.$authorize = (action, subject, target) => this.$authorize(action, subject, target);

    Vue.directive('can', {
      inserted: (el, binding) => {
        if (!this.$can(Object.keys(binding.modifiers)[0], Object.keys(binding.modifiers)[1])) {
          el.remove();
        }
      },
    });
    Vue.directive('authorize', {
      inserted: (el, binding) => {
        if (!this.$authorize(Object.keys(binding.modifiers)[0], Object.keys(binding.modifiers)[1], binding.value)) {
          el.remove();
        }
      },
    });
  },

  navigationGuard(defaultPath) {
    return (to, from, next) => {
      const subject = to.path.replace(/^\//, '').split('/')[0] || 'index';
      const action = to.path.replace(/^\//, '').split('/')[1] || 'index';
      if (this.$can(action, subject)) {
        next();
      } else {
        next(defaultPath);
      }
    };
  },
};
