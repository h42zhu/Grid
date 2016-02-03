import CONSTS from '../constants/constants'
import superagent from 'superagent';

// http://rackt.org/redux/docs/advanced/AsyncActions.html

function requestData (url) {
    return superagent
        .get(url)
        .accept('json')
        .end(function(err, res){
            if (err) {
                throw err
            }
            return ({data: res.body})
        })
    
}

export {requestData} 