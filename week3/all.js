function saveLocalStorage(data) {
    const value = JSON.stringify(data);
    localStorage.setItem("vue2021", value)
}

function getLocalStorage() {
    const value = localStorage.getItem("vue2021");
    if (value == null) {
        return [];
    }
    const data = JSON.parse(value);
    return data;
}

const app = Vue.createApp({
    data() {
        return {
            list: [],
            create: {},
            edit: {},
            filter: {
                status: '全部'
            }
        };
    },
    methods: {
        createItem() {
            if(!this.create.text) {
                return;
            }

            this.create.id = new Date().getTime();
            this.create.status = false;

            this.list.push(this.create);

            this.create = {};

            saveLocalStorage(this.list)
        },
        deleteItem(item) {
            const index = this.list.indexOf(item);
            this.list.splice(index, 1);

            saveLocalStorage(this.list);
        },
        changeStatus() {
            saveLocalStorage(this.list);
        },
        doEdit(item) {
            this.edit = { ...item };
        },
        undoEdit() {
            this.edit = {};
        },
        saveEdit(){
            const item = this.list.filter(m => m.id === this.edit.id)[0];
            const index = this.list.indexOf(item);
            this.list[index] = {...this.edit};
            this.edit = {};

            saveLocalStorage(this.list);
        },
        clearList() {
            this.list = [];

            saveLocalStorage(this.list)
        }
    },
    computed: {
        filterResult() {
            if (this.filter.status === '全部') {
                return this.list;
            } else {
                return this.list.filter(m => m.status.toString() === this.filter.status);
            }
        }
    },
    mounted() {
        this.list = getLocalStorage();
    },
})

app.mount('#app');