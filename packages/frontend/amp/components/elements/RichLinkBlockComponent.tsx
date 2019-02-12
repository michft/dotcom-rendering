import React from 'react';
import { css } from '@emotion/core';
import { palette } from '@guardian/pasteup/palette';
import { headline, textSans } from '@guardian/pasteup/typography';
import { pillarPalette } from '@frontend/lib/pillars';

const richLinkContainer = css`
    float: left;
    width: 140px;
    padding: 4px;
    padding-bottom: 18px;
    margin: 4px 10px 12px 0;
    background-color: ${palette.neutral[93]};
    border-top: 1px solid ${palette.neutral[86]};
    margin-right: 20px;
`;

const pillarColour = (pillar: Pillar) => css`
    color: ${pillarPalette[pillar].dark};
`;

const richLink = css`
    font-weight: 500;
    border: 0;
    text-decoration: none;
    ${headline(1)};
    word-wrap: break-word;
    :hover {
        text-decoration: underline;
    }
    ::before {
        ${textSans(1)};
        content: 'More on this topic';
        display: block;
        color: ${palette.neutral[46]};
        font-weight: 400;
    }
`;

export const RichLinkBlockComponent: React.FC<{
    element: RichLinkBlockElement;
    pillar: Pillar;
}> = ({ element, pillar }) => {
    if (element.sponsorship) {
        throw new Error('Sponsored rich links not supported');
    }
    return (
        <aside css={richLinkContainer}>
            <a css={[richLink, pillarColour(pillar)]} href={element.url}>
                {element.text}
            </a>
        </aside>
    );
};
