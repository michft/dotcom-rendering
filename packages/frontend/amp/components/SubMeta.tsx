import React from 'react';
import { css } from '@emotion/core';
import { pillarPalette } from '@frontend/lib/pillars';
import { textSans } from '@guardian/pasteup/typography';
import { palette } from '@guardian/pasteup/palette';
import { ShareIcons } from '@frontend/amp/components/ShareIcons';
import CommentIcon from '@guardian/pasteup/icons/comment.svg';

const guardianLines = css`
    background-image: repeating-linear-gradient(
        to bottom,
        ${palette.neutral[86]},
        ${palette.neutral[86]} 1px,
        transparent 1px,
        transparent 4px
    );
    background-repeat: repeat-x;
    background-position: top;
    background-size: 1px 13px;
    padding-top: 18px;
    margin-top: 12px;
`;

const linkStyle = (pillar: Pillar) => css`
    position: relative;
    padding-left: 5px;
    padding-right: 6px;
    text-decoration: none;
    color: ${pillarPalette[pillar].dark};
    ${textSans(4)};
    :after {
        content: '/';
        ${textSans(5)};
        position: absolute;
        pointer-events: none;
        top: 0;
        right: -3px;
        color: ${palette.neutral[46]};
    }
`;

const itemStyle = css`
    display: inline-block;

    :last-of-type > a::after {
        content: '';
    }
`;

const keywordListStyle = css`
    display: block;
    margin-left: -6px;
    padding-top: 6px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${palette.neutral[86]};
    margin-bottom: 6px;
`;

const sectionLinkStyle = (pillar: Pillar) => css`
    position: relative;
    padding-left: 5px;
    padding-right: 6px;
    text-decoration: none;
    color: ${pillarPalette[pillar].dark};
    ${textSans(5)};
    :after {
        content: '/';
        ${textSans(7)};
        position: absolute;
        pointer-events: none;
        top: 0;
        right: -3px;
        color: ${palette.neutral[46]};
    }
`;

const sectionListStyle = css`
    display: block;
    margin-left: -6px;
`;

const labelStyle = css`
    ${textSans(1)};
    color: ${palette.neutral[46]};
    display: block;
    margin-bottom: -3px;
`;

const siteLinks = css`
    display: flex;
    justify-content: space-between;
`;

const siteLinkStyle = css`
    ${textSans(2)};
    font-weight: bold;
    text-decoration: none;
    color: ${palette.neutral[7]};
    line-height: 36px;
    text-align: right;
`;

const commentIcon = css`
    vertical-align: middle;
    margin-bottom: -5px;
`;

const shareIcons = css`
    padding-bottom: 30px;
`;

export const SubMeta: React.FC<{
    pillar: Pillar;
    sections: SimpleLinkType[];
    keywords: SimpleLinkType[];
    sharingURLs: {
        [K in SharePlatform]?: {
            url: string;
            userMessage: string;
        }
    };
    pageID: string;
    isCommentable: boolean;
}> = ({ pillar, sections, keywords, sharingURLs, pageID, isCommentable }) => {
    const sectionListItems = sections.map(link => (
        <li css={itemStyle} key={link.url}>
            <a
                css={sectionLinkStyle(pillar)}
                href={`https://www.theguardian.com/${link.url}`}
            >
                {link.title}
            </a>
        </li>
    ));

    const keywordListItems = keywords.map(link => (
        <li css={itemStyle} key={link.url}>
            <a
                css={linkStyle(pillar)}
                href={`https://www.theguardian.com/${link.url}`}
            >
                {link.title}
            </a>
        </li>
    ));

    return (
        <>
            <div css={guardianLines}>
                <span css={labelStyle}>Topics</span>
                <ul css={sectionListStyle}>{sectionListItems}</ul>
                <ul css={keywordListStyle}>{keywordListItems}</ul>
            </div>
            <ShareIcons
                css={shareIcons}
                sharingUrls={sharingURLs}
                pillar={pillar}
                displayIcons={[
                    'facebook',
                    'twitter',
                    'email',
                    'linkedIn',
                    'pinterest',
                    'whatsApp',
                    'messenger',
                ]}
            />
            {/* TODO link to actual (non-AMP) site here. Also handle comment count behaviour. */}
            <div css={[guardianLines, siteLinks]}>
                {isCommentable && (
                    <a css={siteLinkStyle} href={`/${pageID}#comments`}>
                        <CommentIcon css={commentIcon} /> View comments
                    </a>
                )}
                <a css={siteLinkStyle} href={`/${pageID}`}>
                    View on theguardian.com
                </a>
            </div>
        </>
    );
};
