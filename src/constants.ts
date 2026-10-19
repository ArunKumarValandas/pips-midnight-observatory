import type { WorkflowStage, DeliveryStop, StoryScene, StableStar } from './types';

// Deterministic stable star field for background scenery
export const STABLE_STARS: StableStar[] = [
  { id: 1, x: 5, y: 12, size: 3, opacity: 0.85, delay: 0.2, duration: 3.2 },
  { id: 2, x: 12, y: 28, size: 2, opacity: 0.7, delay: 1.5, duration: 4.1 },
  { id: 3, x: 18, y: 8, size: 4, opacity: 0.95, delay: 0.8, duration: 2.8 },
  { id: 4, x: 26, y: 22, size: 2, opacity: 0.65, delay: 2.1, duration: 3.6 },
  { id: 5, x: 34, y: 14, size: 3, opacity: 0.9, delay: 0.4, duration: 3.9 },
  { id: 6, x: 42, y: 32, size: 2, opacity: 0.6, delay: 1.8, duration: 4.4 },
  { id: 7, x: 49, y: 10, size: 4, opacity: 0.88, delay: 2.5, duration: 3.1 },
  { id: 8, x: 58, y: 24, size: 3, opacity: 0.75, delay: 0.7, duration: 3.5 },
  { id: 9, x: 67, y: 9, size: 2, opacity: 0.82, delay: 1.2, duration: 4.0 },
  { id: 10, x: 74, y: 30, size: 3, opacity: 0.7, delay: 2.0, duration: 3.3 },
  { id: 11, x: 82, y: 15, size: 4, opacity: 0.92, delay: 0.5, duration: 2.9 },
  { id: 12, x: 91, y: 26, size: 2, opacity: 0.68, delay: 1.6, duration: 4.2 },
  { id: 13, x: 96, y: 11, size: 3, opacity: 0.86, delay: 2.3, duration: 3.7 },
  { id: 14, x: 8, y: 48, size: 2, opacity: 0.6, delay: 1.1, duration: 4.5 },
  { id: 15, x: 22, y: 62, size: 3, opacity: 0.8, delay: 0.9, duration: 3.4 },
  { id: 16, x: 38, y: 55, size: 2, opacity: 0.72, delay: 2.4, duration: 3.8 },
  { id: 17, x: 52, y: 68, size: 4, opacity: 0.9, delay: 1.4, duration: 2.7 },
  { id: 18, x: 64, y: 50, size: 2, opacity: 0.64, delay: 0.3, duration: 4.3 },
  { id: 19, x: 79, y: 64, size: 3, opacity: 0.85, delay: 1.9, duration: 3.5 },
  { id: 20, x: 89, y: 46, size: 2, opacity: 0.78, delay: 0.6, duration: 3.9 },
  { id: 21, x: 15, y: 84, size: 3, opacity: 0.75, delay: 2.2, duration: 3.2 },
  { id: 22, x: 31, y: 76, size: 2, opacity: 0.62, delay: 1.0, duration: 4.6 },
  { id: 23, x: 45, y: 88, size: 3, opacity: 0.88, delay: 0.1, duration: 3.0 },
  { id: 24, x: 60, y: 82, size: 2, opacity: 0.7, delay: 1.7, duration: 3.7 },
  { id: 25, x: 72, y: 92, size: 4, opacity: 0.95, delay: 2.7, duration: 2.8 },
  { id: 26, x: 85, y: 78, size: 2, opacity: 0.66, delay: 0.8, duration: 4.0 },
  { id: 27, x: 94, y: 86, size: 3, opacity: 0.84, delay: 1.3, duration: 3.4 }
];

export const PIP_DOSSIER = {
  name: "Pip",
  title: "Junior Dream Engineer",
  organization: "Midnight Nursery, Division of Nocturnal Comfort",
  tagline: "Every little dream begins with a tiny star.",
  species: "Little Starlight Skull Baby (Gentle Skeleton Sprite)",
  appearance: "Soft porcelain-smooth skull with warm blush, cozy pastel-heart fleece onesie, oversized bedtime cap stitched with tiny stars, pink velvet ribbon bow, and eyes that hold warm star-pupil embers.",
  personality: "Endlessly gentle, curious, meticulous daydreamer, quiet giggler, and patient guardian of sleepy thoughts.",
  quirks: [
    "Counts falling shooting stars in binary whenever nervous",
    "Polishes telescope lenses using discarded baby cloud fleece",
    "Whispers 'sweet dreams' to distant constellations before bed",
    "Sweetens bedtime chamomile tea with crystalline star sugar cubes",
    "Carries a miniature spare nightcap just in case a lost star gets chilly"
  ],
  profession: "Junior Dream Engineer (Class III Celestial Artisan)",
  voiceQuotes: [
    {
      context: "When starting the night shift",
      quote: "Sleep tight, little dreamer. The stars are on duty tonight!"
    },
    {
      context: "On facing stormy nightmares",
      quote: "Every scary shadow is just a sweet dream waiting for someone to switch on a nightlight."
    },
    {
      context: "Inspection rule #1",
      quote: "Handle each dream gently... some are woven from the most fragile bedtime wishes."
    },
    {
      context: "Greeting visitors",
      quote: "Welcome to my observatory! Watch your step, there are sleepy stardust sparks everywhere!"
    }
  ],
  toolsOfTrade: [
    { name: "Moon-Catcher Lantern", desc: "Radiates warm golden light that dissolves bedroom fears." },
    { name: "Unicorn Lullaby Box", desc: "Mechanical music cylinder playing soothing cradle tempos." },
    { name: "Velvet Cloud Cruiser", desc: "Low-altitude slumber glider woven from cotton-soft cumulus." },
    { name: "Starlight Caliper", desc: "Measures dream sweetness with millisecond precision." }
  ]
};

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'collect',
    stepNumber: 1,
    title: 'Collect Starlight',
    subtitle: 'Harvesting gentle cosmic embers',
    summary: 'Pip glides along the edges of the Milky Way using velvet starlight nets to gather wandering stellar embers. Only the gentlest, softest twinkling stars are selected for nursery dreams.',
    tools: [
      'Velvet Star-Net with Silk Mesh',
      'Amber Crystal Capture Jars',
      'Nebula Dew Sponge'
    ],
    pipNote: 'Fresh starlight smells faint of lavender and toasted marshmallow. Never harvest a star that is still singing to its moons!',
    craftingTip: 'Keep collection jars away from cold solar winds so the sparks stay warm and bubbly.',
    potencyMetric: {
      label: 'Starlight Purity',
      value: '99.4% Luminous Essence',
      percentage: 92
    }
  },
  {
    id: 'craft',
    stepNumber: 2,
    title: 'Craft the Dream',
    subtitle: 'Spinning light into cozy bedtime stories',
    summary: 'In the observatory workshop, raw starlight is spun through brass prisms into shimmering gossamer thread. Pip weaves soothing colors, gentle melodies, and warm memories into a cozy dream tapestry.',
    tools: [
      'Astral Spindle & Loom',
      'Pastel Memory Dyes (Strawberry, Lavender, Vanilla)',
      'Lullaby Harmonic Tuning Fork'
    ],
    pipNote: 'We always weave extra padding into nightmares to turn scary monsters into clumsy plushies that give hugs!',
    craftingTip: 'A pinch of cloud vapor prevents the dream from unraveling during morning alarms.',
    potencyMetric: {
      label: 'Comfort Factor',
      value: '98.8 Clo Units (Ultra Fluffy)',
      percentage: 98
    }
  },
  {
    id: 'deliver',
    stepNumber: 3,
    title: 'Deliver the Dream',
    subtitle: 'Floating softly toward resting pillows',
    summary: 'The finished dream is sealed in a shimmering moon-bubble. Pip launches it along gentle constellation breeze currents so it drifts down chimney tops and lands whisper-soft under pillows.',
    tools: [
      'Moon-Bubble Capsule Sealer',
      'Constellation Wind Compass',
      'Silent Feather Parachute'
    ],
    pipNote: 'Every dream lands so quietly that even a resting ladybug on the windowsill will not wake up.',
    craftingTip: 'Check the planetary barometric pressure before launching near coastal towns.',
    potencyMetric: {
      label: 'Delivery Precision',
      value: '100% Gentle Landing Guarantee',
      percentage: 100
    }
  }
];

export const DELIVERY_STOPS: DeliveryStop[] = [
  {
    id: 'cloudtop-nursery',
    name: 'Cloudtop Nursery',
    x: 60,
    y: 130,
    recipient: 'Newborn Starlight Kittens',
    dreamType: 'Floating Feathers & Warm Milk',
    windSpeed: '2 knots (Gentle Breeze)',
    altitude: '4,200 meters',
    deliveryStatus: 'Delivered',
    description: 'A cozy cluster of cloud cribs nestled just beneath the crescent moon where tiny celestial kittens nap.',
    specialNote: 'Leave one extra starlight ember beside the silver milk saucer.'
  },
  {
    id: 'whispering-forest',
    name: 'Whispering Forest',
    x: 210,
    y: 70,
    recipient: 'Hibernating Hedgehogs & Owlets',
    dreamType: 'Berry Bramble Lullaby',
    windSpeed: '4 knots (Pine Scented)',
    altitude: '1,100 meters',
    deliveryStatus: 'In Flight',
    description: 'An ancient mossy canopy where baby owlets practice closing their eyes while hedgehogs curl into sleepy balls.',
    specialNote: 'Deliver through the hollow oak knot without rustling dry leaves.'
  },
  {
    id: 'starlit-lagoon',
    name: 'Starlit Lagoon',
    x: 370,
    y: 140,
    recipient: 'Slumbering Swans & Baby Turtles',
    dreamType: 'Rippling Mirror of Stars',
    windSpeed: '1 knot (Glass Calm)',
    altitude: '200 meters',
    deliveryStatus: 'In Flight',
    description: 'Placid turquoise waters reflecting the Milky Way, rocked by gentle rhythmic tides of lavender foam.',
    specialNote: 'Float the dream bubble across the water lily pads for maximum serenity.'
  },
  {
    id: 'cradle-mountain',
    name: 'Cradle Mountain',
    x: 520,
    y: 60,
    recipient: 'Sleepy Stargazers in Cabins',
    dreamType: 'Cozy Hearth & Cinnamon Sparks',
    windSpeed: '6 knots (Crisp Mountain Air)',
    altitude: '2,900 meters',
    deliveryStatus: 'Pending Soft Landing',
    description: 'Timberline observatory cabins with smoking stone chimneys and children tucked under patchwork quilts.',
    specialNote: 'Slip dream down the brass chimney flues right before midnight chiming.'
  }
];

// All 3 scenes strictly under 150 words!
export const ORIGIN_SCENES: StoryScene[] = [
  {
    id: 'the-first-star',
    sceneNumber: 1,
    title: 'The First Star',
    subtitle: 'A wounded ember in the cosmic thorns',
    // 75 words
    text: "Long before the brass telescope ever gleamed atop Midnight Nursery, little Pip wandered the quiet cosmic rim. Tucked between jagged comet thorns lay a faint, bruised starlight whose spark was flickering out. Pip gently lifted the fallen star, wrapped it in warm cloud fleece, and whispered comforting lullabies until its golden ember rekindled. That night, Pip made a solemn vow: no star would fall forgotten, and every sleepy soul would have a guiding light.",
    extendedText: "Pip's Personal Journal Entry: 'I tucked the little star into my cap. It tickled my forehead with warmth. I decided its name is Twinkle, and together we promised to keep watch over all dreamers who fear the dark.'",
    pipQuote: "A tiny star is never too small to chase away a giant shadow.",
    moral: "Great wonders begin with gentle kindness to small things.",
    tag: "Chapter I: Awakening"
  },
  {
    id: 'the-dream-workshop',
    sceneNumber: 2,
    title: 'The Dream Workshop',
    subtitle: 'From a dusty tower to an astral atelier',
    // 74 words
    text: "With the revived star humming upon Pip's shoulder, they climbed into the forgotten tower observatory. The abandoned attic was dusty with nebula grit, but Pip saw endless magic waiting within. Armed with soft feather dusters, brass polish, and celestial prisms, Pip restored the towering telescope, set up spinning looms of silver thread, and built crystal jars to store sweet memories. The observatory became Midnight Nursery's official laboratory for weaving comforting dreams from pure starlight.",
    pipQuote: "Dust off an old telescope, and you will find an entire universe waiting to say hello.",
    moral: "With patience and care, any forgotten corner can become a sanctuary.",
    tag: "Chapter II: Sanctuary"
  },
  {
    id: 'the-great-dream-delivery',
    sceneNumber: 3,
    title: 'The Great Dream Delivery',
    subtitle: 'A maiden voyage across constellation winds',
    // 76 words
    text: "Pip's first solo flight came on a stormy eve when restless thunder shook the cradle clouds. Strapping on the moon-lantern and clutching a satchel of woven courage-dreams, Pip guided their cloud across the Great Bear constellation. Through gale-force stardust winds, Pip slipped into slumbering rooms, slipping gentle dreams beneath pillows. By dawn, every crying child was sleeping peacefully with serene smiles. The High Council pinned a golden star-badge to Pip's onesie: Junior Dream Engineer.",
    pipQuote: "Even when thunder roars, a gentle lullaby travels straight into the heart.",
    moral: "Courage is not the absence of storms, but carrying light through them.",
    tag: "Chapter III: The Engineer's Oath"
  }
];

export const LULLABY_TRACKS = [
  { id: 'serenade', title: 'Starry Cradle Serenade', tempo: '60 BPM (Adagio)', mood: 'Sweet & Restful' },
  { id: 'waltz', title: 'Moonbeam Spinning Waltz', tempo: '68 BPM (Andante)', mood: 'Playful & Gentle' },
  { id: 'hush', title: 'Cloud Nine Whispers', tempo: '54 BPM (Largo)', mood: 'Deep Slumber' }
];
