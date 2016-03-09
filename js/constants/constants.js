import keymirror from 'keymirror'

const ACTIONS = keymirror({
    PAGINATE: null,
    EDITCELL: null,
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

const DEFSTYLE = {
    SUPERHEADER: {width: 180, height: 25},
    HEADER: {width: 60, height: 25},
    DATACELL: {width: 60, height: 25}

}

const COMPREFS = {
    TOGGLEPORTFOLIO: "TOGGLEPORTFOLIO"
}

const ITEMTYPES = {
    DROPBOX: "DROPBOX",
    CARD: "CARD"
}

export {ACTIONS, COLMAP, DEFSTYLE, COMPREFS, ITEMTYPES}
