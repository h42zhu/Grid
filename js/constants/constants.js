import keymirror from 'keymirror'

const CONSTS = {

ACTIONS: keymirror({
  PAGINATE: null,
  EDITCELL: null,
  REFRESH: null,
  REQUESTDATA: null,
  RECEIVEDATA: null

}),

DEFAULT: {
  HIERARCHY: [],
  DISPLAY: 'percentage',
  URL: '/api/port_data'
},


INDEXMAP: {
  sec_name: 3,
  asset_class: 4,
  region: 5,
  sec_class: 7,
  cur: 8,
  trg: 9,
  bmk: 10,
  currency: 11,
  cashflow: 12
}

}


export default CONSTS