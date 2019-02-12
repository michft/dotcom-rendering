import React from 'react';
import { ClassNames } from '@emotion/core';
import { palette } from '@guardian/pasteup/palette';
import { headline, textSans } from '@guardian/pasteup/typography';

const sidebarStyles = `
    width: 80vh;
    background-color: ${palette.brand.main};

    [aria-expanded='true'] {
        i {
            margin-top: 0px;
        }

        i:before {
            transform: rotate(-135deg);
        }
    }
`;

const buildTemplate = ({ css, cx }: { css: any; cx: any }): string => {
    const menuGroup = css`
        padding-bottom: 0.75rem;
    `;

    const toggle = css`
        i {
            margin-top: -4px;
            left: 25px;
            position: absolute;

            :before {
                border: 2px solid #fff;
                border-top: 0;
                border-left: 0;
                content: '';
                display: inline-block;
                height: 8px;
                transform: rotate(45deg);
                width: 8px;
                color: ${palette.neutral[100]};
            }
        }
    `;

    const pillarLink = css`
        background-color: transparent;
        border: 0;
        box-sizing: border-box;
        display: block;
        ${headline(4)};
        outline: none;
        padding: 8px 10px 8px 50px;
        position: relative;
        text-align: left;
        width: 100%;
        font-weight: 700;
        padding-bottom: 16px;
        padding-top: 6px;
        color: ${palette.neutral[100]};
        ${toggle};
    `;

    const link = css`
        background-color: transparent;
        border: 0;
        box-sizing: border-box;
        color: ${palette.neutral[100]};
        text-decoration: none;
        display: block;
        ${textSans(7)};
        font-weight: 400;
        outline: none;
        padding: 8px 10px 8px 50px;
        position: relative;
        text-align: left;
        width: 100%;
    `;

    const subLinks = css`
        background-color: #041f4a;
        padding-bottom: 12px;

        a {
            ${link};
        }
    `;

    const otherLinks = css`
        a {
            ${link};
        }
    `;

    const membershipLinks = css`
        a {
            font-weight: 700;
            color: #ffe500;
        }
    `;

    const pillar = css`
        position: relative;

        :not(:last-child):after {
            background-color: rgba(255, 255, 255, 0.3);
            bottom: 0;
            content: '';
            display: block;
            height: 1px;
            left: 50px;
            position: absolute;
            width: 100%;
        }
    `;

    const editionLink = css`
        ${toggle};
    `;

    return `
    <ul class=${menuGroup}>
    {{ #topLevelSections }}
        <li class=${pillar}>
            <amp-accordion>
                <section>
                    <h2 class=${pillarLink}
                        data-link-name="amp : nav : secondary : {{ title }}">
                        <i></i>
                        {{ title }}
                    </h2>

                    <ul class=${subLinks}>
                        {{ #subSections }}
                            <li>
                                <a
                                    href="{{ url }}"
                                    data-link-name="amp : nav : secondary : {{ title }}">
                                    {{ title }}
                                </a>
                            </li>
                        {{ /subSections }}
                    </ul>
                </section>
            </amp-accordion>
        </li>
    {{ /topLevelSections }}
    </ul>

    <ul class=${otherLinks}>
    {{ #readerRevenueLinks }}
        <li class=${membershipLinks}
            role="menuitem">

            <a
                href="{{ url }}"
                data-link-name="amp : nav : {{ title }}">
                {{ title }}
            </a>
        </li>
    {{ /readerRevenueLinks }}

    <li>
        <a href="https://profile.theguardian.com/signin?INTCMP=DOTCOM_NEWHEADER_SIGNIN&ABCMP=ab-sign-in"
            data-link-name="amp : nav : sign in">
            Sign in / Register
        </a>
    </li>
    </ul>

    <amp-accordion>
    <section>
        <h2 class=${cx(link, editionLink)}>
            <i></i>
            Switch edition
        </h2>

        <ul class=${subLinks}>
        {{ #editions }}
            <li>
                <a data-link-name="amp : nav : edition-picker : {{ id }}"
                href="{{ optInLink }}">
                   {{ displayName }}
                </a>
            </li>
        {{ /editions }}
        </ul>
    </section>
    </amp-accordion>

    <ul class=${cx(otherLinks, menuGroup)}>
    {{ #secondarySections }}
        <li>
            <a href="{{ url }}"
                data-link-name="amp : nav : {{ title }}">
                {{ title }}
            </a>
        </li>
    {{ /secondarySections }}
    </ul>
    `;
};

// tslint:disable:react-no-dangerous-html
export const Sidebar: React.FC<{ nav: NavType }> = ({ nav }) => (
    <ClassNames>
        {({ css, cx }) => (
            <amp-sidebar
                class={css`
                    ${sidebarStyles}
                `}
                layout="nodisplay"
                id="sidebar1"
            >
                <amp-list
                    layout="fill"
                    src="https://amp.theguardian.com/editionalised-nav.json"
                >
                    <template type="amp-mustache">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: buildTemplate({ css, cx }),
                            }}
                        />
                    </template>
                </amp-list>
            </amp-sidebar>
        )}
    </ClassNames>
);
