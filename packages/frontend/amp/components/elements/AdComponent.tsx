import React from 'react';
import { css } from '@emotion/core';
import { until } from '@guardian/pasteup/breakpoints';
import { palette } from '@guardian/pasteup/palette';
import { adJson } from '@frontend/amp/lib/ad-json';

const adStyle = css`
    background: ${palette.neutral[93]};
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiP…AsMy45LTAuOCw3LjMtMi40LDEwLjNDODEsNjIuNSw4Niw1MS42LDg2LDM5LjYiLz48L3N2Zz4=);
    background-size: 105px;
    background-repeat: no-repeat;
    background-position: center;
    border-top: 1px solid ${palette.neutral[86]};
    float: right;
    height: 272px;
    width: 300px;
    margin: 4px 0 12px 20px;

    ${until.phablet} {
        clear: both;
        float: none;
        text-align: center;
        margin-right: auto;
        margin-left: auto;
    }

    :before {
        content: 'Advertisement';
        display: block;
        font-size: 12px;
        line-height: 16px;
        font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande',
            sans-serif;
        padding: 3px 10px;
        color: ${palette.neutral[46]};
        text-align: right;
    }
`;

const dfpAdUnitRoot = 'theguardian.com';

const ampData = (section: string, contentType: string): string => {
    const dfpAccountId = '59666047';

    if (section !== '') {
        return `/${dfpAccountId}/${dfpAdUnitRoot}/${section}/${contentType.toLowerCase()}/amp`;
    }

    return `/${dfpAccountId}/${dfpAdUnitRoot}/amp`;
};

const getPlacementId = (edition: Edition): number => {
    switch (edition) {
        case 'US':
            return 7;
        case 'AU':
            return 6;
        default:
            return 4;
    }
};

const realTimeConfig = (
    edition: Edition,
    useKrux: boolean,
    usePrebid: boolean,
): any => {
    const placementID = getPlacementId(edition);
    const preBidServerPrefix = 'https://prebid.adnxs.com/pbs/v1/openrtb2/amp';
    const kruxURL =
        'https://cdn.krxd.net/userdata/v2/amp/2196ddf0-947c-45ec-9b0d-0a82fb280cb8?segments_key=x&kuid_key=kuid';

    const prebidURL = [
        `${preBidServerPrefix}?tag_id=${placementID}`,
        'w=ATTR(width)',
        'h=ATTR(height)',
        'ow=ATTR(data-override-width)',
        'oh=ATTR(data-override-height)',
        'ms=ATTR(data-multi-size)',
        'slot=ATTR(data-slot)',
        'targeting=TGT',
        'curl=CANONICAL_URL',
        'timeout=TIMEOUT',
        'adcid=ADCID',
        'purl=HREF',
    ].join('&');

    const data = {
        urls: [useKrux ? kruxURL : '', usePrebid ? prebidURL : ''].filter(
            url => url,
        ),
    };

    return JSON.stringify(data);
};

interface CommercialConfig {
    useKrux: boolean;
    usePrebid: boolean;
}

export const AdComponent: React.SFC<{
    edition: Edition;
    section: string;
    contentType: string;
    config: CommercialConfig;
    commercialProperties: CommercialProperties;
}> = ({ edition, section, contentType, config, commercialProperties }) => (
    <div css={adStyle}>
        <amp-ad
            width={300}
            height={250}
            data-npa-on-unknown-consent={true}
            data-loading-strategy={'prefer-viewability-over-views'}
            layout={'responsive'}
            type={'doubleclick'}
            json={adJson(edition, commercialProperties.editionAdTargeting)}
            data-slot={ampData(section, contentType)}
            rtc-config={realTimeConfig(
                edition,
                config.useKrux,
                config.usePrebid,
            )}
        />
    </div>
);
