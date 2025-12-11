const helper = require('node-red-node-test-helper')
const should = require('should') // eslint-disable-line no-unused-vars

const { testData1 } = require('../fixtures/index.js')
const { verifyFlowLoaded } = require('../utils.js')
const testFlow1 = testData1.flows
const nodeImports = testData1.getImports(null, ['ui_gauge'])

helper.init(require.resolve('node-red'))

describe('ui-gauge node (tank type)', function () {
    beforeEach(function (done) {
        helper.startServer(done)
    })

    afterEach(function (done) {
        helper.unload()
        helper.stopServer(done)
    })

    const flow = [
        {
            id: 'node-ui-gauge',
            type: 'ui-gauge',
            z: 'tab-id',
            group: 'config-ui-group',
            name: '',
            order: 0,
            width: 0,
            height: 0,
            gtype: 'gauge-tank',
            gstyle: 'needle',
            value: 'payload',
            valueType: 'percent',
            min: 0,
            max: 10,
            title: 'Tank',
            alwaysShowTitle: false,
            units: 'L',
            icon: '',
            prefix: '',
            suffix: '',
            segments: [],
            sizeThickness: 16,
            sizeGap: 4,
            sizeKeyThickness: 8,
            className: '',
            x: 290,
            y: 180,
            wires: []
        },
        ...testFlow1
    ]

    it('should be registered with the ui-base as a tank gauge', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)

        const base = helper.getNode('config-ui-base')
        const widget = base.ui.widgets.get('node-ui-gauge')

        widget.props.should.have.property('gtype', 'gauge-tank')
        widget.props.should.have.property('valueType', 'percent')
    })

    it('should pass the incoming payload through when using percent valueType', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)

        const base = helper.getNode('config-ui-base')
        const widget = base.ui.widgets.get('node-ui-gauge')

        const msg = await widget.hooks.beforeSend({ payload: 7 })
        msg.should.have.property('payload', 7)
    })
})
