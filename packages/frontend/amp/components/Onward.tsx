import React from 'react';
import { css, ClassNames } from '@emotion/core';
import Plus from '@guardian/pasteup/icons/plus.svg';
import { InnerContainer } from '@frontend/amp/components/InnerContainer';
import { OnwardContainer } from '@frontend/amp/components/OnwardContainer';

const wrapper = css`
    background-color: white;
    padding-top: 24px;
`;

const outbrainStyle = `
    border-top: none;
`;

const outbrainContainer = (webURL: string, isCompliant: boolean) => {
    const encodedWebURL = encodeURIComponent(`${webURL}`);
    const encodedAMPURL = encodeURIComponent(`${webURL}?amp`);
    const widgetID = isCompliant ? 'AMP_1' : 'AMP_3';
    const outbrainParams = `widgetIds=${widgetID}&htmlURL=${encodedWebURL}&ampURL=${encodedAMPURL}`;
    const outbrainURL = `https://widgets.outbrain.com/hub/amp.html#${outbrainParams}`;

    return (
        <ClassNames>
            {({ css: cssClassNames }) => (
                <amp-iframe
                    key={outbrainURL}
                    height="480"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    layout="fixed-height"
                    frameborder="0"
                    src={outbrainURL}
                    class={cssClassNames`${outbrainStyle}`}
                >
                    <div overflow="true">
                        More stories
                        <Plus />
                    </div>
                </amp-iframe>
            )}
        </ClassNames>
    );
};

const sectionHasMostViewed = (sectionID: string): boolean => {
    const whitelist = new Set([
        'commentisfree',
        'sport',
        'football',
        'fashion',
        'lifeandstyle',
        'education',
        'culture',
        'business',
        'technology',
        'politics',
        'environment',
        'travel',
        'film',
        'media',
        'money',
        'society',
        'science',
        'music',
        'books',
        'stage',
        'cities',
        'tv-and-radio',
        'artanddesign',
        'global-development',
    ]);

    return whitelist.has(sectionID);
};

export const Onward: React.FC<{
    shouldHideAds: boolean;
    pageID: string;
    webURL: string;
    sectionID: string;
    hasStoryPackage: boolean;
    hasRelated: boolean;
    seriesTags: TagType[];
    guardianBaseURL: string;
}> = ({
    shouldHideAds,
    pageID,
    webURL,
    sectionID,
    hasStoryPackage,
    hasRelated,
    seriesTags,
    guardianBaseURL,
}) => {
    const container = (path: string) => (
        <OnwardContainer
            key={path}
            guardianBaseURL={guardianBaseURL}
            path={path}
        />
    );

    const storyPackage = hasStoryPackage
        ? [container(`${guardianBaseURL}/story-package-mf2/${pageID}.json`)]
        : [];

    const series = seriesTags.map(tag =>
        container(`${guardianBaseURL}/series-mf2/${tag.id}.json`),
    );

    const related =
        hasRelated && series.length < 1
            ? [container(`${guardianBaseURL}/related-mf2/${pageID}.json`)]
            : [];

    const mostRead = container(`${guardianBaseURL}/most-read-mf2.json`);

    const hasSectionMostViewed = sectionID && sectionHasMostViewed(sectionID);
    const sectionMostViewed = hasSectionMostViewed
        ? container(
              `${guardianBaseURL}/container/count/1/offset/0/section/${sectionID}/mf2.json`,
          )
        : container(`${guardianBaseURL}/container/count/1/offset/0/mf2.json`);

    const headlines = container(
        `${guardianBaseURL}/container/count/3/offset/${
            hasSectionMostViewed ? 0 : 1 // TODO not entirely sure why this is needed
        }/mf2.json`,
    );

    // Outbrain is compliant if it appears in the top 2 containers
    const outbrainIsCompliant = storyPackage.concat(series).length > 1;
    const outbrain = shouldHideAds
        ? []
        : [outbrainContainer(webURL, outbrainIsCompliant)];

    // Note, if order changes, you may need to recalculate outbrain compliance
    const containers = storyPackage.concat(
        series,
        related,
        outbrain,
        sectionMostViewed,
        mostRead,
        headlines,
    );

    return <InnerContainer css={wrapper}>{containers}</InnerContainer>;
};
