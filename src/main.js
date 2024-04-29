import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';

import Editor from '@tinymce/tinymce-vue';

//Importar componentes globales:
import Loading from './components/Alerts/Loading.vue';
import Message from './components/Alerts/Message.vue';
import Card from './components/Cards/Card.vue';
import CardHeader from './components/Cards/CardHeader.vue';
import CardBody from './components/Cards/CardBody.vue';
import CardFooter from './components/Cards/CardFooter.vue';
import PageTitle from './components/PageTitle.vue';
import MainNavbar from './components/MainNavbar.vue';
import BigCard from './components/Cards/BigCard.vue';
import Icon from './components/Icon.vue';
import DefaultPage from './components/DefaultPage.vue';


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

//Registrar componentes
app.component("Loading", Loading);
app.component("Message", Message);
app.component("Card", Card);
app.component("CardHeader", CardHeader);
app.component("CardBody", CardBody);
app.component("CardFooter", CardFooter);
app.component("PageTitle", PageTitle);
app.component("MainNavbar", MainNavbar);
app.component("BigCard", BigCard);
app.component("Icon", Icon);
app.component("DefaultPage", DefaultPage);
app.component("Editor", Editor);

app.mount("#app");

