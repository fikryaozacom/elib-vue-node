<template>
    <div>
        <div class="progress" v-if="loading">
            <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                style="width: 60%;">
                <span class="sr-only">60% Complete</span>
            </div>
        </div>

        <div class="alert alert-danger" v-if="error !== ''" role="alert">{{ error }}</div>

        <div v-if="!loading">
            <Item v-for="book in books" :book="book" :key="book.isbn" :add="''" />
            <Item :add="'Add new Book'" />
        </div>
    </div>
</template>

<script>
import BookService from '../services/book.service';
import Item from './BookItem.vue';
import EventBus from '../common/EventBus';
export default {
    name: 'Book',
    components: {
        'Item': Item
    },
    data() {
        return {
            loading: false,
            books: [],
            error: ""
        };
    },
    mounted() {
        this.error = ""
        this.books = []
        this.loading = true
        BookService.getListBook().then(
            (response) => {
                this.content = response.data;
                this.books = response.data
                this.loading = false
            },
            (error) => {
                 if (error.response.status === 401)  EventBus.dispatch("logout");
                this.content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                if (error.response && error.response.status === 403) {
                    EventBus.dispatch("logout")
                }
                this.loading = false
            }
        );
    },
}
</script>