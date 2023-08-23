<template>
    <div class="container">
        <div class="progress" v-if="loading">
            <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                style="width: 60%;">
                <span class="sr-only">60% Complete</span>
            </div>
        </div>

        <div class="alert alert-danger" v-if="error !== ''" role="alert">{{ error }}</div>

        <div v-if="!loading && error === ''">
            <ol class="breadcrumb">
                <li><a href="/user">Catalog</a></li>
                <li class="active">{{ book.title }}</li>
            </ol>

            <div class="alert alert-success" v-if="success !== ''" role="alert">{{ success }}</div>

            <div class="media">
                <div class="media-left">
                    <img class="media-object" src="http://via.placeholder.com/200x300" alt="Book cover">
                </div>
                <div class="media-body">
                    <h1 class="media-heading">{{ book.title }}</h1>
                    <p>Author: {{ book.author }}</p>
                    <p>{{ book.description }}</p>
                </div>
            </div>
            <div class="text-center">
                <a :href="'/borrow/' + book.isbn" class="btn btn-primary" role="button">
                    <span class="glyphicon glyphicon-leaf" aria-hidden="true"></span>
                    Borrow
                </a>
                <!-- <a @click="onDelete" class="btn btn-danger" role="button">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    Delete
                </a> -->
            </div>
        </div>
    </div>
</template>

<script>
import BookService from '../services/book.service';
import EventBus from '../common/EventBus'
export default {
    name: 'Book',
    data() {
        return {
            loading: false,
            book: {},
            error: "",
            success: ""
        }
    },
    mounted() {
        this.fetchBook()
    },
    methods: {
        fetchBook() {
            this.loading = true
            this.error = ""
            this.book = {}
             BookService.getBookById(this.$route.params.id).then(
                (response) => {
                    this.content = response.data;
                    this.book = response.data
                    this.loading = false
                },
                (error) => {
                     if (error.response.status === 401) this.$router.push('/login');
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
        onDelete() {
            this.loading = true
            this.error = ""
            this.success = ""
            this.$http.delete(`api/books/${this.$route.params.id}`)
                .then(response => {
                    this.loading = false
                    this.error = ""
                    this.success = response.body.message
                })
        }
    }
}
</script>