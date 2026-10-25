import type { Article } from '../types/news';

export const MOCK_ARTICLES: Article[] = [
  // 1. Featured Lead Story
  {
    id: 'feat-1',
    slug: 'india-technology-sector-ai-hardware-innovation',
    title: "India's Technology Sector Enters a New Era of Innovation and Sovereign AI",
    summary: "From next-generation semiconductor fabrication plants in Gujarat to indigenous foundation models, domestic engineering hubs are shifting focus from software outsourcing to high-value intellectual property.",
    content: [
      "NEW DELHI — In a landmark transition reshaping South Asia's economic trajectory, India's domestic technology ecosystem is executing its most ambitious pivot in three decades: moving from an IT services powerhouse to an epicenter for sovereign artificial intelligence and advanced semiconductor packaging.",
      "Industry consortiums and federal task forces this week unveiled a nationwide network of computing clusters dedicated to indigenous linguistic models. The initiative, funded through a public-private partnership, aims to democratize multilingual artificial intelligence across 22 official regional languages.",
      "\"For decades, our engineers built mission-critical architectures for Fortune 500 corporations worldwide,\" explained Dr. Rajeshwar Sen, chief research fellow at the Centre for Strategic Technology Studies. \"Today, we are witnessing the emergence of foundational IP created, validated, and scaled entirely within India's borders.\"",
      "The ripple effects are visible across tier-1 and tier-2 corridors alike. In Bengaluru, Hyderabad, and Pune, venture capital allocations toward deep-tech startups rose by nearly 42% year-over-year. Concurrently, semiconductor fabrication facilities in Dholera and Sanand are reporting operational readiness ahead of original schedules.",
      "Yet, challenges remain. Industry veterans emphasize the urgent requirement for high-density power grids and skilled fab technicians. Nonetheless, policy analysts concur that India has firmly cemented its position at the global high table of high-technology sovereignty."
    ],
    category: 'Technology',
    sourceName: 'The Hindu Businessline',
    sourceUrl: 'https://www.thehindubusinessline.com',
    articleUrl: 'https://www.thehindubusinessline.com/info-tech/india-technology-sovereign-ai',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Advanced microprocessor manufacturing and cleanroom research in Gujarat. Photo: Reuters / Amit Dave',
    publishedAt: '2026-10-25T06:30:00Z',
    author: 'Sunita Ramanathan',
    authorRole: 'Senior Technology Editor',
    featured: true,
    editorPick: true,
    readTime: '5 min read',
    tags: ['Artificial Intelligence', 'Semiconductors', 'India Tech', 'Make in India']
  },

  // 2. Secondary Headline 1
  {
    id: 'sec-1',
    slug: 'global-climate-accord-clean-energy-grid-financing',
    title: "Global Summit Reaches Historic Consensus on Clean Grid Financing for Emerging Economies",
    summary: "Representatives from 140 nations agree on a standardized multilateral framework guaranteeing $300 billion in low-interest green transition bonds.",
    content: [
      "GENEVA — Delegates at the international energy conference concluded six days of intense negotiations with a decisive agreement establishing the Global Resilient Grid Facility.",
      "The pact guarantees $300 billion in de-risked sovereign guarantees, targeted predominantly at modernizing power distribution networks across Southeast Asia, Sub-Saharan Africa, and Latin America.",
      "\"Clean energy generation has outpaced grid absorption capacity for far too long,\" stated European Commissioner for Climate Action Hélène Dubois. \"Without interconnected, high-voltage transmission backbones, renewable gigawatts remain stranded.\"",
      "The agreement also mandates transparent supply chain audits for critical rare earth minerals, ensuring equitable revenue sharing with indigenous host communities."
    ],
    category: 'World',
    sourceName: 'Reuters',
    sourceUrl: 'https://www.reuters.com',
    articleUrl: 'https://www.reuters.com/business/energy/global-summit-clean-grid-financing-2026',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Wind turbines along a high-voltage transmission corridor in western Europe. Photo: AP / Peter Klaas',
    publishedAt: '2026-10-25T05:15:00Z',
    author: 'Marcus Lindemann',
    authorRole: 'European Bureau Chief',
    secondary: true,
    readTime: '4 min read',
    tags: ['Renewable Energy', 'Climate Policy', 'Global Economy']
  },

  // 3. Secondary Headline 2
  {
    id: 'sec-2',
    slug: 'reserve-bank-liquidity-framework-monetary-policy',
    title: "Reserve Bank Unveils Modernized Liquidity Framework to Boost Capital Expenditure",
    summary: "New reserve adjustments provide commercial banks with expanded latitude to fund long-term port, highway, and renewable corridor projects.",
    content: [
      "MUMBAI — The Reserve Bank of India has signaled a calibrated shift toward growth-supportive liquidity architecture, recalibrating the overnight lending window to encourage medium-to-long term infrastructure credit.",
      "Announced following an unscheduled meeting of the Financial Stability Council, the updated norms reduce capital provisioning surcharges on syndicated loans for greenfield logistics hubs.",
      "Equity indices reacted favorably, with infrastructure and banking shares leading gains across major exchanges.",
      "Rating agencies observed that prudent fiscal consolidation by the central government provided monetary planners with the requisite cushion to sustain domestic capital expenditure."
    ],
    category: 'Business',
    sourceName: 'The Indian Express',
    sourceUrl: 'https://indianexpress.com',
    articleUrl: 'https://indianexpress.com/article/business/economy/rbi-liquidity-framework-capex-2026',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'The Reserve Bank of India headquarters in Mumbai. Photo: Express Archive',
    publishedAt: '2026-10-25T04:45:00Z',
    author: 'Kavita Chidambaram',
    authorRole: 'Chief Financial Analyst',
    secondary: true,
    readTime: '3 min read',
    tags: ['RBI', 'Economy', 'Banking', 'Capital Markets']
  },

  // 4. Secondary Headline 3
  {
    id: 'sec-3',
    slug: 'james-webb-telescope-exoplanet-atmosphere-water-vapor',
    title: "James Webb Observatory Detects Complex Water Vapor and Methane on Temperate Super-Earth",
    summary: "Spectroscopic data from 120 light-years away reveals a stable atmosphere with carbon cycle signatures, opening new frontiers in astrobiology.",
    content: [
      "BALTIMORE — Astrophysicists analyzing data from the James Webb Space Telescope's transmission spectrometers have uncovered the most compelling evidence yet of an active volatile cycle on an exoplanet located in its star's habitable zone.",
      "The celestial body, designated TOI-733b, orbits a calm red dwarf star and possesses a radius approximately 1.8 times that of Earth.",
      "\"We observed clear molecular absorption lines for both atmospheric methane and water vapor without oppressive amounts of carbon monoxide,\" reported Dr. Aris Thorne of the Space Telescope Science Institute.",
      "While researchers cautioned that high surface pressures likely preclude terrestrial-like oceans, the atmospheric chemical balance strongly hints at continuous geochemical recycling mechanisms."
    ],
    category: 'Science',
    sourceName: 'Nature Scientific Reports',
    sourceUrl: 'https://www.nature.com',
    articleUrl: 'https://www.nature.com/articles/d41586-toi-733b-atmosphere-2026',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Deep-space star field captured by infrared space observatory sensors. Image: NASA / ESA / STScI',
    publishedAt: '2026-10-25T03:30:00Z',
    author: 'Julian Vance',
    authorRole: 'Science Correspondent',
    secondary: true,
    readTime: '4 min read',
    tags: ['Astronomy', 'James Webb', 'Exoplanets', 'Astrobiology']
  },

  // 5. India Category
  {
    id: 'ind-1',
    slug: 'parliament-passes-digital-citizens-privacy-amendment',
    title: "Parliament Passes Landmark Citizen Privacy Amendment With Cross-Party Support",
    summary: "The legislative package codifies strict limits on administrative data retention, reinforces child safety online, and mandates localized encryption standards.",
    content: [
      "NEW DELHI — After nearly sixteen months of committee hearings and stakeholder consultations, the upper house voted overwhelmingly to approve the Digital Citizens Rights and Privacy Amendment.",
      "The updated legislation establishes an independent statutory authority empowered to audit algorithmic transparency and issue binding sanctions on corporate data breaches.",
      "Key provisions require technology conglomerates to provide unbundled consent options, explicitly barring companies from denying core utility services to users who decline behavioral profiling.",
      "Legal scholars and civic organizations commended the consensus, highlighting the balance struck between national digital infrastructure growth and fundamental civil liberties."
    ],
    category: 'India',
    sourceName: 'The Hindu',
    sourceUrl: 'https://www.thehindu.com',
    articleUrl: 'https://www.thehindu.com/news/national/digital-privacy-bill-passes-parliament-2026',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'The Parliament complex in New Delhi during the autumn legislative session. Photo: The Hindu',
    publishedAt: '2026-10-25T02:15:00Z',
    author: 'Vandana Deshmukh',
    authorRole: 'National Affairs Editor',
    readTime: '4 min read',
    tags: ['Parliament', 'Digital Rights', 'Data Protection', 'Policy']
  },

  {
    id: 'ind-2',
    slug: 'high-speed-rail-corridor-mumbai-ahmedabad-trial-runs',
    title: "Bullet Train Project Commences Automated High-Speed Track Trials Along Gujarat Segment",
    summary: "Engineers clocked trainsets at 320 km/h along the newly commissioned viaduct between Surat and Bilimora, heralding high-speed intercity transit.",
    content: [
      "SURAT — The National High Speed Rail Corporation confirmed that full-scale electrical and aerodynamic track testing has successfully begun on the commercial corridor.",
      "Equipped with advanced vibration dampening and regenerative braking systems, the Shinkansen-derived trainsets performed seamlessly across 85 kilometers of elevated viaducts.",
      "Officials reaffirmed the targeted phased commercial rollout, emphasizing that the project has catalyzed over 300 domestic vendor certifications for precision railway alloys."
    ],
    category: 'India',
    sourceName: 'Press Trust of India',
    sourceUrl: 'https://www.ptinews.com',
    articleUrl: 'https://www.ptinews.com/news/national/mumbai-ahmedabad-bullet-train-trial-run',
    imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e5359815e?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'High-speed railway viaduct structure in western India. Photo: PTI',
    publishedAt: '2026-10-24T18:30:00Z',
    author: 'Siddharth Nair',
    readTime: '3 min read',
    tags: ['Infrastructure', 'Railways', 'Transportation', 'Gujarat']
  },

  {
    id: 'ind-3',
    slug: 'himalayan-watershed-revival-community-agroforestry',
    title: "Community Agroforestry Revitalizes Himalayan Watersheds Across Uttarakhand",
    summary: "Local village councils and conservationists plant over two million indigenous broadleaf oaks to halt soil erosion and restore perennial natural springs.",
    content: [
      "DEHRADUN — In the mid-altitude valleys of Garhwal and Kumaon, a grassroots ecological movement has reversed decades of water table depletion.",
      "By replacing invasive commercial pine monocultures with deep-rooted Banj oak and Rhododendron saplings, communities have recorded a 35% rebound in natural spring discharge.",
      "The initiative has now been adopted as a regional template by the Ministry of Environment and Climate Change."
    ],
    category: 'India',
    sourceName: 'Down To Earth',
    sourceUrl: 'https://www.downtoearth.org.in',
    articleUrl: 'https://www.downtoearth.org.in/forests/himalayan-springshed-revival-uttarakhand',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Terraced hillside agroforestry in the Garhwal Himalayas. Photo: DTE',
    publishedAt: '2026-10-24T14:10:00Z',
    author: 'Tara Bhattacharya',
    readTime: '3 min read',
    tags: ['Environment', 'Himalayas', 'Water Conservation', 'Forestry']
  },

  // 6. World Category
  {
    id: 'wld-1',
    slug: 'pacific-maritime-safety-accord-signed-in-tokyo',
    title: "Ten Indo-Pacific Nations Sign Comprehensive Maritime Safety and Search Accord",
    summary: "The multilateral treaty standardizes real-time satellite telemetry sharing for search and rescue operations while preventing accidental EEZ incursions.",
    content: [
      "TOKYO — Representatives from ten maritime nations including Japan, India, Australia, Indonesia, and the Philippines ratified a formal operational protocol today at the Tokyo Foreign Ministry.",
      "The agreement establishes encrypted civil communication channels between coastal patrols and coordinates rapid-response humanitarian deployments during severe typhoons.",
      "\"Open and predictable sea lanes remain the lifeblood of our interconnected world commerce,\" noted Japan's Foreign Minister during the joint communique."
    ],
    category: 'World',
    sourceName: 'Associated Press',
    sourceUrl: 'https://apnews.com',
    articleUrl: 'https://apnews.com/article/tokyo-maritime-accord-indo-pacific-2026',
    imageUrl: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'A maritime patrol vessel cruising open ocean waters. Photo: AP / Kenji Sato',
    publishedAt: '2026-10-25T01:10:00Z',
    author: 'Kenji Takahashi',
    readTime: '4 min read',
    tags: ['Diplomacy', 'Maritime Security', 'Indo-Pacific', 'Tokyo']
  },

  {
    id: 'wld-2',
    slug: 'latin-america-lithium-processing-consortium',
    title: "South American Lithium Producers Form Regional Value-Addition Consortium",
    summary: "Argentina, Bolivia, and Chile coordinate technical standards to foster domestic battery cell manufacturing instead of raw mineral exportation.",
    content: [
      "SANTIAGO — Meeting in the high Atacama desert, energy ministers from South America's 'Lithium Triangle' announced unified environmental protocols and joint investment incentives for downstream battery component factories.",
      "The move reflects growing determination among developing resource-rich economies to capture higher margins in the global electric vehicle supply chain."
    ],
    category: 'World',
    sourceName: 'BBC News',
    sourceUrl: 'https://www.bbc.com',
    articleUrl: 'https://www.bbc.com/news/world-latin-america-lithium-consortium-2026',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Evaporation ponds in the Atacama lithium salt flats. Photo: BBC / Martin Ramos',
    publishedAt: '2026-10-24T22:15:00Z',
    author: 'Sofia Morales',
    readTime: '3 min read',
    tags: ['Lithium', 'Electric Vehicles', 'Latin America', 'Trade']
  },

  // 7. Politics Category
  {
    id: 'pol-1',
    slug: 'electoral-commission-paper-audit-trail-digital-voting',
    title: "Election Commission Enhances Cryptographic Audit Systems for Electronic Balloting",
    summary: "New open-source verification protocols allow bipartisan technical observers to validate voter-verifiable audit trail checksums in real-time.",
    content: [
      "NEW DELHI — Strengthening public confidence ahead of upcoming state assembly elections, the Election Commission has deployed end-to-end cryptographic checksum verification for electronic voting units.",
      "The upgrade, designed in conjunction with researchers from leading Indian Institutes of Technology, introduces decentralized physical-digital log matching without exposing individual voter identities.",
      "Chief Election Commissioner officials emphasized that zero networking capability has been added, maintaining the standalone air-gapped security model that has anchored the nation's ballot integrity."
    ],
    category: 'Politics',
    sourceName: 'The Indian Express',
    sourceUrl: 'https://indianexpress.com',
    articleUrl: 'https://indianexpress.com/article/india/election-commission-cryptographic-audit-trail',
    imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Election officials conducting ballot verification drills. Photo: Express',
    publishedAt: '2026-10-25T03:50:00Z',
    author: 'Harishankar Iyer',
    readTime: '4 min read',
    tags: ['Elections', 'Democracy', 'Technology in Governance', 'India']
  },

  {
    id: 'pol-2',
    slug: 'european-parliament-algorithmic-fairness-workplace',
    title: "European Parliament Approves Strict Limits on Algorithmic Employee Surveillance",
    summary: "Employers across the 27 EU member states will be legally prohibited from utilizing emotion-recognition AI or predictive termination modeling.",
    content: [
      "STRASBOURG — European lawmakers voted decisively to regulate workplace automated decision-making, cementing strong protections for remote and in-office staff.",
      "The directive requires human oversight before any disciplinary or promotion action influenced by software algorithms can take legal effect."
    ],
    category: 'Politics',
    sourceName: 'Politico Europe',
    sourceUrl: 'https://www.politico.eu',
    articleUrl: 'https://www.politico.eu/article/eu-parliament-bans-algorithmic-workplace-surveillance',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'The hemicycle of the European Parliament in Strasbourg. Photo: European Union',
    publishedAt: '2026-10-24T19:40:00Z',
    author: 'Claire Delacroix',
    readTime: '3 min read',
    tags: ['Labor Law', 'European Union', 'AI Regulation', 'Workplace Rights']
  },

  // 8. Business & Economy
  {
    id: 'biz-1',
    slug: 'fintech-unified-payments-interface-cross-border-expansion',
    title: "India's UPI Crosses 18 Billion Monthly Transactions as Cross-Border Hubs Expand",
    summary: "Real-time remittance linkages with the UAE, Singapore, and France propel bilateral small-merchant settlements to record efficiency.",
    content: [
      "MUMBAI — National Payments Corporation data indicates that instant mobile remittances have hit another all-time peak, driven largely by frictionless merchant settlements and peer-to-peer tourist adoption overseas.",
      "The expansion into European retail terminals has drastically reduced forex transaction costs for travelers and migrant workers alike."
    ],
    category: 'Business',
    sourceName: 'Bloomberg Quint',
    sourceUrl: 'https://www.bloomberg.com',
    articleUrl: 'https://www.bloomberg.com/news/articles/2026-10-25/upi-cross-border-settlements-record',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'A merchant scanning a QR code for mobile financial settlement. Photo: Bloomberg',
    publishedAt: '2026-10-25T05:00:00Z',
    author: 'Rishi Vohra',
    readTime: '3 min read',
    tags: ['Fintech', 'UPI', 'Digital Economy', 'Banking']
  },

  {
    id: 'biz-2',
    slug: 'aviation-sustainable-fuel-blending-mandate',
    title: "Aviation Carriers Ramp Up Bio-Refining Investments Ahead of 2027 Fuel Blending Targets",
    summary: "Airlines secure long-term offtake agreements for agricultural-waste-derived sustainable aviation fuel to comply with statutory carbon limits.",
    content: [
      "DUBAI — Major international airlines announced combined forward contracts exceeding $8 billion for sustainable aviation fuel (SAF) refined from non-food agricultural residues.",
      "The investments are set to accelerate refinery conversions in India, Brazil, and the Gulf, bridging the supply-demand deficit before mandatory 5% blending kicks in."
    ],
    category: 'Business',
    sourceName: 'Financial Times',
    sourceUrl: 'https://www.ft.com',
    articleUrl: 'https://www.ft.com/content/sustainable-aviation-fuel-contracts-2026',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'A commercial aircraft during twilight descent. Photo: FT / Simon Ward',
    publishedAt: '2026-10-24T16:20:00Z',
    author: 'Eleanor Vance',
    readTime: '4 min read',
    tags: ['Aviation', 'Green Economy', 'Airlines', 'SAF']
  },

  // 9. Technology & AI
  {
    id: 'tech-1',
    slug: 'open-source-foundation-models-on-device-reasoning',
    title: "Breakthrough in On-Device Quantization Enables 7B Reasoning Models on Standard Smartphones",
    summary: "Researchers compress mathematical and coding reasoning weights into sub-2GB memory envelopes without sacrificing factual accuracy.",
    content: [
      "SAN FRANCISCO — A collaborative research paper published by an international consortium of open-source artificial intelligence researchers has cracked the efficiency barrier for on-device neural reasoning.",
      "Utilizing dynamic weight-activation ternary precision, the model executes 45 tokens per second directly on mobile silicon without requiring cloud API round-trips.",
      "The development guarantees zero data leakage for medical diagnosis and privacy-sensitive enterprise drafting, while significantly cutting the carbon footprint of massive data centers."
    ],
    category: 'Technology',
    sourceName: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    articleUrl: 'https://techcrunch.com/2026/10/24/on-device-ai-reasoning-breakthrough',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Next-generation neural computing architecture on silicon wafer. Photo: TechCrunch',
    publishedAt: '2026-10-24T20:10:00Z',
    author: 'Devon Caldwell',
    readTime: '4 min read',
    tags: ['Artificial Intelligence', 'Open Source', 'Edge Computing', 'Silicon']
  },

  {
    id: 'tech-2',
    slug: 'quantum-annealing-urban-traffic-optimization',
    title: "Bengaluru Deploys Quantum-Hybrid Algorithms to Optimize Dense Traffic Corridors",
    summary: "Pilot test across 250 intersections reduces peak-hour gridlock and idling emissions by 22% through dynamic signal synchronization.",
    content: [
      "BENGALURU — Municipal traffic administrators partnering with local quantum computing researchers have rolled out an adaptive real-time traffic signal pilot across Outer Ring Road.",
      "By calculating global traffic flow states every ninety seconds using hybrid quantum-classical algorithms, intersections dynamically alter green cycle phases to eliminate bottle-necks.",
      "Commuters have reported noticeable reductions in commute delays, and city planners plan to extend the rollout to southern arterial bridges by early next year."
    ],
    category: 'Technology',
    sourceName: 'The Hindu',
    sourceUrl: 'https://www.thehindu.com',
    articleUrl: 'https://www.thehindu.com/news/cities/bangalore/bengaluru-quantum-traffic-signals',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Smart urban traffic flow visualization in Bengaluru. Photo: The Hindu',
    publishedAt: '2026-10-24T12:00:00Z',
    author: 'Karthik Subbaraman',
    readTime: '3 min read',
    tags: ['Smart Cities', 'Quantum Computing', 'Urban Tech', 'Bengaluru']
  },

  // 10. Science & Environment
  {
    id: 'sci-1',
    slug: 'fusion-energy-magnetic-confinement-net-gain-milestone',
    title: "International Magnetic Confinement Facility Sustains 15-Minute Net Energy Plasma",
    summary: "Superconducting high-temperature magnet coils keep deuterium-tritium plasma stable at 100 million degrees Celsius, confirming engineering viability.",
    content: [
      "CADARACHE — In what physicists are calling the most significant fusion milestone of the decade, experimental reactors have sustained steady-state plasma confinement with a net Q-factor of 1.4 for fifteen continuous minutes.",
      "The results validate the use of rare-earth barium copper oxide (REBCO) magnet tapes, which generate ultra-intense magnetic fields in more compact tokamak vessels.",
      "Commercial fusion developer consortiums stated that pilot grid integration prototypes could realistically break ground before 2032."
    ],
    category: 'Science',
    sourceName: 'Scientific American',
    sourceUrl: 'https://www.scientificamerican.com',
    articleUrl: 'https://www.scientificamerican.com/article/fusion-plasma-confinement-15-minute-record',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Tokamak interior vacuum vessel glow during magnetic confinement trial. Photo: ITER',
    publishedAt: '2026-10-25T01:45:00Z',
    author: 'Dr. Evelyn Brand',
    readTime: '5 min read',
    tags: ['Nuclear Fusion', 'Physics', 'Clean Energy', 'Science']
  },

  {
    id: 'sci-2',
    slug: 'coral-reef-heat-resilience-epigenetic-adaptation',
    title: "Marine Biologists Discover Epigenetic Heat Resistance in Lakshadweep Atoll Corals",
    summary: "Certain Acropora colonies that survived marine heatwaves show heritable gene methylation patterns that protect photosynthetic algae symbionts.",
    content: [
      "KAVARATTI — Marine researchers surveying India's Lakshadweep archipelago have identified thriving coral colonies in warm lagoons that previously experienced severe bleaching.",
      "Genetic sequencing demonstrated that these colonies transmit epigenetic chemical tags to their offspring, enabling cellular heat-shock proteins to activate hours earlier during thermal spikes.",
      "The findings offer crucial blueprints for active ocean restoration nurseries in the Indian Ocean."
    ],
    category: 'Science',
    sourceName: 'Nature Ecology & Evolution',
    sourceUrl: 'https://www.nature.com',
    articleUrl: 'https://www.nature.com/articles/lakshadweep-coral-heat-adaptation-2026',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Vibrant hard coral reef with marine life in tropical shallow waters. Photo: Nature',
    publishedAt: '2026-10-24T09:15:00Z',
    author: 'Meenakshi Sundaram',
    readTime: '4 min read',
    tags: ['Marine Biology', 'Coral Reefs', 'Oceans', 'Climate Adaptation']
  },

  // 11. Sports
  {
    id: 'spt-1',
    slug: 'cricket-test-championship-india-australia-melbourne',
    title: "India Mounts Resolute Fourth-Innings Chase in Melbourne Test With Unbeaten Centuries",
    summary: "Solid middle-order partnerships withstand aggressive reverse swing to guide the visitors toward a thrilling series decider at the MCG.",
    content: [
      "MELBOURNE — On a cracked fifth-day pitch under overcast Victorian skies, India's batting lineup displayed supreme technical resolve, chipping away at a challenging 340-run target in front of 75,000 spectators.",
      "Patience against fiery spells of short-pitched bowling and classical defensive footwork held the home attack at bay throughout the afternoon session.",
      "With 45 runs required and three wickets in hand, cricket analysts are calling it one of the most engrossing Test match finishes of the decade."
    ],
    category: 'Sports',
    sourceName: 'ESPNCricinfo',
    sourceUrl: 'https://www.espncricinfo.com',
    articleUrl: 'https://www.espncricinfo.com/series/ind-in-aus-2026/melbourne-test-day5',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Batsman playing a classical straight drive on turf. Photo: Cricinfo',
    publishedAt: '2026-10-25T06:00:00Z',
    author: 'Anirudh Menon',
    readTime: '3 min read',
    tags: ['Cricket', 'Test Cricket', 'India vs Australia', 'MCG']
  },

  {
    id: 'spt-2',
    slug: 'badminton-all-england-championships-finals-thriller',
    title: "Indian Shuttle Prodigy Clinches All England Open in Three-Game Masterclass",
    summary: "Stunning cross-court smashes and tenacious defensive retrievals seal a 21-18, 19-21, 21-16 victory over world number one in Birmingham.",
    content: [
      "BIRMINGHAM — In a heart-stopping 82-minute final, 21-year-old rising star Ayush Kulkarni captured his first Super 1000 crown, becoming only the third Indian men's singles champion in the 126-year history of the prestigious tournament.",
      "Kulkarni's tactical composure during high-pressure net exchanges proved the difference in the deciding game."
    ],
    category: 'Sports',
    sourceName: 'The Indian Express',
    sourceUrl: 'https://indianexpress.com',
    articleUrl: 'https://indianexpress.com/article/sports/badminton/all-england-open-final-2026',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Badminton shuttlecock on a championship court. Photo: Express Sports',
    publishedAt: '2026-10-24T17:50:00Z',
    author: 'Mihir Vasavda',
    readTime: '3 min read',
    tags: ['Badminton', 'All England', 'Sports', 'Indian Champions']
  },

  // 12. Entertainment & Culture
  {
    id: 'ent-1',
    slug: 'cannes-film-festival-independent-cinema-triumph',
    title: "Independent Indian Docudrama on River Ganga Boatmen Takes Top Honors at Cannes Un Certain Regard",
    summary: "Director Radhika Sen's poetic, naturalistic portrayal of generational riverside traditions earns a nine-minute standing ovation.",
    content: [
      "CANNES — The 79th Cannes Film Festival celebrated a historic win for South Asian independent cinema as 'Echoes of the Ghats' bagged the prestigious Un Certain Regard prize.",
      "Filmed with non-professional actors along the sacred riverbanks of Varanasi, the picture chronicles the daily lives and philosophical musings of boatmen coping with motorized tourism.",
      "International critics hailed the film's evocative 35mm cinematography and deeply moving acoustic score composed with traditional sarangi and bansuri."
    ],
    category: 'Entertainment',
    sourceName: 'Variety',
    sourceUrl: 'https://variety.com',
    articleUrl: 'https://variety.com/2026/film/news/cannes-un-certain-regard-winner-india-ganga-boatmen',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'A cinema projector beam illuminating a theater auditorium. Photo: Variety',
    publishedAt: '2026-10-25T02:40:00Z',
    author: 'Naman Ramachandran',
    readTime: '4 min read',
    tags: ['Cinema', 'Cannes', 'Indie Film', 'Culture', 'Varanasi']
  },

  {
    id: 'ent-2',
    slug: 'classical-music-preservation-digital-archive-project',
    title: "Historic 10,000-Hour Archive of Hindustani and Carnatic Masters Restored in Hi-Res Audio",
    summary: "Rare shellac 78 RPM recordings from 1910 through 1960 are meticulously cleaned using audio machine learning algorithms and released freely for scholars.",
    content: [
      "CHENNAI — A cultural preservation consortium led by the Sangeet Natak Akademi and musicological trusts has completed a five-year restoration project rescuing fragile acetate and wax cylinder recordings.",
      "Listeners can now experience the pristine resonance of vocal masters and instrumental pioneers with background hiss, flutter, and groove damage intelligently eliminated without harmonic loss."
    ],
    category: 'Entertainment',
    sourceName: 'The Hindu',
    sourceUrl: 'https://www.thehindu.com',
    articleUrl: 'https://www.thehindu.com/entertainment/music/classical-recordings-archive-restored-2026',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'A vintage acoustic instrument resting in a listening studio. Photo: The Hindu',
    publishedAt: '2026-10-24T11:20:00Z',
    author: 'Subramanian Swaminathan',
    readTime: '3 min read',
    tags: ['Classical Music', 'Archives', 'Heritage', 'Culture']
  },

  // 13. Additional Articles for Latest News & Load More
  {
    id: 'lat-1',
    slug: 'urban-farming-rooftop-microgreens-delhi-ncr',
    title: "Hydroponic Rooftop Farms Flourish Across Delhi-NCR High-Rises to Cut Food Miles",
    summary: "Residential housing societies turn sunlit terraces into pesticide-free vegetable gardens yielding fresh produce daily.",
    content: [
      "NEW DELHI — Faced with rising organic vegetable prices and supply chain vulnerabilities, residential welfare associations across Noida, Gurugram, and Dwarka have adopted community hydroponic greenhouses.",
      "The modular installations consume 90% less water than conventional soil farming while repurposing building condensate runoff."
    ],
    category: 'India',
    sourceName: 'Hindustan Times',
    sourceUrl: 'https://www.hindustantimes.com',
    articleUrl: 'https://www.hindustantimes.com/cities/delhi-news/urban-hydroponic-rooftop-gardens-2026',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Hydroponic green leafy produce growing in an urban greenhouse. Photo: HT',
    publishedAt: '2026-10-25T06:45:00Z',
    author: 'Anusha Sen',
    readTime: '3 min read',
    tags: ['Urban Agriculture', 'Sustainability', 'Delhi NCR', 'Hydroponics']
  },

  {
    id: 'lat-2',
    slug: 'electric-vehicle-solid-state-battery-field-trials',
    title: "Commercial Automakers Begin Fleet Tests of 1,000-Kilometer Solid-State EV Batteries",
    summary: "Non-flammable ceramic electrolytes promise rapid 12-minute recharge cycles and superior thermal safety in extreme climates.",
    content: [
      "STUTTGART — Two major European automotive groups have deployed a test fleet of 150 luxury sedans powered by solid-state lithium-metal battery packs.",
      "Early telemetry from winter testing in northern Scandinavia indicates less than 4% range degradation at minus 20 degrees Celsius."
    ],
    category: 'Technology',
    sourceName: 'Bloomberg',
    sourceUrl: 'https://www.bloomberg.com',
    articleUrl: 'https://www.bloomberg.com/news/articles/2026-10-25/solid-state-batteries-fleet-trials',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-74a621722e03?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Electric vehicle charging terminal in modern charging station. Photo: Bloomberg',
    publishedAt: '2026-10-25T05:40:00Z',
    author: 'Stefan Mueller',
    readTime: '4 min read',
    tags: ['Electric Vehicles', 'Batteries', 'Automotive', 'Technology']
  },

  {
    id: 'lat-3',
    slug: 'archaeological-excavation-sindhudurg-submerged-port',
    title: "Marine Archaeologists Discover Medieval Submerged Jetty Near Sindhudurg Fort",
    summary: "Stone bollards, copper coinage, and Arabian ceramic shards verify historic maritime trade networks dating back to the 12th century.",
    content: [
      "MALVAN — Marine archaeologists conducting underwater sonar scans along the Konkan coast have unearthed a stone wharf submerged six meters below the modern waterline.",
      "The discovery substantiates historical accounts of bustling spice and textile commerce between western Indian seaports and the Persian Gulf."
    ],
    category: 'Science',
    sourceName: 'The Indian Express',
    sourceUrl: 'https://indianexpress.com',
    articleUrl: 'https://indianexpress.com/article/india/marine-archaeology-sindhudurg-submerged-jetty',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Scuba diver exploring underwater stone archaeological site. Photo: Express',
    publishedAt: '2026-10-25T04:10:00Z',
    author: 'Prashant Kadam',
    readTime: '3 min read',
    tags: ['Archaeology', 'History', 'Maharashtra', 'Maritime Heritage']
  },

  {
    id: 'lat-4',
    slug: 'world-chess-candidates-tournament-prodigies',
    title: "Teen Grandmaster Leads Field After Tactical Queen Sacrifice in Candidates Round 7",
    summary: "Daring tactical play in the Sicilian Defense upends conventional positional chess wisdom in Toronto.",
    content: [
      "TORONTO — In a game already being hailed as a modern tactical benchmark, the young Indian grandmaster sacrificed a queen for rook and knight on move 23, launching an unstoppable kingside attack against the tournament favorite.",
      "Grandmasters in commentary booths praised the profound calculation and composure demonstrated on the global stage."
    ],
    category: 'Sports',
    sourceName: 'ChessBase News',
    sourceUrl: 'https://en.chessbase.com',
    articleUrl: 'https://en.chessbase.com/post/candidates-tournament-2026-round-7-report',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Handcrafted wooden chess pieces during a tournament game. Photo: ChessBase',
    publishedAt: '2026-10-25T02:00:00Z',
    author: 'Sagar Shah',
    readTime: '3 min read',
    tags: ['Chess', 'Candidates 2026', 'Sports', 'Grandmasters']
  },

  {
    id: 'lat-5',
    slug: 'global-grain-reserves-food-security-pact',
    title: "UN Food Agency Establishes Emergency Grain Reserve Nodes Across East Africa",
    summary: "Decentralized modern silos equipped with solar cooling safeguard against seasonal droughts and global maritime bottlenecks.",
    content: [
      "NAIROBI — The World Food Programme has inaugurated five strategic regional grain hubs designed to preserve up to 400,000 metric tons of drought-resistant sorghum and millet.",
      "The facilities utilize solar refrigeration and nitrogen hermetic sealing to store cereals for up to three years without chemical fumigation."
    ],
    category: 'World',
    sourceName: 'Associated Press',
    sourceUrl: 'https://apnews.com',
    articleUrl: 'https://apnews.com/article/un-food-reserves-africa-drought-resilience',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Grain silos standing against agricultural landscape. Photo: AP',
    publishedAt: '2026-10-24T23:30:00Z',
    author: 'Grace Mutua',
    readTime: '4 min read',
    tags: ['Food Security', 'United Nations', 'Agriculture', 'Africa']
  },

  {
    id: 'lat-6',
    slug: 'classical-architecture-restoration-presidential-palace',
    title: "Restoration of Rashtrapati Bhavan's Historic Jaipur Column and Foreshore Gardens Completed",
    summary: "Heritage stone carvers from Rajasthan employ centuries-old lime mortar techniques to restore Edwin Lutyens and Herbert Baker's sandstone details.",
    content: [
      "NEW DELHI — Master artisans have concluded a multi-year delicate conservation effort across the grand ceremonial forecourt of Rashtrapati Bhavan.",
      "The work restored weather-worn red sandstone cornices and intricate lotus motifs while seamlessly integrating invisible storm-water harvesting channels below the lawns."
    ],
    category: 'India',
    sourceName: 'The Hindu',
    sourceUrl: 'https://www.thehindu.com',
    articleUrl: 'https://www.thehindu.com/news/national/rashtrapati-bhavan-heritage-restoration-complete',
    imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde13fbe3497?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Carved sandstone architectural detailing and arches in Delhi. Photo: The Hindu',
    publishedAt: '2026-10-24T15:00:00Z',
    author: 'Divya Trivedi',
    readTime: '3 min read',
    tags: ['Heritage', 'Architecture', 'New Delhi', 'Culture']
  },

  {
    id: 'lat-7',
    slug: 'global-semiconductor-standards-open-architecture',
    title: "Global Chip Designers Standardize Interoperable Chiplet Interfaces Under RISC-V Coalition",
    summary: "Open interface specs allow modular silicon blocks from different foundries to be integrated on a single high-performance package.",
    content: [
      "TAIPEI — In a major step toward curbing skyrocketing microchip fabrication costs, more than fifty semiconductor designers announced unified physical interconnect specifications.",
      "The standard enables startup design houses to mix and match computing cores, neural accelerators, and memory controllers fabricated at different manufacturing nodes."
    ],
    category: 'Technology',
    sourceName: 'Reuters',
    sourceUrl: 'https://www.reuters.com',
    articleUrl: 'https://www.reuters.com/technology/semiconductor-chiplet-standards-risc-v-2026',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Silicon wafer with integrated microcircuit dies. Photo: Reuters',
    publishedAt: '2026-10-24T08:00:00Z',
    author: 'Chen Wei',
    readTime: '4 min read',
    tags: ['Semiconductors', 'Hardware', 'Open Standards', 'Tech']
  },

  {
    id: 'lat-8',
    slug: 'literary-awards-south-asian-fiction-translation',
    title: "International Translation Prize Honors Kannada Masterpiece 'Songs of the Ghats'",
    summary: "The translated historical saga exploring coastal folklore and colonial encounters captivates international literary juries in London.",
    content: [
      "LONDON — The coveted International Translation Prize was awarded to translator Srinath Rao and the estate of celebrated Kannada author K. Shivarama for their English translation of the 1968 epic.",
      "Judges described the prose as 'an indelible sensory portrait of riverine communities balanced on the threshold of modernity.'"
    ],
    category: 'Entertainment',
    sourceName: 'The Guardian',
    sourceUrl: 'https://www.theguardian.com',
    articleUrl: 'https://www.theguardian.com/books/2026/oct/24/translation-prize-winner-kannada-fiction',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Pages of an open hardcover book in natural daylight. Photo: The Guardian',
    publishedAt: '2026-10-24T07:15:00Z',
    author: 'Alice Montgomery',
    readTime: '3 min read',
    tags: ['Literature', 'Books', 'Translation', 'Culture', 'Karnataka']
  }
];
