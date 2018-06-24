
<template>
  <div>
    MjTable
    <div v-mousewheel="handleHeaderFooterMousewheel" class="el-table__header-wrapper" ref="headerWrapper">
      <table-header ref="tableHeader">
      </table-header>
    </div>
  </div>
</template>

<script type="text/babel">
/* eslint-disable */
import TableHeader from "./table-header";
import TableStore from './table-store';
import Mousewheel from "../../directives/mousewheel";

export default {
    name: "MjTable",
    components: {
        TableHeader
    },
    data() {
        const store = new TableStore(this, {});
        return {
            store
        };
    },
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    directives: {
        Mousewheel
    },
    watch: {
        data: {
            immediate: true,
            handler(value) {
                console.log("SET VALUE");
                this.store.commit("setData", value);
            }
        }
    },
    mounted() {
        // init filters
        this.store.states.columns.forEach(column => {
            if (column.filteredValue && column.filteredValue.length) {
                this.store.commit("filterChange", {
                    column,
                    values: column.filteredValue,
                    silent: true
                });
            }
        });
    },
    methods: {
        handleHeaderFooterMousewheel(event, data) {
            const { pixelX, pixelY } = data;
            if (Math.abs(pixelX) >= Math.abs(pixelY)) {
                event.preventDefault();
                this.bodyWrapper.scrollLeft += data.pixelX / 5;
            }
        }
    }
};
</script>
