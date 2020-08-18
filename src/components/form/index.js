import Form from './Form.vue';
import FormItem from './FormItem.vue';

Form.install = (Vue) => {
  Vue.component(Form.name, Form);
  Vue.component(FormItem.name, FormItem);
};

export default Form;
