
import { PubMedArticle } from '../types';

// Interface para tipagem
export interface ScientificPublication {
  external_id: number;
  title: string;
  authors_raw: string;
  journal: string;
  year: number;
  identifiers: {
    pmid?: string;
    pmcid?: string;
    doi?: string;
  };
  urls: {
    pubmed?: string;
    doi?: string;
    pdf?: string;
    html?: string;
  };
  access_type: 'Open' | 'Subscription' | 'Unknown';
  category: string;
  content: {
    full_raw: string;
  };
}

// DATA SOURCE: Articles provided
export const publicationsData: ScientificPublication[] = [
  {
    external_id: 1,
    title: "Comparable isokinetic quadriceps performance six months after ACL reconstruction with rectus femoris versus hamstring tendon autografts",
    authors_raw: "Rêgo MCF, et al.",
    journal: "J Exp Orthop",
    year: 2025,
    identifiers: {
      pmid: "41416242",
      pmcid: "PMC12710082"
    },
    urls: {
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/41416242/"
    },
    access_type: "Open",
    category: "Knee",
    content: {
      full_raw: `## INTRODUCTION
Anterior cruciate ligament (ACL) reconstruction commonly uses autografts due to their high biocompatibility and superior integration compared to allografts or synthetic grafts. However, donor‐site morbidity remains a concern, especially with grafts harvested from key functional muscles.

Among autografts used for ACL reconstruction, hamstring tendons are the most commonly selected worldwide due to their favorable biomechanical properties, ease of harvest, and relatively low donor‐site morbidity. The quadriceps tendon (QT) autograft has recently gained popularity for ACL reconstruction, offering structural strength and versatility in harvesting techniques. A specific technique uses only the superficial layer of the QT—the rectus femoris (RF)—which may reduce morbidity while preserving adequate graft size.

Despite its advantages, concerns remain about postoperative quadriceps weakness due to graft harvesting from the extensor mechanism. Importantly, superficial RF harvest is biomechanically distinct from full‐thickness QT harvest, as it preserves deeper fibers of the quadriceps tendon and is therefore expected to result in less pronounced early quadriceps deficits.

The purpose of this study was to compare isokinetic quadriceps performance between patients undergoing ACL reconstruction with rectus femoris autografts and those with traditional hamstring tendon grafts.`
    }
  },
  {
    external_id: 2,
    title: "Análise antropométrica dos implantes nacionais e importados de artroplastia total de joelho na população brasileira",
    authors_raw: "Ferreira MC, et al.",
    journal: "Rev Bras Ortop (Sao Paulo)",
    year: 2025,
    identifiers: {
      pmid: "41278235",
      pmcid: "PMC12638197"
    },
    urls: {
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/41278235/"
    },
    access_type: "Open",
    category: "Knee",
    content: {
      full_raw: `## Introdução
A artroplastia total do joelho (ATJ) é o tratamento de escolha em pacientes com osteoartrite avançada. O dimensionamento dos implantes utilizados na ATJ é desenvolvido baseados em estudos de morfológicas ósseas de grupos populacionais baseados principalmente nas razões anatômicas articular entre as distâncias anteroposterior (AP) e mediolateral (ML) dos joelhos.

Estudos em diversas populações mundiais como caucasianos, estado-unidense, asiáticos e europeus têm apresentados resultados variáveis para os aspectos morfológicos dos joelhos demonstrando que os implantes disponíveis podem divergir às relações anatômicas de diversas populações étnicas.

O objetivo deste estudo é avaliar a relação de conformidade anatômica de implantes de ATJ em relação a morfologia de joelhos na população brasileira, a fim de identificar quais produtos se adequam melhor aos joelhos desta população.`
    }
  },
  {
    external_id: 3,
    title: "Anthropometric Analysis of Brazilian and Imported Total Knee Arthroplasty Implants in the Brazilian Population",
    authors_raw: "Ferreira MC, et al.",
    journal: "Rev Bras Ortop (Sao Paulo)",
    year: 2025,
    identifiers: {
      pmid: "41278231",
      pmcid: "PMC12638199"
    },
    urls: {
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/41278231/"
    },
    access_type: "Open",
    category: "Knee",
    content: {
      full_raw: `## Introduction
Total knee arthroplasty (TKA) is the treatment of choice for patients with advanced osteoarthritis. The sizing of implants for TKA is based on studies of the bone morphology of population groups, mainly the anatomical articular ratios between the anteroposterior (AP) and mediolateral (ML) distances in the knees.

Studies in several global populations, including Caucasians, Americans, Asians, and Europeans, reported variable results for the morphological aspects of the knees, demonstrating that the available implants may differ from the anatomical relationships in diverse ethnic populations.

The present study aimed to evaluate the relationship between the anatomical conformity of TKA implants and knee morphology in the Brazilian population, to identify which devices best suit the knees of our patients.`
    }
  },
  {
    external_id: 6,
    title: "Inovação tecnológica em artroplastia total do joelho: Navegação, robótica e customização",
    authors_raw: "Luzo MVM, et al.",
    journal: "Rev Bras Ortop (Sao Paulo)",
    year: 2025,
    identifiers: {
      pmid: "41194798",
      pmcid: "PMC12585615"
    },
    urls: {
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/41194798/"
    },
    access_type: "Open",
    category: "Knee",
    content: {
      full_raw: `## Introduction
Total knee arthroplasty (TKA) is the gold-standard surgery for the final stage of gonarthrosis. Even though its clinical outcomes are mostly favorable, it is estimated that approximately 10% of the patients remain dissatisfied with the procedure.

Given the growing demand for TKA and its increasing performance on young adult patients, there is a clear need and search for higher-quality surgical outcomes aiming at implant longevity, a more physiological perception of the joint, better lower limb functionality, and less surgical trauma.

In this context, new technological advances, such as specific instrumentation, guides, and computer-assisted (navigated) and/or automated (robotic) surgery, seek better customization. Moreover, these advances consider the physiology and balance of each patient's ligaments to improve three-dimensional surgical planning.`
    }
  },
  {
    external_id: 8,
    title: "Determinação do posicionamento da linha articular do joelho por meio das distâncias bicondilar femoral e epicondilar na população brasileira",
    authors_raw: "Andrade LAM, et al.",
    journal: "Rev Bras Ortop (Sao Paulo)",
    year: 2025,
    identifiers: {
      pmid: "41194794",
      pmcid: "PMC12585617"
    },
    urls: {
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/41194794/"
    },
    access_type: "Open",
    category: "Knee",
    content: {
      full_raw: `## Review Criteria/Methods
A targeted literature search was conducted using PubMed/MEDLINE, Cochrane Library, and Scopus to identify relevant articles published between January 2013 and May 2025.

Search terms included combinations of "knee dislocation," "multiligament knee injury," "low-resource settings," "developing countries," "vascular injury," "implantless fixation," and "cost-effective orthopedics."

Studies were eligible for inclusion if they focused on the evaluation, diagnosis, surgical treatment, or rehabilitation of knee dislocations in adult populations, particularly in low- or middle-income countries or resource-limited environments.`
    }
  }
];

export const searchLocalPublications = (query: string): ScientificPublication[] => {
  const lowerQuery = query.toLowerCase();
  return publicationsData.filter(pub =>
    pub.title.toLowerCase().includes(lowerQuery) ||
    pub.authors_raw.toLowerCase().includes(lowerQuery) ||
    pub.journal.toLowerCase().includes(lowerQuery) ||
    pub.content.full_raw?.toLowerCase().includes(lowerQuery)
  );
};

export const mapLocalPublicationToPubMed = (pub: ScientificPublication): PubMedArticle => {
  return {
    uid: pub.identifiers.pmid || String(pub.external_id),
    title: pub.title,
    source: pub.journal,
    pubdate: String(pub.year),
    authors: [{ name: pub.authors_raw }],
    url: pub.urls.pubmed || '#',
    abstract: pub.content.full_raw || ''
  };
};
