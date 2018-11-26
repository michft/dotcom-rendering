import React from 'react';
import Footer from '@frontend/amp/components/Footer';
import Container from '@frontend/amp/components/Container';
import Body from '@frontend/amp/components/Body';
import Header from '@frontend/amp/components/Header';
import { palette } from '@guardian/pasteup/palette';
import { css } from 'react-emotion';

const backgroundColour = css`
    background-color: ${palette.neutral[97]};
`;

export interface ArticleModel {
    headline: string;
    standfirst: string;
    elements: CAPIElement[];
    author: AuthorType;
    webPublicationDateDisplay: string;
    pageId: string;
    ageWarning?: string;
    sharingUrls: {
        [K in SharePlatform]?: {
            url: string;
            userMessage: string;
        }
    };
    pillar: Pillar;
    sectionLabel?: string;
    sectionUrl?: string;
    subMetaSectionLinks: SimpleLinkType[];
    subMetaKeywordLinks: SimpleLinkType[];
}

export const Article: React.SFC<{
    nav: NavType;
    articleData: ArticleModel;
    config: ConfigType;
}> = ({ nav, articleData, config }) => (
    <div className={backgroundColour}>
        <Container>
            <Header nav={nav} activePillar={articleData.pillar} />
            <Body
                pillar={articleData.pillar}
                data={articleData}
                config={config}
            />
            <Footer />
        </Container>
    </div>
);

export default Article;
