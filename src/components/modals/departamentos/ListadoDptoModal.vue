<script setup>
import { useDepartamentosStore } from '../../../stores/departamentos';

const departamentos = useDepartamentosStore();

async function getDptos(){
    await departamentos.getAll();
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
    })

    name.removeAttribute('disabled');
    name.focus()
    titular.removeAttribute('disabled');
}

const updateDpto = (id) => {

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
                    <form class="input-group my-2" v-for="dpto in departamentos.all" @submit.prevent="updateDpto(dpto.id)" :name="`dptoForm_${dpto.id}`">
                        <input disabled type="text" class="form-control" name="departamento" :id="`dpto_${dpto.id}`" :value="dpto.nombre">
                            <select disabled class="form-control" name="titular" :id="`titular_${dpto.id}`">
                                <option :value="dpto.titular.id">{{ dpto.titular.nombre }}</option>
                            </select>
                            <button @click="editDpto(dpto.id)" class="btn btn-secondary"><Icon name="pencil" /></button>
                            <button class="btn btn-danger"><Icon name="x-circle" /></button>
                            
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