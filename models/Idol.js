const mongoose = require('mongoose')

const IdolSchema = new mongoose.Schema({
  idolId: {
    type: String,
    default: 'some idol id ahihi'
  },
  idolUrl: {
    type: String,
    default: 'some idol idolUrl ahihi'
  },
  botWatchingIds: {
    type: [String],
    default: []
  },
  watchingOnVmId: {
    type: String,
    default: 'some idol VmId ahihi'
  },
  status: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'CHILLING'],
    default: 'CHILLING'
  }
})

const Idol = mongoose.model('Idol', IdolSchema)

const idolFactory = ({ idolId, idolUrl, botWatchingIds, watchingOnVmId }) => {
  return new Idol({
    idolId,
    idolUrl,
    botWatchingIds,
    watchingOnVmId
  }
  )
}

module.exports = { idolFactory, Idol }
