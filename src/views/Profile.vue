<template>
    <DefaultPage>
        <PageTitle>
            <Icon name="person-fill" /> &nbsp;Perfil de usuario
        </PageTitle>

        <div class="row">
            <div class="col-md-6 mt-3">
                <form class="form-floating">
                    <input type="text" class="form-control" id="nombre" placeholder="Escribe tu dirección correo electrónico" value="John Camaney">
                    <label for="nombre">Nombre</label>
                    <div class="d-grid mt-2">
                        <button class="btn btn-secondary block">Actualizar</button>
                    </div>
                </form>
            </div>
            <div class="col-md-6 mt-3">
                <form class="form-floating">
                    <input type="email" class="form-control" id="email" placeholder="Escribe tu dirección correo electrónico" value="test@example.com">
                    <label for="email">Correo electrónico</label>
                    <div class="d-grid mt-2">
                        <button class="btn btn-secondary block">Actualizar</button>
                    </div>
                </form>
            </div>
            
        </div>

    </DefaultPage>
</template>