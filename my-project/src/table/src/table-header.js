/* eslint-disable */
import Vue from 'vue';

export default {
  name: 'MjTableHeader',
  render(h) {
    return (
      <table
        class="el-table__header"
        cellspacing="0"
        cellpadding="0"
        border="0">
        123
      </table>
    );
  },

  data() {
    return {
      draggingColumn: null,
      dragging: false,
      dragState: {}
    };
  }
};
