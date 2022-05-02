import { updateSection } from './changelog'
import minimist from 'minimist';
import { Config } from './config';
import { getPRsSinceLastRelease } from './github';


const config = minimist<Config>(process.argv.slice(2));
const prs = await getPRsSinceLastRelease(config);
