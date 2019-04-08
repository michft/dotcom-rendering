import React, { Component } from 'react';
import { css, cx } from 'emotion';
import { headline } from '@guardian/pasteup/typography';
import { palette } from '@guardian/pasteup/palette';
import { desktop } from '@guardian/pasteup/breakpoints';
import { BigNumber } from '@guardian/guui';
import { AsyncClientComponent } from './lib/AsyncClientComponent';
import { reportError } from '@frontend/web/browser/reportError';

const container = css`
    display: none;

    ${desktop} {
        display: block;
    }
`;

const heading = css`
    ${headline(4)};
    color: ${palette.neutral[7]};
    font-weight: 900;
`;

const subheading = css`
    ${headline(4)};
    color: ${palette.neutral[7]};
`;

const listContainer = css`
    max-width: 300px;
`;

const list = css`
    margin-top: 12px;
`;

const hideList = css`
    display: none;
`;

const listItem = css`
    position: relative;
    box-sizing: border-box;
    padding-top: 6px;
    padding-bottom: 6px;

    &:before {
        position: absolute;
        top: 0;
        right: 10px;
        left: 0;
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: ${palette.neutral[86]};
    }

    :first-of-type {
        &:before {
            display: none;
        }
    }

    &:after {
        content: '';
        display: block;
        clear: both;
    }
`;

const headlineHeader = css`
    margin-top: -4px;
    padding-top: 2px;
    padding-bottom: 2px;
    word-wrap: break-word;
    overflow: hidden;
    padding-left: 18px;
`;

const headlineLink = css`
    text-decoration: none;
    color: ${palette.neutral[7]};
    font-weight: 500;
    ${headline(2)};
`;

const liveKicker = css`
    color: ${palette.news.main};
    font-weight: 700;

    &::after {
        content: '/';
        display: inline-block;
        font-weight: 900;
        margin: 0 4px;
    }
`;

const bigNumber = css`
    float: left;
    margin-top: 3px;
    fill: ${palette.neutral[7]};
`;

interface Trail {
    url: string;
    linkText: string;
    isLiveBlog: boolean;
}

interface Tab {
    heading: string;
    trails: Trail[];
}

interface Props {
    sectionName: string;
}

export class MostSupportedSidebar extends Component<
    Props,
    { selectedTabIndex: number }
> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
        };
    }

    public tabSelected(index: number) {
        this.setState({
            selectedTabIndex: index,
        });
    }

    public render() {
        return (
            <div className={container}>
                <h2 className={heading}>Supporters love</h2>
                <h3 className={subheading}>
                    Stories that have most inspired readers to support Guardian
                    journalism
                </h3>
                <AsyncClientComponent f={this.fetchTrails}>
                    {({ data }) => (
                        <div className={listContainer}>
                            {(data || []).map((tab, i) => (
                                <ol
                                    className={cx(list, {
                                        [hideList]:
                                            i !== this.state.selectedTabIndex,
                                    })}
                                    id={`tabs-popular-${i}`}
                                    key={`tabs-popular-${i}`}
                                    role="tabpanel"
                                    aria-labelledby={`tabs-popular-${i}-tab`}
                                >
                                    {(tab.trails || [])
                                        .slice(0, 5)
                                        .map((trail, ii) => (
                                            <li
                                                className={listItem}
                                                key={trail.url}
                                            >
                                                <span className={bigNumber}>
                                                    <BigNumber index={ii + 1} />
                                                </span>
                                                <h2 className={headlineHeader}>
                                                    <a
                                                        className={headlineLink}
                                                        href={trail.url}
                                                    >
                                                        {trail.isLiveBlog && (
                                                            <span
                                                                className={
                                                                    liveKicker
                                                                }
                                                            >
                                                                Live
                                                            </span>
                                                        )}
                                                        {trail.linkText}
                                                    </a>
                                                </h2>
                                            </li>
                                        ))}
                                </ol>
                            ))}
                        </div>
                    )}
                </AsyncClientComponent>
            </div>
        );
    }

    public fetchTrails: () => Promise<Tab[]> = () => {
        const endpoint = `/most-read.json`;
        return new Promise((resolve, reject) => {
            fetch(`https://api.nextgen.guardianapps.co.uk${endpoint}?guui`)
                .then(response => {
                    if (!response.ok) {
                        resolve([]);
                    }
                    return response.json();
                })
                .then(mostRead => {
                    if (Array.isArray(mostRead)) {
                        resolve(mostRead);
                    }
                    resolve([]);
                })
                .catch(err => {
                    reportError(err, {
                        feature: 'most-viewed',
                    });

                    return resolve([]);
                });
        });
    };
}
