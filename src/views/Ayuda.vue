<script setup>

const bread = [
    { text:'Panel', href:'/', class:'' },
    { text:'Ayuda', href:'', class:'active' }
];

</script>

<template>

<DefaultPage>
    
    <PageTitle :bread="bread"><Icon name="info-circle-fill"/> Ayuda</PageTitle>
    <div class="row">
        <BigCard>
            <h3>Manual de usuario</h3>
            <p></p>
        </BigCard>
    </div>
</DefaultPage>
</template>