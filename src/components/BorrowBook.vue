<template>
    <div class="col-md-8 m-auto">
        <div class="card card-container mt-5">
            <Form @submit="handleBorrow" :validation-schema="schema">
                <div v-if="!successful">
                    
                    <div class="mb-3">
                        <label for="book_id">Book ID</label>
                        <Field name="book_id" id="book_id" disabled type="text" v-model="book.isbn" class="form-control" />
                    </div>
                    
                    <div class="mb-3">
                        <p>Date Borrow:</p>
                         <datepicker v-model="date_borrow" placeholder="Select Date"
                            @input="dateSelected"
                            :open-date="new Date()"
                            :disabledDates="{
                                to: defaultValue, // Disable all dates after specific date
                            }"
                             name="date_borrow"></datepicker>
                    </div>

                    <div class="mb-3">
                            <p>Due Date</p>
                             <datepicker v-model="due_date" placeholder="Select Date"
                                @input="dateSelected2"
                                :open-date="new Date()"
                                :disabledDates="{
                                    to: defaultValue2, // Disable all dates after specific date
                                }" name="due_date"></datepicker>
                        </div>

                    <div class="mb-3">
                        <label for="user">User</label>
                        <Field name="user" type="text" disabled v-model="email" id="user" class="form-control" />
                    </div>

                    <div class="mb-0">
                        <button class="btn btn-primary btn-block" :disabled="loading">
                            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                            <span>Submit</span>
                        </button>
                    </div>
                </div>
            </Form>

            <div class="mb-3">
                <div v-if="message" class="alert" :class="successful ? 'alert-success' : ' alert-danger'" role="alert">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import moment from 'moment'
import { ref } from 'vue';
import BookService from '../services/book.service';
import EventBus from '../common/EventBus'
import Datepicker from 'vuejs3-datepicker';

export default {
    name: 'BorrowBook',
    components: {
        Form, Field,Datepicker
    },
    setup() {
        const defaultValue = ref(new Date())
        const defaultValue2 = ref(new Date())
        function dateSelected(payload) {
            console.log('dateSelected', payload)
            
        }
        function dateSelected2(payload) {
            console.log('dateSelected2', payload)
        }
        return {
            dateSelected,
            dateSelected2,
            defaultValue,
            defaultValue2,
        }
    },
    data() {
        const schema = yup.object().shape({
            // username: yup.string().required('Username is required!').min(3, 'Must be at least 3 characters!').max(20, 'Must be a maximum of 20 characters').label('Username'),
            // due_date: yup.date().required('Due Date is required!'),
            // password: yup.string().required('Password is required!').min(8, 'Must be at least 6 characters!').max(20, 'Must be a max of 20 characters!').label('Password'),
        });
        return {
            successful: false,
            loading: false,
            message: '',
            email: this.$store.state.auth.user ? this.$store.state.auth.user.email : "",
            book: {},
            date_borrow: '',
            due_date: '',
            disabled: 1,
            schema
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
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
                     if (error.response.status === 401)  EventBus.dispatch("logout")
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
        handleBorrow(user) {
            this.message = '';
            this.successful = false;
            this.loading = true;
            if(this.date_borrow.length < 1 || this.due_date.length < 1) {
                this.successful = false;
                this.loading = false;
                this.message = "Date cannot be empty"
                return
            }
            user.date_borrow = moment(this.date_borrow).format('YYYY-MM-DD')
            user.due_date = moment(this.due_date).format('YYYY-MM-DD')

            this.$store.dispatch("auth/borrow_book", user).then(
                (data) => {
                    this.message = data.message;
                    this.successful = true;
                    this.loading = false;
                    setTimeout(() => this.$router.push('/user'), 2000);
                    
                },
                (error) => {
                    this.message = (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.successful = false;
                    this.loading = false;
                }
            );
        },
    },
}
</script>

<style></style>