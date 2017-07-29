!function (ROOT) { 'use strict'


//// Standard metadata about this Seqin.
const META = {
    NAME:    { value:'Monty1MathSeqin' }
  , ID:      { value:'m1ma'            }
  , VERSION: { value:'1.0.0'           }
  , SPEC:    { value:'20170728'        }
  , HELP:    { value:
`Monty’s first (experimental) mathematical Seqin. @TODO description` }
}


//// METHODS
//// -------

//// SINGLE WAVEFORM
//// _getSingleWaveformId()
//// _renderSingleWaveformBuffer()

//// VALID PERFORM CONFIG
//// validSpecificPerform()


//// Check that the environment is set up as expected.
const SEQIN = ROOT.SEQIN // available on the window (browser) or global (Node.js)
if (! SEQIN)           throw new Error('The SEQIN global object does not exist')
if (! SEQIN.Seqin)     throw new Error('The base SEQIN.Seqin class does not exist')
if (! SEQIN.MathSeqin) throw new Error('The base SEQIN.MathSeqin class does not exist')


//// Define the main class.
SEQIN.Monty1MathSeqin = class Monty1MathSeqin extends SEQIN.MathSeqin {




    //// VALID PERFORM CONFIG

    //// Overridde the base Seqin class’s validSpecificPerform().
    //// Called by: constructor()
    //// Called by: perform() > _validateSpecificPerform()
    //// Can also be used to auto-generate unit tests and auto-build GUIs.
    get validSpecificPerform() { return [
        {
            title:   'Noise'
          , name:    'noise'
          , alias:   'nz'

          , tooltip: '@TODO add remarks'
          , devtip:  '@TODO add remarks'
          , form:    'range'

          , type:    'number'
          , min:     0
          , max:     9
          , step:    1
          , default: 2
        }
    ]}




    //// SINGLE WAVEFORM


    //// Returns a single-waveform ID, based on config passed to `perform()`,
    //// and also config passed to `constructor()`.
    //// Called by: perform() > _buildBuffers() > _getSingleWaveformBuffer()
    _getSingleWaveformId (config, bufferType) {
        const vsp = this.validSpecificPerform
        return super._getSingleWaveformId(config, bufferType)
          + '_'
          + vsp.find(v=>'noise'===v.name).alias // 'nz'
          + config.noise
    }


    //// Returns a new single-waveform buffer, filled with sample-values.
    //// Called by: perform() > _buildBuffers() > _getSingleWaveformBuffer()
    _renderSingleWaveformBuffer (config) {
        const samplesPerCycle = this.samplesPerBuffer / config.cyclesPerBuffer
        const f = Math.PI * 2 / samplesPerCycle // frequency
        const singleWaveformBuffer = this.audioContext.createBuffer(
                this.channelCount // numOfChannels
              , samplesPerCycle   // length
              , this.sampleRate   // sampleRate
            )
        for (let channel=0; channel<this.channelCount; channel++) {
            const singleWaveformChannel = singleWaveformBuffer.getChannelData(channel)

            for (let i=0; i<samplesPerCycle; i++) {
                let val = Math.tan(i * f)

				const lim = Math.log(samplesPerCycle - i) * config.noise / 2
				for (let j=2; j<lim; j++)
					if (0 === i % j)
						val /= j

				val = Math.max(val, -1)
				val = Math.min(val, 1)

                singleWaveformChannel[i] = val
            }
        }
        return Promise.resolve(singleWaveformBuffer)
    }

}


//// Add static constants to the main class.
Object.defineProperties(SEQIN.Monty1MathSeqin, META)


}( 'object' === typeof window ? window : global )
