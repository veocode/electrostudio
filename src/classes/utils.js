class Utils {

    static snap(value, snapSize = 10) {
        return Math.round(value / snapSize) * snapSize
    }

}

module.exports = Utils;