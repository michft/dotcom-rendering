import React from 'react';
import { css, ClassNames } from '@emotion/core';
import { palette } from '@guardian/pasteup/palette';
import { textSans } from '@guardian/pasteup/typography';

const wrapper = css`
    overflow: hidden;
    position: relative;
    margin-bottom: 12px;
    padding-top: 12px;
    ${textSans(3)};
    padding-left: 20px;
    border-left: 8px solid ${palette.neutral[86]};
    clear: left;
`;

const avatar = `
    float: left;
    margin-right: 20px;
    margin-bottom: 12px;
`;

const metaLink = css`
    border-bottom: 1px solid ${palette.neutral[86]};
    color: ${palette.news.main};
    text-decoration: none;
    ${textSans(1)};
`;

const bodyCSS = css`
    clear: left;

    p {
        ${textSans(5)};
        font-weight: 300;
        margin-top: 0;
        margin-bottom: 8px;
    }
`;

export const CommentBlockComponent: React.FC<{
    element: CommentBlockElement;
}> = ({ element }) => (
    <div css={wrapper}>
        <ClassNames>
            {({ css: cssClassNames }) => (
                <amp-img
                    class={cssClassNames`${avatar}`}
                    layout="fixed"
                    width="40"
                    height="40"
                    src={element.avatarURL}
                />
            )}
        </ClassNames>
        <div>
            <a css={metaLink} href={element.profileURL}>
                {element.profileName}
            </a>
        </div>

        <div>
            <a css={metaLink} href={element.permalink}>
                {element.dateTime}
            </a>
        </div>

        <div // tslint:disable-line:react-no-dangerous-html
            css={bodyCSS}
            dangerouslySetInnerHTML={{ __html: element.body }}
        />
    </div>
);
