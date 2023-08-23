<template>
    <div class="container">
        <header class="jumboptron">
            <h3>BOOK LIST</h3>
        </header>
        <Book />
    </div>
</template>

<script>
import UserService from '../services/user.service';
import EventBus from '../common/EventBus'
import Book from './BookList.vue'
export default {
    name: 'User',
    components: {
        Book : Book
    },
    data() {
        return {
            content: '',
        };
    },
    mounted() {
        UserService.getUserBoard().then(
            (response) => {
                this.content = response.data;
            },
            (error) => {
                this.content = 
                    (error.response &&
                     error.response.data &&
                     error.response.data.message) ||
                    error.message ||
                    error.toString();
                
                if (error.response && error.response.status === 403) {
                    EventBus.dispatch("logout")
                }
            }
        );
    },
}
</script>

<style>

</style>