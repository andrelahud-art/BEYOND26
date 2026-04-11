'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import {
  completeProfileSchema,
  type CompleteProfileInput,
} from '@/lib/validation/schemas';

export function CompleteProfileForm({ email }: { email: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: { locale: 'en' },
  });

  const onSubmit = async (values: CompleteProfileInput) => {
    setSubmitting(true);
    setServerError(null);
    const supabase = createClient();

    const { data: userRow } = await supabase.auth.getUser();
    if (!userRow.user) {
      setServerError('Session expired.');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({
        full_name: values.fullName,
        phone: values.phone ?? null,
        locale: values.locale,
        terms_accepted_at: new Date().toISOString(),
      })
      .eq('id', userRow.user.id);

    setSubmitting(false);
    if (error) {
      setServerError(error.message);
      return;
    }

    router.push('/dashboard/traveler');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input value={email} disabled />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" {...register('fullName')} />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone (optional but recommended)</Label>
        <Input id="phone" type="tel" placeholder="+52 …" {...register('phone')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="locale">Preferred language</Label>
        <select
          id="locale"
          {...register('locale')}
          className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      {serverError && (
        <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {serverError}
        </div>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Saving…' : 'Finish setup'}
      </Button>
    </form>
  );
}
