<template>
    <div class="col-md-3 col-sm-4">
        <div class="panel panel-default">

            <a v-if="book" :href="/books/ + book.isbn">
                <div class="panel-body">
                    <h3>{{ book.title }}</h3>
                    <p>{{ book.author }}</p>
                </div>
            </a>

            <a v-if="!book" href="/book/add">
                <div class="panel-body">
                    <h1>
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                    </h1>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BookItem',
    props: ['book', 'add']
}
</script>
