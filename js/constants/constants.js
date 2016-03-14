import keymirror from 'keymirror'

const ACTIONS = keymirror({
    PAGINATE: null,
    EDITCELL: null,
    REQUESTDATA: null,
    RECEIVEDATA: null,
    BUILDVTREE: null,
    TOGGLEDISP: null,

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
    TOGGLEPORTFOLIO: "TOGGLEPORTFOLIO",
    HIERARCHY: "HIERARCHY"
}

const ITEMTYPES = {
    DROPBOX: "DROPBOX",
    CARD: "CARD"
}


const ALLHEIRARCHY = [
    {id: 0, value: "security_class", text: "Security Class"},
    {id: 1, value: "asset_class", text: "Asset Class"},
    {id: 2, value: "region", text: "Region"},
    {id: 3, value: "market_cap", text: "Market Cap"},
]

export {ACTIONS, COLMAP, DEFSTYLE, COMPREFS, ITEMTYPES, ALLHEIRARCHY}
