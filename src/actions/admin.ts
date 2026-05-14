"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function verifyAdminRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Use the normal client to fetch the user's own profile
  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return true;
}

export async function getAdminOverviewStats() {
  await verifyAdminRole();
  const adminClient = createAdminClient();

  const [
    { count: usersCount },
    { count: docsCount },
    { count: quizCount },
    { count: logsCount },
    { data: logs },
  ] = await Promise.all([
    adminClient.from("users").select("*", { count: "exact", head: true }),
    adminClient.from("documents").select("*", { count: "exact", head: true }),
    adminClient.from("quizzes").select("*", { count: "exact", head: true }),
    adminClient.from("api_logs").select("*", { count: "exact", head: true }),
    adminClient.from("api_logs").select("action_type, created_at"),
  ]);

  return {
    usersCount: usersCount || 0,
    docsCount: docsCount || 0,
    quizCount: quizCount || 0,
    logsCount: logsCount || 0,
    logs: logs || [],
  };
}

export async function getAdminUsers() {
  await verifyAdminRole();
  const adminClient = createAdminClient();

  const { data: users, error } = await adminClient
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return users;
}

export async function getAdminDocuments() {
  await verifyAdminRole();
  const adminClient = createAdminClient();

  const { data: documents, error } = await adminClient
    .from("documents")
    .select(
      `
      *,
      users ( email )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return documents;
}

export async function getAdminQuizzes() {
  await verifyAdminRole();
  const adminClient = createAdminClient();
  const { data: quizzes, error } = await adminClient
    .from("quizzes")
    .select(
      `
      *,
      users ( email ),
      documents ( filename )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return quizzes;
}

export async function getAdminUsageLogs() {
  await verifyAdminRole();
  const adminClient = createAdminClient();

  const { data: logs, error } = await adminClient
    .from("api_logs")
    .select(
      `
      *,
      users ( email )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return logs;
}
