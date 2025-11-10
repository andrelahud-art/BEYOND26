'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { leadSchema, type LeadFormData } from '@/lib/validators';
import { COUNTRIES } from '@/lib/data/countries';
import { PACKAGES } from '@/lib/data/packages';
import { SHADOW_ARCHETYPES } from '@/lib/data/shadows';
import { analytics } from '@/lib/analytics';
import { generateWhatsAppLink } from '@/lib/utils';



const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '15551234567';
