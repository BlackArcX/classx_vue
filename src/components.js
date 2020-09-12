import Vue from 'vue';

import Button from './components/Button.vue';
import Form from './components/form/Form.vue';
import FormItem from './components/form/FormItem.vue';


const components = [
  Button,
  Form,
  FormItem,
];

// eslint-disable-next-line no-restricted-syntax
for (const component of components) {
  Vue.component(component.name, component);
}
