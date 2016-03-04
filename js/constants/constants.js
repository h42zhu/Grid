import keymirror from 'keymirror'

const ACTIONS = keymirror({
    PAGINATE: null,
    EDITCELL: null,
    REFRESH: null,
    REQUESTDATA: null,
    RECEIVEDATA: null,
    BUILDVTREE: null

})

const COLMAP = {
    cur: "weight_current",
    trg: "weight_target",
    bmk: "weight_benchmark",
    edit: ['trg']

}

export {ACTIONS, COLMAP}
