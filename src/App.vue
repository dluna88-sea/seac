<script setup>

import { useCurrentUser } from './stores/currentUser'
const currentUser = useCurrentUser();

const getDatos = async() => {
	console.log('sd')
	await currentUser.getSecciones('mrDOSd3L6wVKjLVePZK9')
}
getDatos();
</script>

<template>

	<!-- <router-view></router-view> -->
</template>