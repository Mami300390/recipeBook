"use client";

import Image from "next/image";
import { createClient } from "@/lib/supabase/browser";

export function AuthLanding() {
  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main
      className="grid min-h-screen items-center overflow-hidden bg-cover bg-center px-5 py-6 text-white md:py-8"
      style={{
        backgroundImage:
          "linear-gradient(-90deg,rgba(31,37,32,0.84),rgba(31,37,32,0.28)),url('/flipped.png')",
      }}
    >
      <section className="w-full max-w-3xl md:ml-[max(24px,calc((100vw-1160px)/2))]">
        <div className="mb-5 inline-flex items-center gap-4 rounded-3xl border border-white/15 bg-white/10 px-3 py-2 shadow-2xl shadow-black/20 backdrop-blur-md md:mb-6 sm:mb-7">
          <Image
            src="/booklogo.PNG"
            alt="شعار دفتر الوصفات"
            width={200}
            height={900}
            priority
            className="h-14 w-auto shrink-0 object-contain md:h-16 lg:h-20"
          />
          <h2 className="serif flex flex-col border-r border-white/20 pr-3 text-3xl font-black leading-[0.82] tracking-normal text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:text-4xl lg:text-5xl">
            دفتر
            <span className="mt-2 text-right text-lg tracking-[0.18em] text-[#ffcfbc] [text-shadow:0_2px_14px_rgba(217,79,50,0.45)] md:text-xl lg:text-2xl">
              الوصفات
            </span>
          </h2>
        </div>
        <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#ffcfbc] md:mb-4">
          دفتر وصفات شخصي ومائدة مشتركة
        </p>
        <h1 className="serif max-w-4xl text-5xl font-black leading-[0.9] tracking-normal md:text-6xl lg:text-7xl">
          دفتر الوصفات
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#f8efe4] md:mt-5 md:text-lg md:leading-8">
          احفظ وصفاتك المفضلة، واجعل وصفات العائلة خاصة، وشارك الأطباق العامة مع
          الآخرين، واترك للتطبيق اقتراح وجبة عندما تحتار.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-7">
          <button
            className="min-h-11 rounded-2xl bg-[#d94f32] px-5 font-black text-white shadow-xl shadow-[#d94f32]/30 transition hover:bg-[#b83e27]"
            type="button"
            onClick={signInWithGoogle}
          >
            المتابعة باستخدام Google
          </button>
        </div>
      </section>
    </main>
  );
}
