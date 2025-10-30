"use client";

import { Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { PostCard } from "@/features/feed/components/post-card";
import { publishApi, type Publication } from "@/features/publish/services";

export default function MinhasPublicacoesPage() {
  const { data: session, status } = useSession();
  const userId = useMemo(() => (session?.user as any)?.id as string | undefined, [session]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Publication[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await publishApi.listMyPosts(userId);
        setPosts(res?.docs ?? []);
      } catch (e: any) {
        setError(e?.message || "Não foi possível carregar suas publicações.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [userId]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Carregando..." />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-xl font-bold">Minhas publicações</h1>
        <p className="text-default-500">Você precisa estar autenticado para ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default-50">
      <div className="container mx-auto max-w-2xl px-4 pt-8 pb-24">
        <h1 className="mb-6 text-2xl font-bold">Minhas publicações</h1>
        {loading && (
          <div className="flex justify-center py-12">
            <Spinner label="Carregando suas publicações..." />
          </div>
        )}
        {error && (
          <p className="py-4 text-center text-danger">{error}</p>
        )}
        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-default-500">Você ainda não criou nenhuma publicação.</p>
        )}
        <div className="flex flex-col gap-6">
          {!loading && !error && posts.map((p) => <PostCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}
