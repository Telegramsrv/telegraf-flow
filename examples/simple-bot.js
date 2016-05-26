var Telegraf = require('telegraf')
var Flow = require('../lib/flow')

var telegraf = new Telegraf(process.env.BOT_TOKEN)
var flow = new Flow()

// For testing only. Session will be lost on app restart
telegraf.use(Telegraf.memorySession())

// Add middleware
telegraf.use(flow.middleware())

// Register flow
flow.registerFlow('deadbeef',
  function * () {
    yield this.reply(this.state.flow.message || 'Hi')
  },
  function * () {
    if (this.message && this.message.text && this.message.text.toLowerCase() === 'hi') {
      yield this.reply('Buy')
      return this.stopFlow()
    }
    yield this.startFlow('deadbeef', {message: 'Really?'})
  }
)

// start flow on command
telegraf.hears('/flow', function * () {
  yield this.startFlow('deadbeef')
})

telegraf.startPolling()
