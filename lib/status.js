/**
 *
 * @param {*} res
 * @param {*} code
 * @param {*} data
 */
function sendSuccessStatus(res, code, data) {
    let send_data = { success: true }

    if (typeof data === 'object') {
        send_data = Object.assign(data, send_data)
    }

    if (!typeof code !== undefined) res.statusCode = code;
    return res.json(send_data);
}

/**
 *
 * @param {*} res
 * @param {*} code
 * @param {*} data
 */
function sendErrorStatus(res, code, err) {
    if (err === undefined) {
        err = 'Try again'
    }

    if (typeof code !== undefined) res.statusCode = code;

    res.send({ success: false, error: err })

}

module.exports = {
    sendSuccessStatus: sendSuccessStatus,
    sendErrorStatus: sendErrorStatus
}