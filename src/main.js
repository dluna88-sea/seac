import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';

//Importar componentes globales:
import Loading from './components/Alerts/Loading.vue';
import Success from './components/Alerts/Success.vue';
import Error from './components/Alerts/Error.vue';
import Info from './components/Alerts/Info.vue';
import Card from './components/Cards/Card.vue';
import CardHeader from './components/Cards/CardHeader.vue';
import CardBody from './components/Cards/CardBody.vue';
import CardFooter from './components/Cards/CardFooter.vue';
import PageTitle from './components/PageTitle.vue';
import MainNavbar from './components/MainNavbar.vue';
import BigCard from './components/Cards/BigCard.vue';
import Icon from './components/Icon.vue';
import DefaultPage from './components/DefaultPage.vue';
import ModalDeleteFile from './components/modals/ModalDeleteFile.vue';

//QUILL:
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
const globalOptions = {
    placeholder: 'Escribe algo aquí'
  }
// set default globalOptions prop
QuillEditor.props.globalOptions.default = () => globalOptions;


const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

//Registrar componentes
app.component("Loading", Loading);
app.component("Success", Success);
app.component("Error", Error);
app.component("Info", Info);
app.component("Card", Card);
app.component("CardHeader", CardHeader);
app.component("CardBody", CardBody);
app.component("CardFooter", CardFooter);
app.component("PageTitle", PageTitle);
app.component("MainNavbar", MainNavbar);
app.component("BigCard", BigCard);
app.component("Icon", Icon);
app.component("DefaultPage", DefaultPage);
app.component("ModalDeleteFile", ModalDeleteFile);
app.component("QuillEditor", QuillEditor);

app.mount("#app");

