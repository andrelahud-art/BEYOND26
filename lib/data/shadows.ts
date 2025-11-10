import { ShadowArchetype } from '../types';

export const SHADOW_ARCHETYPES: ShadowArchetype[] = [
  {
    id: 'conversationalist',
    name: 'The Conversationalist',
    description:
      'Friendly, outgoing, and culturally aware. Your Conversationalist Shadow is the ideal companion for solo travelers, influencers, and those who want an engaging, social presence throughout their journey.',
    idealFor: [
      'Solo travelers seeking companionship',
      'Content creators and influencers',
      'First-time visitors to Mexico',
      'Social travelers who enjoy cultural exchange',
      'Those who value local insights and recommendations',
    ],
    keywords: [
      'friendly concierge',
      'cultural guide',
      'social companion',
      'bilingual assistant',
      'travel companion Mexico',
    ],
    characteristics: [
      'Engages in conversation when welcome',
      'Shares cultural insights and local stories',
      'Proactively suggests experiences',
      'Reads social cues expertly',
      'Knows when to speak and when to listen',
      'Acts as social facilitator when needed',
    ],
  },
  {
    id: 'balanced',
    name: 'The Balanced',
    description:
      'Professional, calm, and neutral. The Balanced Shadow is perfect for families and executives who want a reliable presence that intervenes only when it adds value, maintaining the perfect equilibrium between support and independence.',
    idealFor: [
      'Families with children',
      'Business executives',
      'Couples seeking subtle assistance',
      'Groups who value autonomy',
      'Those who prefer professional boundaries',
    ],
    keywords: [
      'family concierge',
      'personal assistant',
      'safe travel',
      'professional concierge',
      'executive assistant Mexico',
    ],
    characteristics: [
      'Professional and courteous demeanor',
      'Intervenes when value is clear',
      'Maintains appropriate distance',
      'Anticipates needs without being intrusive',
      'Adapts to family dynamics',
      'Balances efficiency with empathy',
    ],
  },
  {
    id: 'silent',
    name: 'The Silent Shadow',
    description:
      'Discreet, near-invisible, and security-aware. The Silent Shadow is designed for VIPs, celebrities, and high-privacy individuals who need flawless logistics and protection while maintaining complete discretion.',
    idealFor: [
      'VIPs and celebrities',
      'High-net-worth individuals',
      'Those requiring maximum privacy',
      'Security-conscious travelers',
      'Public figures avoiding attention',
    ],
    keywords: [
      'discreet assistant',
      'VIP handler',
      'private security concierge',
      'celebrity concierge',
      'high-privacy travel',
    ],
    characteristics: [
      'Maintains physical distance (2-3 meters)',
      'Predicts needs before being asked',
      'Communicates via discrete signals',
      'Security protocol awareness',
      'Invisible to casual observers',
      'Always alert, never intrusive',
    ],
  },
];

export function getShadowById(id: string): ShadowArchetype | undefined {
  return SHADOW_ARCHETYPES.find((shadow) => shadow.id === id);
}
