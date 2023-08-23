<template>
    <div class="container">
        <header class="jumboptron">
            <div class="col-md-8 m-auto">
                <div class="card card-container mt-5">
                    <p>
                    BORROW ID : {{ this.$route.params.id }}</p>
                    <Form @submit="handleUpdate">
                        <div class="mb-3">
                        <p>Status : </p>
                        <div v-if="this.$store.state.auth.user.roles[0] === 'ROLE_ADMIN'" class="mb-3">
                            <select name="status" id="status" v-model="selected">
                            <option disabled value="">Please select one</option>
                            <option>Borrowed</option>
                            <option>Returned</option>
                            <option>Cancel</option>
                            </select>
                        </div>   
                         <div v-else class="mb-3">
                                <select name="status" id="status" v-model="selected">
                                <option disabled value="">Please select one</option>
                                <option>Cancel</option>
                                </select>
                            </div>  
                         <div class="mb-3">
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
        </header>
    </div>
</template>

<script>
import { Form } from 'vee-validate'
export default {
    name: 'BorrowUpdate',
     components: {
        Form
    },
    data() {
        
        return {
            loading: false,
            message: '',
            selected: '',
        }
    },
     methods: {
         handleUpdate(data) {
            this.successful = false;
            this.loading = true;
            if(this.selected.length < 1) {
                this.successful = false;
                this.loading = false;
                this.message = "Status cannot be empty"
                return
            } 
            data.status = this.selected
            data.borrow_id = this.$route.params.id
            this.$store.dispatch("auth/borrow_update", data).then(
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
         }
     }
}
</script>