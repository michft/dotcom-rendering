import React from 'react';

import {
    MoustacheSection,
    MoustacheVariable,
    MoustacheTemplate,
    moustacheVariable,
} from './primitives/moustache';
import { headline, textSans } from '@guardian/pasteup/typography';

import VideoIcon from '@guardian/pasteup/icons/video-icon.svg';
import PlusIcon from '@guardian/pasteup/icons/plus.svg';
import Camera from '@guardian/pasteup/icons/camera.svg';
import VolumeHigh from '@guardian/pasteup/icons/volume-high.svg';
import Quote from '@guardian/pasteup/icons/quote.svg';
import Clock from '@guardian/pasteup/icons/clock.svg';
import { palette } from '@guardian/pasteup/palette';
import { ClassNames } from '@emotion/core';

const inner = `
    padding-top: 3px;
    overflow: hidden;
    position: relative;
    border-top: 1px solid ${palette.neutral[86]};
    margin-top: 24px;
`;
const header = `
    padding-bottom: 12px;
    font-weight: 500;
    position: relative;
    ${headline(3)};
    text-transform: capitalize;
`;
const item = `
    background-color: ${palette.neutral[93]};
    border-top: 1px solid ${palette.neutral[93]};
    padding-left: 126px;
    position: relative;
    height: 75px;
    margin-bottom: 12px;
    overflow: hidden;
`;
const imageContainer = `
    position: absolute;
    left: 0;
`;
const itemContent = `
    min-height: 60px;
    padding: 0 5px;
    position: relative;
    overflow: hidden;
`;
const link = `
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    overflow: hidden;
    text-indent: 200%;
    white-space: nowrap;
    background: transparent;
`;
const headlineCSS = `
    padding: 0;
    margin: 1px 0 4px;
    font-weight: 500;
    word-wrap: break-word;
    ${headline(1)};
`;

const description = `
    ${headline(2)};
    margin-bottom: 16px;
`;

const iconCSS = `
    svg {
        fill: ${palette.neutral[7]};
        padding-right: 2px;
        height: 13px;
        width: 16px;
    }
`;

const quoteIconCSS = `
    svg {
        fill: ${palette.neutral[60]};
        padding-right: 2px;
        height: 13px;
        width: 16px;
    }
`;

const ageWarning = `
    color: ${palette.neutral[20]};
    fill: ${palette.neutral[20]};
    ${textSans(1)};
`;

const onward = `
    .show-more[overflow] {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        color: ${palette.neutral[7]};
        background-color: ${palette.neutral[100]};
        padding: 0 10px;
        ${textSans(2)};
        line-height: 34px;
        height: 36px;
        font-weight: bold;

        svg {
            width: 18px;
            height: 18px;
            vertical-align: middle;
            margin-top: -2px;
            fill: ${palette.neutral[46]};
            padding-right: 4px;
        }

        :after {
            content: '';
            background-color: ${palette.neutral[86]};
            border-radius: 18px;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 140px;
            z-index: -1;
            color: ${palette.neutral[100]};
        }
    }
`;

export const OnwardContainer: React.FC<{
    guardianBaseURL: string;
    path: string;
}> = ({ guardianBaseURL, path }) => (
    <ClassNames>
        {({ css }) => (
            <amp-list
                layout="fixed-height"
                height="184px"
                src={path}
                credentials="include"
                class={css`
                    ${onward}
                `}
            >
                <MoustacheTemplate>
                    <MoustacheSection name="showContent">
                        <div
                            className={css`
                                ${inner}
                            `}
                        >
                            <div
                                className={css`
                                    ${header}
                                `}
                            >
                                <MoustacheVariable name="displayName" />
                            </div>
                            <MoustacheSection name="description">
                                {/*  Don't show if there is not description WHAT STYLES HERE */}
                                <div
                                    className={css`
                                        ${description}
                                    `}
                                >
                                    <MoustacheVariable name="description" />
                                </div>
                            </MoustacheSection>

                            <MoustacheSection name="content">
                                <MoustacheSection name="headline">
                                    {/* Don't show if headline is empty */}
                                    <div
                                        className={css`
                                            ${item}
                                        `}
                                    >
                                        <div
                                            className={css`
                                                ${imageContainer}
                                            `}
                                        >
                                            <amp-img
                                                src={moustacheVariable(
                                                    'thumbnail',
                                                )}
                                                layout="fixed"
                                                width="126"
                                                height="75"
                                            />
                                        </div>
                                        <div
                                            className={css`
                                                ${itemContent}
                                            `}
                                        >
                                            <div>
                                                <h2
                                                    className={css`
                                                        ${headlineCSS}
                                                    `}
                                                >
                                                    <span
                                                        className={css`
                                                            ${iconCSS}
                                                        `}
                                                    >
                                                        <MoustacheSection name="isVideo">
                                                            <VideoIcon />
                                                        </MoustacheSection>
                                                        <MoustacheSection name="isGallery">
                                                            <Camera />
                                                        </MoustacheSection>
                                                        <MoustacheSection name="isAudio">
                                                            <VolumeHigh />
                                                        </MoustacheSection>
                                                    </span>
                                                    <span
                                                        className={css`
                                                            ${quoteIconCSS}
                                                        `}
                                                    >
                                                        <MoustacheSection name="isComment">
                                                            <Quote />
                                                        </MoustacheSection>
                                                    </span>
                                                    <MoustacheVariable name="headline" />
                                                </h2>
                                                <MoustacheSection name="isComment">
                                                    <div>
                                                        <MoustacheVariable name="byline" />
                                                    </div>
                                                </MoustacheSection>
                                            </div>
                                            <aside
                                                className={css`
                                                    ${ageWarning}
                                                `}
                                            >
                                                <time>
                                                    <MoustacheSection name="showWebPublicationDate">
                                                        <Clock />{' '}
                                                        <MoustacheVariable name="webPublicationDate" />
                                                    </MoustacheSection>
                                                </time>
                                            </aside>
                                        </div>
                                        <a
                                            className={css`
                                                ${link}
                                            `}
                                            // tslint:disable-line:react-a11y-anchors
                                            href={
                                                guardianBaseURL +
                                                moustacheVariable('url')
                                            }
                                        >
                                            <MoustacheVariable name="headline" />
                                        </a>
                                    </div>
                                </MoustacheSection>
                            </MoustacheSection>
                        </div>
                    </MoustacheSection>
                </MoustacheTemplate>
                <div className="show-more" overflow="">
                    <PlusIcon />
                    Show more
                </div>
            </amp-list>
        )}
    </ClassNames>
);
