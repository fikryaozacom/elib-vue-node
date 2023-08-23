<template>
    <div class="col-md-8 m-auto">
        <div class="card card-container mt-5">
         <table class="table">
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header.id">
                  {{ header }}
                </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="history.length === 0">
                    <td>No data</td>
                </tr>
                <tr v-else v-for="(item, index) in history" :key="item.book_id">
                    <td scope="row">{{ index + 1 }}</td>
                    <td>{{ item.book_id }}</td>
                    <td>{{ item.user }}</td>
                    <td>{{ item.date_borrow }}</td>
                    <td>{{ item.due_date }}</td>
                    <td>{{ item.status }}</td>
                    <td> <a :href="'/borrow/update/' + item.borrow_id" class="btn btn-danger" role="button">
                            <span class="glyphicon glyphicon-leaf" aria-hidden="true"></span>
                            Cancel
                        </a>
                    </td>
                
                </tr>
              </tbody>
            </table>
        </div>
    </div>
</template>

<script>
// import BookService from '../services/book.service';
import UserService from '../services/user.service';
import EventBus from '../common/EventBus'
export default {
    name: 'BorrowBook',
     data() {
        return {
            successful: false,
            loading: false,
            message: '',
            email: this.$store.state.auth.user ? this.$store.state.auth.user.email : "",
            history: [],
            disabled: 1,
             headers: [
                "NO", "BOOK ID", 'USER', 'DATE_BORROW', 'DUE_DATE', 'STATUS', 'ACTION'
            ],
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
     mounted() {
        this.fetchHistory()
    },
    methods: {
        fetchHistory() {
            this.loading = true
            this.error = ""
            this.book = {}
            UserService.getUserBoard().then(
                (response) => {
                    this.content = response.data;
                    this.history = response.data.borrow
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
        }
    }
}
</script>