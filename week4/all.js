import { createApp, ref, onMounted, computed  } from './node_modules/vue/dist/vue.esm-browser.js';

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

const app = createApp({
    setup() {

        // 建立 todo 事項
        const create = ref({});
        function createItem() {
            if (!create.value.text) {
                return;
            }

            create.value.id = new Date().getTime();
            create.value.status = false;

            list.value.push(create.value);

            create.value = {};

            saveLocalStorage(list.value)
        }

        // 編輯 todo 事項
        const edit = ref({});
        function changeStatus() {
            saveLocalStorage(list.value);
        }
        function doEdit(item) {
            edit.value = { ...item };
        }
        function undoEdit() {
            edit.value = {};
        }
        function saveEdit() {
            const item = list.value.filter(m => m.id === edit.value.id)[0];
            const index = list.value.indexOf(item);
            list.value[index] = { ...edit.value };
            edit.value = {};

            saveLocalStorage(list.value);
        }

        // todo list 處理
        const list = ref([]);
        const filter = ref({
            status: '全部'
        }); 
        const filterResult = computed(() => {
            if (filter.value.status === '全部') {
                return list.value;
            } else {
                return list.value.filter(m => m.status.toString() === filter.value.status);
            }
        });
        function deleteItem(item) {
            const index = list.value.indexOf(item);
            list.value.splice(index, 1);

            saveLocalStorage(list.value);
        }
        function clearList() {
            list.value = [];

            saveLocalStorage(list.value)
        }

        onMounted(() => {
            list.value = getLocalStorage();
        })

        return {
            list,
            create,
            edit,
            filter,

            createItem,
            deleteItem,
            changeStatus,
            doEdit,
            undoEdit,
            saveEdit,
            clearList,

            filterResult,
        };
    }
});

app.mount('#app');