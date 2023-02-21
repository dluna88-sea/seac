<script>
import { useCurrentUserStore } from '../../stores/currentUser';
import router from '../../router';
const currentUser = useCurrentUserStore();


async function cargarDatos(){
    if(currentUser.id == null){ currentUser.getDatos() }
    console.log(currentUser.loading)
}
cargarDatos();
</script>
<template>
    
    <DefaultPage>
        <div>
            <PageTitle><Icon name="people-fill"/> &nbsp;Usuarios</PageTitle>

            <div class="row">
                <div class="col">
                    <Card>
                    <CardHeader>
                        Usuarios registrados 10:
                    </CardHeader>
                    <CardBody>
                        <div class="list-group" >
                            <RouterLink v-for="i in 10" class="list-group-item" to="/">
                            <div class="row">
                                <div class="col-6">Hola</div>
                                <div class="col-6 float-right">Mundo</div>
                            </div>    
                            </RouterLink>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
        </div>

    </DefaultPage>

</template>