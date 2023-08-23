<template>
    <div class="container">
        <header class="jumboptron">
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
            <tr v-if="items.length === 0">
                <td>No data</td>
            </tr>
            <tr v-else v-for="(item, index) in items" :key="item.book_id">
                <td scope="row">{{ index + 1 }}</td>
                <td>{{ item.book_id }}</td>
                <td>{{ item.user }}</td>
                <td>{{ item.date_borrow }}</td>
                <td>{{ item.due_date }}</td>
                <td>{{ item.status }}</td>
                <td> <a :href="'/borrow/update/' + item.borrow_id" class="btn btn-primary" role="button">
                        <span class="glyphicon glyphicon-leaf" aria-hidden="true"></span>
                        Update
                    </a>
                </td>
                
            </tr>
          </tbody>
        </table>
            </div>
        </div>
        </header>
    </div>
</template>

<script>
import UserService from '../services/user.service';
import EventBus from '../common/EventBus'
export default {
    name: 'User',
    data() {
        return {
            content: '',
            headers: [
                "NO", "BOOK ID", 'USER', 'DATE_BORROW', 'DUE_DATE', 'STATUS', 'ACTION'
            ],
            items: []
        };
    },
    methods: {
        add: function (item) {
            this.items.push(item); // push item to existing array
        }
    },
    mounted() {
        UserService.getAdminBoard().then(
            (response) => {
                this.items = response.data.data;
            },
            (error) => {
                if(error.response.status === 401)  EventBus.dispatch("logout");
                this.content = 
                    (error.response &&
                     error.response.data &&
                     error.response.data.message) ||
                    error.message ||
                    error.toString();
            }
        );
    },
}
</script>

<style>

</style>