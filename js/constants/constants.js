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
  cur: 8,
  trg: 9,
  bmk: 10,
  currency: 11
}

}


export default CONSTS