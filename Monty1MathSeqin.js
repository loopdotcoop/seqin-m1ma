!function (ROOT) { 'use strict'


//// Standard metadata about this Seqin.
const META = {
    NAME:    { value:'Monty1MathSeqin' }
  , ID:      { value:'m1ma'            }
  , VERSION: { value:'0.0.5'           }
  , SPEC:    { value:'20170705'        }
  , HELP:    { value:
`Monty’s first (experimental) mathematical Seqin. @TODO description` }
}


//// Check that the environment is set up as expected.
const SEQIN = ROOT.SEQIN // available on the window (browser) or global (Node.js)
if (! SEQIN)           throw new Error('The SEQIN global object does not exist')
if (! SEQIN.Seqin)     throw new Error('The base SEQIN.Seqin class does not exist')
if (! SEQIN.MathSeqin) throw new Error('The base SEQIN.MathSeqin class does not exist')


//// Define the main class.
SEQIN.Monty1MathSeqin = class extends SEQIN.MathSeqin {

    constructor (config) {
        super(config)
    }


    _buildBuffers(config) {

        //// Validate config and get empty buffers.
        const buffers = super._buildBuffers(config);
		//@TODO something like super.super, to just get seqin-si’s empty buffers

		const noise = null == config.noise ? 0.5 : config.noise;

		if(noise < 0 || noise > 1) {
			throw new RangeError(`Seqin m1ma: noise '${noise}' out of range`);
		}

		const f = Math.PI * (config.cyclesPerBuffer / this.samplesPerBuffer);

		config.events.forEach((event, eventI) => {
			buffers.map(buffer => {
				for(let channel = 0; channel < this.channelCount; channel++) {
					const channelBuffer = buffer.data.getChannelData(channel);

					const iLimit = event[eventI + 1] ? event[eventI + 1].at : this.samplesPerBuffer;

					console.log(event.at, iLimit);

					for(let i = event.at; i < iLimit; i++) {
						let val = 0;
						val += Math.tan(i * f);

						const lim = Math.log(channelBuffer.length - i) * noise;

						for(let j = 2; j < lim; j++) {
							if(i % j == 0) {
								val /= j;
							}
						}

						val = Math.max(val, -1);
						val = Math.min(val, 1);

						val = event.down ? val : 0;

						channelBuffer[i] = val;
					}
				}
			});
		});


        return buffers

    }
}


//// Add static constants to the main class.
Object.defineProperties(SEQIN.Monty1MathSeqin, META)


}( 'object' === typeof window ? window : global )
