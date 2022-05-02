import { updateSection } from './changelog'
import minimist from 'minimist';
import { Config } from './config';
import { getPRsSinceLastRelease, PullRequest } from './github';

const generateChangelogSection = (prs: PullRequest[]) =>
{
    const entry = (pr: PullRequest) => {
        const bodyParts = pr.body?.split('## Changelog');
        let changelog = '';
        if (bodyParts && bodyParts.length > 1)
        {
            changelog = bodyParts[bodyParts.length - 1].trim() + '\n';
        }

        return `* [${pr.number}](${pr.html_url}) ${pr.title}`;
    }

    return prs.map(pr => entry(pr)).join('\n');
};

const main = async () => {
    const check = (name: string, v: Record<string, unknown>) =>{
        if (!v[name])
        {
            throw new Error(`Required argument --${name} not found`);
        }
    }

    const config = minimist<Config>(process.argv.slice(2));
    check('token', config);
    check('repo', config);
    check('org', config);

    const prs = await getPRsSinceLastRelease(config);
    
    console.log(generateChangelogSection(prs));
}

main().catch(err => {
    console.error(err);
})