<script setup>
import { useDepartamentosStore } from '../../../stores/departamentos';
import { useUsuariosStore } from '../../../stores/usuarios';

const departamentos = useDepartamentosStore();
const usuarios = useUsuariosStore();

const props = defineProps({
    userList:{
        type:Object,
        required:true
    }
});

async function getDptos(){
    await departamentos.getAll();
    let userList = []
    
}
getDptos();


const editDpto = (id) => {
    const name = document.getElementById('dpto_'+id);
    const titular = document.getElementById('titular_'+id);

    document.getElementsByName('departamento').forEach((e) => {
        e.setAttribute('disabled','disabled');
    });

    document.getElementsByName('titular').forEach((e) => {
        e.setAttribute('disabled','disabled');
    });

    document.getElementsByName('okbtn').forEach((e) => {
        e.classList.add('d-none');
    });

    document.getElementsByName('editbtn').forEach((e) => {
        e.classList.remove('d-none');
    })

    document.getElementById('btn_edit_'+id).classList.add('d-none');
    document.getElementById('btn_update_'+id).classList.remove('d-none');

    name.removeAttribute('disabled');
    name.focus()
    titular.removeAttribute('disabled');
}

const updateDpto = async(id) => {
    let titular = document.forms['dptoForm_'+id]['titular'].value.trim();
    let departamento = document.forms['dptoForm_'+id]['departamento'].value.trim();

    if(titular == 'SIN ASIGNAR'){
        titular = "";
    }

    if(departamento != ""){
        await departamentos.get(id).then( async() => {
            let datos = { 
                nombre:departamentos.datos.nombre, 
                titular:departamentos.datos.titular 
            };
            if(departamentos.datos.nombre != departamento) datos.nombre = departamento;
            if(departamentos.datos.titular != titular) datos.titular = titular;

            departamentos.message.success = true;
            
            document.forms['dptoForm_'+id]['titular'].disabled = true;
            document.forms['dptoForm_'+id]['departamento'].disabled = true;
            await departamentos.editar(id,datos);

        }).catch((e) => { console.log(e.message); departamento.message.error = true; departamento.message.text = e.message; })
    }else{
        document.getElementsByName('departamento').forEach((e) => {
            e.setAttribute('disabled','disabled');
        });

        document.getElementsByName('titular').forEach((e) => {
            e.setAttribute('disabled','disabled');
        });

        document.getElementsByName('okbtn').forEach((e) => {
            e.classList.add('d-none');
        });

        document.getElementsByName('editbtn').forEach((e) => {
            e.classList.remove('d-none');
        })
    }

}

</script>

<template>
    <div class="modal fade" id="dptosListModal" aria-hidden="true" aria-labelledby="dptosListModalLabel" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="dptosListModalLabel">
                        Departamentos registrados
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    
                </div>
                <div class="modal-body">
                    
                    <div class="mb-4">
                        <Success v-if="departamentos.message.success">{{ departamentos.message.text }}</Success>
                        <Error v-if="departamentos.message.error">{{ departamentos.message.text }}</Error>
                    </div>

                    <form class="input-group mb-2" v-for="dpto in departamentos.all" @submit.prevent="updateDpto(dpto.id)" :name="`dptoForm_${dpto.id}`">
                        <input required disabled type="text" class="form-control" name="departamento" :id="`dpto_${dpto.id}`" :value="dpto.nombre">
                        <select disabled class="form-control" name="titular" :id="`titular_${dpto.id}`">
                            <option selected :value="dpto.titular.id">{{ dpto.titular.nombre }}</option>
                            <optgroup label="Asignar a:">
                                <option v-for="us in userList" :value="us.id" >{{ us.nombre }}</option>
                            </optgroup>
                        </select>
                        <button type="submit" class="btn btn-success d-none" name="okbtn" :id="`btn_update_${dpto.id}`"><Icon name="check-circle" /></button>
                        <button type="button" @click="editDpto(dpto.id)" name="editbtn" :id="`btn_edit_${dpto.id}`" class="btn btn-secondary"><Icon name="pencil" /></button>
                        <button type="button" class="btn btn-danger"><Icon name="x-circle" /></button>
                    </form>
                    <!-- <table class="table">
                        <tr class="p-0 bg-light" style="border: 1px solid #ececec;" v-for="dpto in departamentos.all" >
                            <td class="p-2">
                                <div class="input-group">
                                    <input type="text" class="form-control" name="departamento" id="departamento" :value="dpto.nombre">
                                    <select class="form-control" name="titular" id="titular">
                                        <option :value="dpto.titular.id">{{ dpto.titular.nombre }}</option>
                                    </select>
                                    <button class="btn btn-secondary"><Icon name="pencil" /></button>
                                    <button class="btn btn-danger"><Icon name="x-circle" /></button>

                                </div>
                            </td>
                        </tr>

                    </table> -->
                </div>

            </div>

        </div>
    </div>
</template>