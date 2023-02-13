<script>
import { useDataUserStore } from '../../stores/dataUser';
import router from '../../router';
const dataUser = useDataUserStore();
async function cargarDatos(){
    if(dataUser.datos.length == 0){
        await dataUser.getData();
    }

    if(dataUser.datos.rol != "admin"){
        dataUser.setError('No tienes permisos para acceder a la página solicitada')
        router.push('/');
    }else{

        

    }
}
cargarDatos();
</script>
<template>
    
    <DefaultPage>

        <PageTitle><Icon name="people-fill"/> &nbsp;Usuario: {{ usuario.nombre }}</PageTitle>
        <div class="row">

        </div>

    </DefaultPage>

</template>