// @flow
// .pillars
import styled from 'react-emotion';

import { mobileLandscape } from 'pasteup/breakpoints';

import Pillar from './Pillar';

const Pillars = styled('ul')({
    clear: 'right',
    margin: 0,
    paddingTop: 10,
    paddingBottom: 10,
    listStyle: 'none',
    listStyleImage: 'none',
    [mobileLandscape]: {
        paddingLeft: 20,
    },
});
Pillars.displayName = 'Pillars';

export default ({ pillars }) => (
    <Pillars>
        {pillars.map((pillar, i) => (
            <Pillar pillar={pillar} index={i} key={pillar.label}>
                {pillar.label}
            </Pillar>
        ))}
    </Pillars>
);