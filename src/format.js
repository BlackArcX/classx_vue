import Vue from 'vue';
import { formatDistance, formatRelative } from 'date-fns';

const dateFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

const dateTimeFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour12: true,
  hour: 'numeric',
  minute: 'numeric',
});

Vue.prototype.formatDate = dateFormat.format;
Vue.prototype.formatDateTime = dateTimeFormat.format;
Vue.prototype.formatDistance = (date, otherDate) => formatDistance(date, otherDate || new Date());
Vue.prototype.formatRelative = (date, otherDate) => formatRelative(date, otherDate || new Date());
