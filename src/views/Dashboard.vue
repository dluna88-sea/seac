<script setup>

</script>

<template>

    <DefaultPage>
        
        <PageTitle>Bienvenido</PageTitle>
        <div class="row">

            <!-- CARD MÓDULOS DE TRANSPARENCIA -->
            <div class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="boxes" /> Transparencia</h2>
        
                    <ul class="list-group my-3">
                        <RouterLink to="/" class="list-group-item">An item</RouterLink>
                    </ul>

                    <button class="btn btn-outline-secondary" type="button"><Icon name="plus" />Ver más</button>
                </BigCard> 
            </div>

            <!-- CARD BOLETINES DE PRENSA -->
            <div class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="file-text" /> Boletines</h2>
                    <p>Publica un nuevo boletín o administra los existentes.</p>
                    <div class="btn-group d-flex" role="group">
                        <button class="btn btn-outline-secondary" type="button"><Icon name="pencil" /> Crear nuevo</button>
                        <button class="btn btn-outline-secondary" type="button"><Icon name="files" /> Ver todos</button>
                    </div>
                </BigCard>
            </div>

            <!-- CARD PERFIL DE USUARIO -->
            <div class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="person-fill" /> Mi perfil</h2>
                    <p>Administra tu cuenta:</p>
                    <ul class="list-group list-group-flush my-3">
                        <li class="list-group-item"><Icon name="person-vcard" /> Editar datos personales</li>
                        <li class="list-group-item"><Icon name="shield-lock-fill" /> Recuperar o cambiar la contraseña</li>
                    </ul>
                    <button class="btn btn-outline-secondary" type="button"><Icon name="gear-fill" /> Administrar</button>
                </BigCard>
            </div>

            <!-- ADMIN: CARD USUARIOS REGISTRADOS -->
            <div class="col-md-6 col-xl-4 my-3">
                <BigCard>
                    <h2><Icon name="people-fill" /> Usuarios</h2>
                    <ul class="list-group list-group-flush my-3">
                        <li class="list-group-item"><Icon name="person-check-fill" /> Administra los usuarios registrados</li>
                        <li class="list-group-item"><Icon name="person-fill-add" /> Registra nuevos usuarios</li>
                        <li class="list-group-item"><Icon name="person-fill-gear" /> Asigna o revoca nuevos roles</li>
                    </ul>
                    <button class="btn btn-outline-secondary" type="button"><Icon name="gear-fill" /> Administrar</button>
                </BigCard>
            </div>
            
        </div>

    </DefaultPage>
</template>