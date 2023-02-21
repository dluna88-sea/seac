<script>
import { useCurrentUserStore } from '../../stores/currentUser';
import router from '../../router';
const currentUser = useCurrentUserStore();

async function cargarDatos(){

}
cargarDatos();
</script>
<template>
    <Loading v-if="currentUser.loading"></Loading>
    <DefaultPage v-else>

        <PageTitle><Icon name="people-fill"/> &nbsp;Usuarios</PageTitle>
        
        
        <div class="row">
            <div class="col">
                <Card>
                <CardHeader>
                    Usuarios registrados 10:
                </CardHeader>
                <CardBody>
                    <ul class="list-group">
                        <li class="list-group-item" v-for="i in 10">Lorem ipsum {{ i }}</li>
                    </ul>
                </CardBody>
            </Card>
            </div>
        </div>

    </DefaultPage>

</template>