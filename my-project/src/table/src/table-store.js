/* eslint-disable */
import Vue from 'vue';

const sortData = (data, states) => {
  const sortingColumn = states.sortingColumn;
  if (!sortingColumn || typeof sortingColumn.sortable === 'string') {
    return data;
  }
  return orderBy(data, states.sortProp, states.sortOrder, sortingColumn.sortMethod, sortingColumn.sortBy);
};


const TableStore = function (table, initialState = {}) {
  if (!table) {
    throw new Error('Table is required.');
  }
  this.table = table;

  this.states = {
    rowKey: null,
    _columns: [],
    originColumns: [],
    columns: [],
    fixedColumns: [],
    rightFixedColumns: [],
    leafColumns: [],
    fixedLeafColumns: [],
    rightFixedLeafColumns: [],
    leafColumnsLength: 0,
    fixedLeafColumnsLength: 0,
    rightFixedLeafColumnsLength: 0,
    isComplex: false,
    filteredData: null,
    data: null,
    sortingColumn: null,
    sortProp: null,
    sortOrder: null,
    isAllSelected: false,
    selection: [],
    reserveSelection: false,
    selectable: null,
    currentRow: null,
    hoverRow: null,
    filters: {},
    expandRows: [],
    defaultExpandAll: false,
    selectOnIndeterminate: false
  };

  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }
};

TableStore.prototype.mutations = {
  setData(states, data) {
    const dataInstanceChanged = states._data !== data;
    states._data = data;
    Object.keys(states.filters).forEach((columnId) => {
      console.log("ha", states.filters)
      const values = states.filters[columnId];
      if (!values || values.length === 0) return;
      const column = getColumnById(this.states, columnId);
      if (column && column.filterMethod) {
        data = data.filter((row) => {
          return values.some(value => column.filterMethod.call(null, value, row, column));
        });
      }
    });

    states.filteredData = data;
    console.log(states._data)
    states.data = sortData((data || []), states);

    const rowKey = states.rowKey;

    if (!states.reserveSelection) {
      if (dataInstanceChanged) {
        this.clearSelection();
      } else {
        this.cleanSelection();
      }
      this.updateAllSelected();
    } else {
      if (rowKey) {
        const selection = states.selection;
        const selectedMap = getKeysMap(selection, rowKey);

        states.data.forEach((row) => {
          const rowId = getRowIdentity(row, rowKey);
          const rowInfo = selectedMap[rowId];
          if (rowInfo) {
            selection[rowInfo.index] = row;
          }
        });

        this.updateAllSelected();
      } else {
        console.warn('WARN: rowKey is required when reserve-selection is enabled.');
      }
    }


  }
};

TableStore.prototype.updateAllSelected = function() {
    const states = this.states;
    const { selection, rowKey, selectable, data } = states;
    if (!data || data.length === 0) {
      states.isAllSelected = false;
      return;
    }
  
    let selectedMap;
    if (rowKey) {
      selectedMap = getKeysMap(states.selection, rowKey);
    }
  
    const isSelected = function(row) {
      if (selectedMap) {
        return !!selectedMap[getRowIdentity(row, rowKey)];
      } else {
        return selection.indexOf(row) !== -1;
      }
    };
  
    let isAllSelected = true;
    let selectedCount = 0;
    for (let i = 0, j = data.length; i < j; i++) {
      const item = data[i];
      const isRowSelectable = selectable && selectable.call(null, item, i);
      if (!isSelected(item)) {
        if (!selectable || isRowSelectable) {
          isAllSelected = false;
          break;
        }
      } else {
        selectedCount++;
      }
    }
  
    if (selectedCount === 0) isAllSelected = false;
  
    states.isAllSelected = isAllSelected;
  };

TableStore.prototype.clearSelection = function () {
  const states = this.states;
  states.isAllSelected = false;
  const oldSelection = states.selection;
  if (states.selection.length) {
    states.selection = [];
  }
  if (oldSelection.length > 0) {
    this.table.$emit('selection-change', states.selection ? states.selection.slice() : []);
  }
};

TableStore.prototype.updateCurrentRow = function () {
  const states = this.states;
  const table = this.table;
  const data = states.data || [];
  const oldCurrentRow = states.currentRow;

  if (data.indexOf(oldCurrentRow) === -1) {
    states.currentRow = null;

    if (states.currentRow !== oldCurrentRow) {
      table.$emit('current-change', null, oldCurrentRow);
    }
  }
};

TableStore.prototype.commit = function (name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};

export default TableStore;
